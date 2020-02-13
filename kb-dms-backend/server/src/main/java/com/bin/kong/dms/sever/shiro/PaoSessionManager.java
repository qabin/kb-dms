package com.bin.kong.dms.sever.shiro;

import com.bin.kong.dms.core.constants.CookieConstants;
import org.apache.shiro.web.servlet.Cookie;
import org.apache.shiro.web.servlet.SimpleCookie;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.Serializable;

@Component
public class PaoSessionManager extends DefaultWebSessionManager {
    @Value("${security.session.httponly:#{false}}")
    private Boolean httpOnly;

    @Override
    protected Serializable getSessionId(ServletRequest request, ServletResponse response) {
        cookie_config();
        return super.getSessionId(request, response);
    }

    private void cookie_config() {
        Cookie cookie = new SimpleCookie(CookieConstants.KB_MDS_SESSIONID);
        cookie.setHttpOnly(httpOnly);
        super.setSessionIdCookie(cookie);
    }
}
