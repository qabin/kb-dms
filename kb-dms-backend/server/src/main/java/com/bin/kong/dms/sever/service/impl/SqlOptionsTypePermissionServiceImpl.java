package com.bin.kong.dms.sever.service.impl;

import com.bin.kong.dms.core.dynamicdatasource.DynamicSqlOptionTypeEntity;
import com.bin.kong.dms.core.entity.Result;
import com.bin.kong.dms.core.enums.SqlOptionTypeEnum;
import com.bin.kong.dms.core.enums.SqlQuerySwitchEnum;
import com.bin.kong.dms.core.enums.SqlSyntaxCheckResultEnum;
import com.bin.kong.dms.dao.mapper.config.CfBusGroupUsersMapper;
import com.bin.kong.dms.dao.mapper.config.CfDatasourceMapper;
import com.bin.kong.dms.dao.mapper.config.CfDatasourceOwnersMapper;
import com.bin.kong.dms.dao.mapper.config.CfDatasourcePermissionSqlOptionsMapper;
import com.bin.kong.dms.model.config.entity.CfBusGroupUsers;
import com.bin.kong.dms.model.config.entity.CfDatasource;
import com.bin.kong.dms.model.config.entity.CfDatasourceOwners;
import com.bin.kong.dms.model.config.entity.CfDatasourcePermissionSqlOptions;
import com.bin.kong.dms.sever.service.ISqlOptionsTypePermissionService;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SqlOptionsTypePermissionServiceImpl implements ISqlOptionsTypePermissionService {
    @Resource
    private CfDatasourceMapper cfDatasourceMapper;
    @Resource
    private CfDatasourcePermissionSqlOptionsMapper permissionSqlOptionsMapper;
    @Resource
    private CfDatasourceOwnersMapper datasourceOwnersMapper;
    @Resource
    private CfBusGroupUsersMapper groupUsersMapper;

    @Override
    public Result check(DynamicSqlOptionTypeEntity sqlOptionTypeEntity, String account, Integer datasource_id) {

        CfDatasource datasource = cfDatasourceMapper.selectByPrimaryKey(datasource_id);


        List<CfDatasourceOwners> datasourceOwnersList = datasourceOwnersMapper.selectList(CfDatasourceOwners.builder()
                .datasource_id(datasource_id)
                .build());

        datasourceOwnersList.add(CfDatasourceOwners.builder()
                .account(datasource.getCreator_account())
                .name(datasource.getCreator_name())
                .build());

        List<String> ownerList = datasourceOwnersList.stream().map(CfDatasourceOwners::getName).collect(Collectors.toList());

        List<String> distinctOwnerList = new ArrayList<>();
        ownerList.forEach(d -> {
            if (!distinctOwnerList.contains(d)) {
                distinctOwnerList.add(d);
            }
        });


        Result result = Result.builder()
                .message("无相应执行权限!请联系数据源负责人：" + distinctOwnerList.stream().collect(Collectors.joining(",")))
                .success(false)
                .build();

        List<CfDatasourcePermissionSqlOptions> permissionSqlOptionsList = permissionSqlOptionsMapper.selectList(CfDatasourcePermissionSqlOptions.builder()
                .datasource_id(datasource_id)
                .account(account)
                .build());

        if (CollectionUtils.isEmpty(permissionSqlOptionsList)) {
            List<CfBusGroupUsers> groupUsers = groupUsersMapper.selectList(CfBusGroupUsers.builder()
                    .bus_group_id(datasource.getGroup_id())
                    .account(account)
                    .build());

            if (CollectionUtils.isNotEmpty(groupUsers)) {
                for (SqlOptionTypeEnum value : SqlOptionTypeEnum.values()) {
                    permissionSqlOptionsList.add(CfDatasourcePermissionSqlOptions.builder()
                            .option_type(value.getType())
                            .build());
                }


            }
        }

        if (CollectionUtils.isNotEmpty(permissionSqlOptionsList)) {

            boolean flag = false;

            for (CfDatasourcePermissionSqlOptions permissionSqlOptions : permissionSqlOptionsList) {
                if (sqlOptionTypeEntity.getOption_type_enum() == SqlOptionTypeEnum.EXEC) {
                    flag = true;
                } else {

                    if (permissionSqlOptions.getOption_type() == sqlOptionTypeEntity.getOption_type_enum().getType()) {
                        flag = true;
                        break;
                    }
                }

            }

            if (flag) {
                result.setSuccess(true);
            }

        } else {
            if (datasource.getQuery_switch() == SqlQuerySwitchEnum.OPEN.getStatus()) {
                if (sqlOptionTypeEntity.getOption_type_enum().getType() == SqlOptionTypeEnum.DQL.getType()) {
                    result.setSuccess(true);
                }


                if (sqlOptionTypeEntity.getOption_type_enum() == SqlOptionTypeEnum.EXEC) {
                    result.setSuccess(true);
                }
            }
        }

        if (!result.isSuccess()) {
            sqlOptionTypeEntity.setSyntax_check_result_enum(SqlSyntaxCheckResultEnum.NO_PERMISSION);
        }
        return result;
    }
}
