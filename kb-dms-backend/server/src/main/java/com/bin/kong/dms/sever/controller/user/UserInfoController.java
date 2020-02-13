package com.bin.kong.dms.sever.controller.user;

import com.bin.kong.dms.contract.common.BaseSearch;
import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.contract.user.request.UpdateUserInfoRequest;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.core.constants.UserInfoConstants;
import com.bin.kong.dms.dao.mapper.user.UserInfoMapper;
import com.bin.kong.dms.model.user.entity.UserInfo;
import com.bin.kong.dms.model.user.entity.UserInfoDTO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.InvalidSessionException;
import org.apache.shiro.session.Session;
import org.springframework.http.MediaType;
import org.springframework.util.DigestUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@RestController
@Slf4j
public class UserInfoController {
    @Resource
    private UserInfoMapper userInfoMapper;

    @RequestMapping(value = "/user/info", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_get_user_info() {
        GenericResponse response = new GenericResponse();
        try {
            Session session = SecurityUtils.getSubject().getSession();

            UserInfoDTO userInfo = (UserInfoDTO) session.getAttribute(UserInfoConstants.CURRENT_USER);

            if (userInfo != null && userInfo.getAccount() != null) {
                response.setData(userInfo);
                response.setStatus(ResponseConstants.SUCCESS_CODE);
                response.setMessage("获取用户信息成功");
            } else {
                response.setStatus(ResponseConstants.STATUS_UNLOGIN);
                response.setMessage("未获取到登录信息");
            }
        } catch (InvalidSessionException e) {
            log.error("执行ajax_get_user_info异常：" + e);
        }
        return response;
    }

    @RequestMapping(value = "/user/info", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_update_user_info(@RequestBody UpdateUserInfoRequest request) {
        GenericResponse response = new GenericResponse();
        try {
            Session session = SecurityUtils.getSubject().getSession();

            UserInfo userInfo = (UserInfo) session.getAttribute(UserInfoConstants.CURRENT_USER);

            UserInfo dbUserInfo = userInfoMapper.selectByLoginName(userInfo.getAccount());
            if (dbUserInfo != null && dbUserInfo.getId() != null) {

                if (request.getNew_pwd() != null && !(DigestUtils
                        .md5DigestAsHex(request.getOld_pwd().trim().getBytes()).equals(dbUserInfo.getLogin_pwd()))) {
                    response.setStatus(ResponseConstants.FAIL_CODE);
                    response.setMessage("密码不正确！");
                    return response;
                }

                userInfoMapper.updateByPrimaryKeySelective(UserInfo.builder()
                        .id(dbUserInfo.getId())
                        .name(request.getName())
                        .login_pwd(request.getNew_pwd() != null ? DigestUtils
                                .md5DigestAsHex(request.getNew_pwd().trim().getBytes()) : null)
                        .update_time(new Date())
                        .build());

                if (null != request.getName()) {
                    userInfo.setName(request.getName());
                }
                if (null != request.getNew_pwd()) {
                    userInfo.setLogin_pwd(DigestUtils
                            .md5DigestAsHex(request.getNew_pwd().trim().getBytes()));
                }
                session.setAttribute(UserInfoConstants.CURRENT_USER, userInfo);

                response.setStatus(ResponseConstants.SUCCESS_CODE);
                response.setMessage("更新成功！");
            } else {
                response.setStatus(ResponseConstants.STATUS_UNLOGIN);
                response.setMessage("更新失败！");
            }
        } catch (InvalidSessionException e) {
            log.error("执行ajax_update_user_info异常：" + e);
        }
        return response;
    }

    @RequestMapping(value = "user/_search", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse user_search(@RequestParam(required = false) String kw) {
        GenericResponse response = new GenericResponse();
        try {
            List<UserInfo> userList = userInfoMapper.searchList(BaseSearch.builder()
                    .kw(kw)
                    .build());
            response.setData(userList);
            response.setStatus(ResponseConstants.SUCCESS_CODE);
        } catch (Exception e) {
            log.error("执行user_search异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
        }
        return response;
    }

}
