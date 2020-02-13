package com.bin.kong.dms.sever.config;

import com.bin.kong.dms.sever.shiro.MyCredentialsMatcher;
import com.bin.kong.dms.sever.shiro.MyExceptionHandler;
import com.bin.kong.dms.sever.shiro.MyShiroRealm;
import com.bin.kong.dms.sever.shiro.PaoSessionManager;
import org.apache.shiro.authc.credential.CredentialsMatcher;
import org.apache.shiro.realm.ldap.DefaultLdapRealm;
import org.apache.shiro.session.mgt.SessionManager;
import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.web.filter.DelegatingFilterProxy;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.util.LinkedHashMap;
import java.util.Map;

@Configuration
public class ShiroConfig {


    @Bean(name = "shiroFilter")
    public ShiroFilterFactoryBean shiroFilter(DefaultWebSecurityManager securityManager) {
//        System.out.println("ShiroConfiguration.shirFilter()");
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        shiroFilterFactoryBean.setSecurityManager(securityManager);
        Map<String, String> filterChainDefinitionMap = new LinkedHashMap<>();
        //注意过滤器配置顺序 不能颠倒
        //配置退出 过滤器,其中的具体的退出代码Shiro已经替我们实现了，登出后跳转配置的loginUrl
        filterChainDefinitionMap.put("/logout", "anon");
        filterChainDefinitionMap.put("/api/logout", "anon");
        filterChainDefinitionMap.put("/unauth", "anon");
        filterChainDefinitionMap.put("/api/unauth", "anon");
        // 配置不会被拦截的链接 顺序判断
        filterChainDefinitionMap.put("/login", "anon");
        filterChainDefinitionMap.put("/api/login", "anon");
        filterChainDefinitionMap.put("/api/open/**", "anon");
        filterChainDefinitionMap.put("/**", "anon");
//        filterChainDefinitionMap.put("/**", "anon");
        //配置shiro默认登录界面地址，前后端分离中登录界面跳转应由前端路由控制，后台仅返回json数据
        shiroFilterFactoryBean.setLoginUrl("/api/unauth");
        // 登录成功后要跳转的链接
//        shiroFilterFactoryBean.setSuccessUrl("/index");
        //未授权界面;
//        shiroFilterFactoryBean.setUnauthorizedUrl("/403");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
        return shiroFilterFactoryBean;
    }


    @Bean(name = "lifecycleBeanPostProcessor")
    public LifecycleBeanPostProcessor lifecycleBeanPostProcessor() {
        return new LifecycleBeanPostProcessor();
    }


    @Bean
    @DependsOn("lifecycleBeanPostProcessor")
    public DefaultLdapRealm realm(@Qualifier("credentialsMatcher") CredentialsMatcher matcher) {
        MyShiroRealm realm = new MyShiroRealm();
        realm.setCredentialsMatcher(matcher);
        return realm;
    }



    @Bean(name = "securityManager")
    public DefaultWebSecurityManager defaultWebSecurityManager(DefaultLdapRealm realm) {
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        //设置realm
        securityManager.setRealm(realm);
        // 自定义session管理
        securityManager.setSessionManager(sessionManager());
        return securityManager;
    }


    //自定义sessionManager
    @Bean
    public SessionManager sessionManager() {
        PaoSessionManager paoSessionManager = new PaoSessionManager();
        //设置超时时间8小时，单位毫秒
        paoSessionManager.setGlobalSessionTimeout(86400000L);
        return paoSessionManager;
    }

    @Bean
    public DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator() {
        DefaultAdvisorAutoProxyCreator creator = new DefaultAdvisorAutoProxyCreator();
        creator.setProxyTargetClass(true);
        return creator;
    }

    /**
     * 开启shiro aop注解支持.
     *
     * @param securityManager
     * @return
     */
    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(DefaultWebSecurityManager securityManager) {
        AuthorizationAttributeSourceAdvisor advisor = new AuthorizationAttributeSourceAdvisor();
        advisor.setSecurityManager(securityManager);
        return advisor;
    }

    /**
     * 注册全局异常处理
     *
     * @return
     */
    @Bean(name = "exceptionHandler")
    public HandlerExceptionResolver handlerExceptionResolver() {
        return new MyExceptionHandler();
    }

    @Bean
    public FilterRegistrationBean delegatingFilterProxy(){
        FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean();
        DelegatingFilterProxy proxy = new DelegatingFilterProxy();
        proxy.setTargetFilterLifecycle(true);
        proxy.setTargetBeanName("shiroFilter");
        filterRegistrationBean.setFilter(proxy);
        filterRegistrationBean.setOrder(0);
        return filterRegistrationBean;
    }

    @Bean(name = "credentialsMatcher")
    public CredentialsMatcher credentialsMatcher() {
        return new MyCredentialsMatcher();
    }
}
