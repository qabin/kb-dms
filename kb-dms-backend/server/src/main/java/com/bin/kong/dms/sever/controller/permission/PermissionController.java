package com.bin.kong.dms.sever.controller.permission;

import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.contract.permission.response.SqlOptionsResponse;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.core.enums.SqlOptionTypeEnum;
import com.bin.kong.dms.core.enums.SqlOptionTypeEnumForPermission;
import com.bin.kong.dms.dao.mapper.config.*;
import com.bin.kong.dms.model.config.entity.*;
import com.bin.kong.dms.sever.controller.common.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@Slf4j
public class PermissionController extends BaseController {
    @Resource
    private CfDatasourceMapper datasourceMapper;
    @Resource
    private CfDatasourceOwnersMapper datasourceOwnersMapper;
    @Resource
    private CfBusGroupMapper groupMapper;
    @Resource
    private CfBusGroupOwnersMapper groupOwnersMapper;
    @Resource
    private CfBusGroupUsersMapper groupUsersMapper;
    @Resource
    private CfAdminConfigMapper adminConfigMapper;
    @Resource
    private CfDatasourcePermissionSqlOptionsMapper datasourcePermissionSqlOptionsMapper;

    @RequestMapping(value = "/permission/sql/options", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_get_sql_options() {
        GenericResponse response = new GenericResponse();
        List<SqlOptionsResponse> responseList = Arrays.stream(SqlOptionTypeEnumForPermission.values()).map(d -> SqlOptionsResponse.builder()
                .name(d.getName())
                .type(d.getType())
                .desc(d.getDesc())
                .build()).collect(Collectors.toList());

        response.setData(responseList);
        response.setStatus(ResponseConstants.SUCCESS_CODE);
        return response;
    }


    @RequestMapping(value = "/permission/datasource/{id}/_update", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_get_datasource_update_permission(@PathVariable("id") Integer id) {
        GenericResponse response = new GenericResponse();
        response.setData(false);
        response.setStatus(ResponseConstants.SUCCESS_CODE);

        if (is_admin()) {
            response.setData(true);
            return response;
        }
        CfDatasource datasource = datasourceMapper.selectByPrimaryKey(id);
        if (datasource.getCreator_account().equals(super.getUserInfoDTO().getAccount())) {
            response.setData(true);
            return response;
        }

        List<CfDatasourceOwners> datasourceOwnersList = datasourceOwnersMapper.selectList(CfDatasourceOwners.builder()
                .datasource_id(id)
                .build());

        if (CollectionUtils.isNotEmpty(datasourceOwnersList)) {
            for (CfDatasourceOwners cfDatasourceOwners : datasourceOwnersList) {
                if (cfDatasourceOwners.getAccount().equals(super.getUserInfoDTO().getAccount())) {
                    response.setData(true);
                    return response;
                }

            }
        }
        return response;
    }

    @RequestMapping(value = "/permission/datasource/{id}/sql/_options", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_get_datasource_permission_sql_options(@PathVariable("id") Integer id) {
        GenericResponse response = new GenericResponse();

        try {
            List<CfDatasourcePermissionSqlOptions> permissionSqlOptionsList = datasourcePermissionSqlOptionsMapper.selectList(CfDatasourcePermissionSqlOptions.builder()
                    .account(super.getUserInfoDTO().getAccount())
                    .datasource_id(id)
                    .build());

            if (CollectionUtils.isEmpty(permissionSqlOptionsList)) {
                CfDatasource datasource = datasourceMapper.selectByPrimaryKey(id);
                List<CfBusGroupUsers> groupUsers = groupUsersMapper.selectList(CfBusGroupUsers.builder()
                        .bus_group_id(datasource.getGroup_id())
                        .account(super.getUserInfoDTO().getAccount())
                        .build());

                if (CollectionUtils.isNotEmpty(groupUsers)) {
                    for (SqlOptionTypeEnum value : SqlOptionTypeEnum.values()) {
                        permissionSqlOptionsList.add(CfDatasourcePermissionSqlOptions.builder()
                                .option_type(value.getType())
                                .build());
                    }


                }
            }
            response.setData(permissionSqlOptionsList);
            response.setStatus(ResponseConstants.SUCCESS_CODE);
        } catch (Exception e) {
            log.error("执行ajax_get_datasource_permission_sql_options异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
        }

        return response;
    }

    @RequestMapping(value = "/permission/group/{id}/_update", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_get_group_update_permission(@PathVariable("id") Integer id) {
        GenericResponse response = new GenericResponse();
        response.setData(false);
        response.setStatus(ResponseConstants.SUCCESS_CODE);

        if (is_admin()) {
            response.setData(true);
            return response;
        }

        CfBusGroup busGroup = groupMapper.selectByPrimaryKey(id);
        if (busGroup.getCreator_account().equals(super.getUserInfoDTO().getAccount())) {
            response.setData(true);
            return response;
        }

        List<CfBusGroupOwners> groupOwnersList = groupOwnersMapper.selectList(CfBusGroupOwners.builder()
                .bus_group_id(id)
                .build());

        if (CollectionUtils.isNotEmpty(groupOwnersList)) {
            for (CfBusGroupOwners groupOwners : groupOwnersList) {
                if (groupOwners.getAccount().equals(super.getUserInfoDTO().getAccount())) {
                    response.setData(true);
                    return response;
                }

            }
        }
        return response;
    }

    /**
     * @return
     */
    private Boolean is_admin() {
        List<CfAdminConfig> adminList = adminConfigMapper.selectList(CfAdminConfig.builder()
                .account(super.getUserInfoDTO().getAccount())
                .build());
        if (CollectionUtils.isNotEmpty(adminList)) {
            for (CfAdminConfig cfAdminConfig : adminList) {
                if (cfAdminConfig.getAccount().equals(super.getUserInfoDTO().getAccount())) {
                    return true;
                }
            }
        }
        return false;

    }
}
