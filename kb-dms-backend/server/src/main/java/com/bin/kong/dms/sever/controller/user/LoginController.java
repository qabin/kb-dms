package com.bin.kong.dms.sever.controller.user;

import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.contract.user.request.LoginRequest;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.dao.mapper.user.UserInfoMapper;
import com.bin.kong.dms.model.user.entity.UserInfo;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.subject.Subject;
import org.springframework.http.MediaType;
import org.springframework.util.DigestUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@Slf4j
public class LoginController {
    @Resource
    private UserInfoMapper userInfoMapper;

    /**
     * 登录接口
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/user/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_user_login(@RequestBody LoginRequest request) {
        GenericResponse response = new GenericResponse();
        try {
            Subject subject = SecurityUtils.getSubject();

            if (StringUtils.isEmpty(request.getAccount())) {
                response.setStatus(ResponseConstants.FAIL_CODE);
                response.setMessage("请输入账号！");
                return response;
            }

            UserInfo user = userInfoMapper.selectByLoginName(request.getAccount().trim());
            if (ObjectUtils.isEmpty(user)) {
                response.setStatus(ResponseConstants.FAIL_CODE);
                response.setMessage("账号不存在！");
                return response;
            }

            UsernamePasswordToken token = new UsernamePasswordToken(request.getAccount().trim(), DigestUtils.md5DigestAsHex(request.getLogin_pwd().trim().getBytes()));
            subject.login(token);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (UnknownAccountException e) {
            response.setMessage("账号不存在");
            response.setStatus(ResponseConstants.STATUS_WRONG_PWD);
            log.error("执行ajax_user_login异常：" + e);
        } catch (IncorrectCredentialsException e) {
            response.setMessage("用户名/密码不正确");
            response.setStatus(ResponseConstants.STATUS_WRONG_PWD);
            log.error("执行ajax_user_login异常：" + e);
        } catch (LockedAccountException e) {
            response.setMessage("账号已锁定");
            response.setStatus(ResponseConstants.STATUS_OTHER);
            log.error("执行ajax_user_login异常：" + e);
        } catch (AuthenticationException e) {
            response.setMessage("登录异常!");
            response.setStatus(ResponseConstants.STATUS_OTHER);
            log.error("执行ajax_user_login异常：" + e);
        } catch (Exception e) {
            response.setMessage("登录异常!");
            log.error("执行ajax_user_login异常：" + e);
        }

        return response;
    }

    /**
     * 退出接口
     *
     * @return
     */
    @RequestMapping(value = "/user/logout", method = RequestMethod.GET)
    public GenericResponse logout() {
        GenericResponse genericResponse = new GenericResponse();
        try {
            SecurityUtils.getSubject().logout();
            genericResponse.setStatus(ResponseConstants.SUCCESS_CODE);
            genericResponse.setMessage("退出成功");
        } catch (Exception e) {
            log.error("退出异常：" + e.getCause());
            genericResponse.setStatus(ResponseConstants.FAIL_CODE);
        }
        return genericResponse;

    }

}
