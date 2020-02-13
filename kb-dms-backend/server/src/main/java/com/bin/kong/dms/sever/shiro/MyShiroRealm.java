package com.bin.kong.dms.sever.shiro;

import com.bin.kong.dms.core.constants.UserInfoConstants;
import com.bin.kong.dms.dao.mapper.config.CfAdminConfigMapper;
import com.bin.kong.dms.dao.mapper.user.UserInfoMapper;
import com.bin.kong.dms.model.config.entity.CfAdminConfig;
import com.bin.kong.dms.model.user.entity.UserInfo;
import com.bin.kong.dms.model.user.entity.UserInfoDTO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.ldap.DefaultLdapRealm;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.util.ObjectUtils;

import javax.annotation.Resource;
import java.util.List;

@Slf4j
public class MyShiroRealm extends DefaultLdapRealm {
    @Resource
    private UserInfoMapper userInfoMapper;
    @Resource
    private CfAdminConfigMapper adminConfigMapper;

    /**
     * 登录认证
     *
     * @param authenticationToken
     * @return
     * @throws AuthenticationException
     */
    @Override
    public AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        Session session = SecurityUtils.getSubject().getSession();
        try {
            //加这一步的目的是在Post请求的时候会先进认证，然后在到请求
            if (authenticationToken.getPrincipal() == null) {
                return null;
            }
            //获取用户信息
            String name = authenticationToken.getPrincipal().toString();
            UserInfo user = userInfoMapper.selectByLoginName(name);
            if (ObjectUtils.isEmpty(user) || user.getId() == null) {
                //这里返回后会报出对应异常
                return null;
            } else {
                //这里验证authenticationToken和simpleAuthenticationInfo的信息

                List<CfAdminConfig> cfAdminConfigList = adminConfigMapper.selectList(CfAdminConfig.builder()
                        .account(user.getAccount())
                        .build());
                SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo(user.getAccount(), user.getLogin_pwd(), getName());
                session.setAttribute(UserInfoConstants.CURRENT_USER_NAME, authenticationToken.getPrincipal().toString());
                session.setAttribute(UserInfoConstants.CURRENT_USER, UserInfoDTO.builder()
                        .account(user.getAccount())
                        .name(user.getName())
                        .is_admin(CollectionUtils.isNotEmpty(cfAdminConfigList) ? true : false)
                        .build());
                return simpleAuthenticationInfo;
            }

        } catch (Exception e) {
            session.removeAttribute(UserInfoConstants.CURRENT_USER_NAME);
            session.removeAttribute(UserInfoConstants.CURRENT_USER);
            throw new AuthenticationException(e);
        } finally {

        }
    }

    /**
     * 授权认证
     *
     * @param principals
     * @return
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        Session session = SecurityUtils.getSubject().getSession();
//        String loginId = (String) principals.getPrimaryPrincipal();
        UserInfo userInfoDTO = (UserInfo) session.getAttribute(UserInfoConstants.CURRENT_USER_NAME);
        try {
//            RolePermissionContainer rolePermissionContainer = userBiz.getRolePermission(loginId);
//            Set<String> roleNames = rolePermissionContainer.getRolesName();
//            authorizationInfo.setRoles(roleNames);
//            Set<String> permissions = rolePermissionContainer.getPermissionsName();
//            authorizationInfo.setStringPermissions(permissions);
//            if (userInfoDTO.getRoles() != null && userInfoDTO.getRoles().size() > 0) {
//                Set<String> roles = new HashSet<>(userInfoDTO.getRoles());
//                authorizationInfo.setRoles(roles);
//            }
//            if (userInfoDTO.getPermissions() != null && userInfoDTO.getPermissions().size() > 0) {
//                Set<String> permissions = new HashSet<>(userInfoDTO.getPermissions());
//                authorizationInfo.setStringPermissions(permissions);
//            }
        } catch (Exception ex) {
            log.error(ex.toString());
        }

        return authorizationInfo;
    }
}
