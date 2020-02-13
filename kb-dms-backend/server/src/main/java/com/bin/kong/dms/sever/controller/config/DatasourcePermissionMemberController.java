package com.bin.kong.dms.sever.controller.config;

import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.contract.config.response.DatasourcePermissionMemberResponse;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.core.enums.SqlOptionTypeEnum;
import com.bin.kong.dms.dao.mapper.config.CfDatasourcePermissionMemberMapper;
import com.bin.kong.dms.dao.mapper.config.CfDatasourcePermissionSqlOptionsMapper;
import com.bin.kong.dms.model.config.entity.CfDatasourcePermissionMember;
import com.bin.kong.dms.model.config.entity.CfDatasourcePermissionSqlOptions;
import com.bin.kong.dms.model.user.entity.UserInfoDTO;
import com.bin.kong.dms.sever.controller.common.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@RestController
@Slf4j
public class DatasourcePermissionMemberController extends BaseController {

    @Resource
    private CfDatasourcePermissionMemberMapper datasourcePermissionMemberMapper;
    @Resource
    private CfDatasourcePermissionSqlOptionsMapper permissionSqlOptionsMapper;

    @RequestMapping(value = "/datasource/{id}/permission/member", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_get_datasource_permission_member(@PathVariable("id") Integer id) {

        GenericResponse response = new GenericResponse();
        try {

            List<CfDatasourcePermissionMember> datasourcePermissionSqlOptionsList = datasourcePermissionMemberMapper.selectList(CfDatasourcePermissionMember.builder()
                    .datasource_id(id)
                    .build());
            List<DatasourcePermissionMemberResponse> permissionMemberResponseList = new ArrayList<>();
            for (CfDatasourcePermissionMember cfDatasourcePermissionMember : datasourcePermissionSqlOptionsList) {
                DatasourcePermissionMemberResponse permissionMemberResponse = DatasourcePermissionMemberResponse.builder()
                        .account(cfDatasourcePermissionMember.getAccount())
                        .name(cfDatasourcePermissionMember.getName())
                        .datasource_id(id)
                        .build();

                List<CfDatasourcePermissionSqlOptions> permissionSqlOptionsList = permissionSqlOptionsMapper.selectList(CfDatasourcePermissionSqlOptions.builder()
                        .account(cfDatasourcePermissionMember.getAccount())
                        .datasource_id(id)
                        .build());

                permissionMemberResponse.setAuth_list(permissionSqlOptionsList);

                permissionMemberResponseList.add(permissionMemberResponse);
            }


            response.setData(permissionMemberResponseList);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("查询数据源用户权限配置信息异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }


    @RequestMapping(value = "/datasource/{id}/permission/member", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.POST)
    public GenericResponse ajax_add_datasource_permission_member(@PathVariable("id") Integer id, @RequestBody UserInfoDTO request) {

        GenericResponse response = new GenericResponse();
        try {

            List<CfDatasourcePermissionMember> permissionMemberList = datasourcePermissionMemberMapper.selectList(CfDatasourcePermissionMember.builder()
                    .account(request.getAccount())
                    .datasource_id(id)
                    .build());
            if (CollectionUtils.isEmpty(permissionMemberList)) {
                datasourcePermissionMemberMapper.insertSelective(CfDatasourcePermissionMember.builder()
                        .datasource_id(id)
                        .account(request.getAccount())
                        .name(request.getName())
                        .build());

                //默认开通查询权限
                permissionSqlOptionsMapper.insertSelective(CfDatasourcePermissionSqlOptions.builder()
                        .option_type(SqlOptionTypeEnum.DQL.getType())
                        .account(request.getAccount())
                        .datasource_id(id)
                        .build());

            }
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("添加数据源用户权限配置信息异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    @RequestMapping(value = "/datasource/{id}/permission/member", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.DELETE)
    public GenericResponse ajax_delete_datasource_permission_member(@PathVariable("id") Integer id, @RequestParam String account) {

        GenericResponse response = new GenericResponse();
        try {
            datasourcePermissionMemberMapper.deleteByKeySelective(CfDatasourcePermissionMember.builder()
                    .datasource_id(id)
                    .account(account)
                    .build());

            //删除用户，则删除用户下配置的权限
            permissionSqlOptionsMapper.deleteByKeySelective(CfDatasourcePermissionSqlOptions.builder()
                    .datasource_id(id)
                    .account(account)
                    .build());

            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("删除数据源用户权限配置信息异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }
}
