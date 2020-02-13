package com.bin.kong.dms.sever.controller.user;

import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.contract.user.request.RegisterRequest;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.dao.mapper.user.UserInfoMapper;
import com.bin.kong.dms.model.user.entity.UserInfo;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.Date;

@RestController
@Slf4j
public class RegisterController {
    @Resource
    private UserInfoMapper userInfoMapper;

    @RequestMapping(value = "/user/register", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_register(@RequestBody RegisterRequest request) {
        GenericResponse response = new GenericResponse();
        try {
            UserInfo oldUserInfo = userInfoMapper.selectByLoginName(request.getAccount());
            if (null != oldUserInfo) {
                response.setStatus(ResponseConstants.FAIL_CODE);
                response.setMessage("账号已存在！");
                return response;

            }

            if (StringUtils.isNotEmpty(request.getAccount()) && StringUtils.isNotEmpty(request.getLogin_pwd())) {
                UserInfo userInfo = UserInfo.builder()
                        .create_time(new Date())
                        .account(request.getAccount().trim())
                        .login_pwd(DigestUtils
                                .md5DigestAsHex(request.getLogin_pwd().trim().getBytes()))
                        .name(request.getName().trim())
                        .update_time(new Date())
                        .build();
                userInfoMapper.insertSelective(userInfo);
                response.setStatus(ResponseConstants.SUCCESS_CODE);
            }
        } catch (Exception e) {
            response.setStatus(ResponseConstants.FAIL_CODE);
            log.error("执行ajax_register异常：" + e);
        }

        return response;
    }
}
