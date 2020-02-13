package com.bin.kong.dms.sever.shiro;

import com.alibaba.fastjson.support.spring.FastJsonJsonView;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.core.exception.UserNotExistException;
import com.bin.kong.dms.core.exception.UserStatusException;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authz.UnauthenticatedException;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.naming.CommunicationException;
import javax.naming.NamingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.LinkedHashMap;
import java.util.Map;

public class MyExceptionHandler implements HandlerExceptionResolver {

    public ModelAndView resolveException(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception ex) {
        ex.printStackTrace();

        Map<String, Object> attributes = new LinkedHashMap<>();
        if (ex instanceof UnauthenticatedException) {
            attributes.put("err_code", ResponseConstants.STATUS_TOKEN_ERROR);
            attributes.put("msg", "token错误");
        } else if (ex instanceof UnauthorizedException) {
            attributes.put("err_code", ResponseConstants.STATUS_NO_AUTH);
            attributes.put("msg", "用户无权限");
        } else if (ex instanceof AuthenticationException) {
            Throwable cause = ex.getCause();
            if (cause instanceof UserNotExistException) {
                attributes.put("msg", "用户不存在");
            } else if (cause instanceof UserStatusException) {
                attributes.put("msg", cause.getMessage());
            } else if (cause instanceof CommunicationException) {
                attributes.put("msg", "请求超时");
            } else if (cause instanceof NamingException) {
                attributes.put("msg", "用户名密码错误");
            } else {
                attributes.put("msg", String.format("登录异常:%s", cause.getMessage()));
            }
            attributes.put("err_code", ResponseConstants.STATUS_WRONG_PWD);
        } else {
            attributes.put("err_code", ResponseConstants.STATUS_OTHER);
            attributes.put("msg", ex.getMessage());
        }

        FastJsonJsonView view = new FastJsonJsonView();
        view.setAttributesMap(attributes);

        return new ModelAndView(view);
    }
}
