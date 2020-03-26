package com.bin.kong.dms.sever.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.bin.kong.dms.core.dynamicdatasource.DynamicDataExeUtils;
import com.bin.kong.dms.core.dynamicdatasource.DynamicSqlOptionTypeWithDruidControl;
import com.bin.kong.dms.core.dynamicdatasource.DynamicSqlOptionTypeEntity;
import com.bin.kong.dms.core.dynamicdatasource.DynamicSqlSyntaxCheck;
import com.bin.kong.dms.core.entity.Result;
import com.bin.kong.dms.core.entity.SqlExeResult;
import com.bin.kong.dms.core.enums.*;
import com.bin.kong.dms.core.utils.PPAesUtils;
import com.bin.kong.dms.core.utils.PPStringUtils;
import com.bin.kong.dms.dao.mapper.config.CfBusGroupMapper;
import com.bin.kong.dms.dao.mapper.config.CfDatasourceMapper;
import com.bin.kong.dms.dao.mapper.result.RsSqlExeRecordMapper;
import com.bin.kong.dms.dao.mapper.result.RsSqlExeResultMapper;
import com.bin.kong.dms.model.config.entity.CfBusGroup;
import com.bin.kong.dms.model.config.entity.CfDatasource;
import com.bin.kong.dms.model.result.entity.RsSqlExeRecord;
import com.bin.kong.dms.model.result.entity.RsSqlExeResult;
import com.bin.kong.dms.sever.service.ISqlExeService;
import com.bin.kong.dms.sever.service.ISqlOptionsTypePermissionService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class SqlExeServiceImpl implements ISqlExeService {
    @Resource
    private RsSqlExeRecordMapper sqlExeRecordMapper;
    @Resource
    private RsSqlExeResultMapper sqlExeResultMapper;
    @Resource
    private CfDatasourceMapper datasourceMapper;
    @Resource
    private CfBusGroupMapper busGroupMapper;
    @Resource
    private ISqlOptionsTypePermissionService sqlOptionsTypePermissionService;

    @Override
    @Async("threadExecutor")
    public void sqlExeAsync(RsSqlExeRecord rsSqlExeRecord, String sql) {
        this.sqlExe(rsSqlExeRecord, sql);
    }


    @Override
    public void sqlExe(RsSqlExeRecord rsSqlExeRecord, String sql) {

        CfDatasource cfDatasource = datasourceMapper.selectByPrimaryKey(rsSqlExeRecord.getDatasource_id());

        String error_msg = null;
        List<DynamicSqlOptionTypeEntity> sqlOptionTypeEntityList = new ArrayList<>();
        try {
            sqlOptionTypeEntityList = DynamicSqlOptionTypeWithDruidControl.dealSqlOptionType(sql, DatasourceTypeEnum.getByType(cfDatasource.getType()));
        } catch (Exception e) {
            error_msg = e.getMessage();
        }

        if (StringUtils.isNotEmpty(error_msg) || CollectionUtils.isEmpty(sqlOptionTypeEntityList)) {
            SqlExeResult sqlExeResult = SqlExeResult.builder()
                    .start_time(new Date())
                    .end_time(new Date())
                    .sql(sql)
                    .message(StringUtils.isNotEmpty(error_msg) ? error_msg : "请输入要执行的SQL！")
                    .success(false)
                    .build();
            sqlExeResultMapper.insertSelective(RsSqlExeResult.builder()
                    .sql_exe_record_id(rsSqlExeRecord.getId())
                    .sql_text(sql)
                    .create_time(new Date())
                    .update_time(new Date())
                    .creator_account(rsSqlExeRecord.getCreate_account())
                    .creator_name(rsSqlExeRecord.getCreate_name())
                    .status(SqlExeResultStatusEnum.FAIL.getStatus())
                    .db(rsSqlExeRecord.getDb())
                    .datasource_name(cfDatasource.getName())
                    .datasource_id(cfDatasource.getId())
                    .datasource_type(cfDatasource.getType())
                    .sql_option_type(SqlOptionTypeEnum.DQL.getType())
                    .group_id(cfDatasource.getGroup_id())
                    .group_name(getGroupName(cfDatasource.getGroup_id()))
                    .result(JSON.toJSONString(sqlExeResult, SerializerFeature.WriteMapNullValue))
                    .build());

            sqlExeRecordMapper.updateByPrimaryKeySelective(RsSqlExeRecord.builder()
                    .status(SqlExeRecordStatusEnum.COMPLETE.getStatus())
                    .id(rsSqlExeRecord.getId())
                    .update_time(new Date())
                    .build());

            return;
        }


        sqlOptionTypeEntityList.forEach(sqlOptionTypeEntity -> {
            RsSqlExeResult rsSqlExeResult = RsSqlExeResult.builder()
                    .sql_exe_record_id(rsSqlExeRecord.getId())
                    .sql_text(sqlOptionTypeEntity.getOrigin_sql())
                    .create_time(new Date())
                    .update_time(new Date())
                    .creator_account(rsSqlExeRecord.getCreate_account())
                    .creator_name(rsSqlExeRecord.getCreate_name())
                    .status(SqlExeResultStatusEnum.RUNNING.getStatus())
                    .db(rsSqlExeRecord.getDb())
                    .datasource_name(cfDatasource.getName())
                    .datasource_id(cfDatasource.getId())
                    .datasource_type(cfDatasource.getType())
                    .sql_option_type(sqlOptionTypeEntity.getOption_type_enum().getType())
                    .group_id(cfDatasource.getGroup_id())
                    .group_name(getGroupName(cfDatasource.getGroup_id()))
                    .table_name_list(null != PPStringUtils.getTableNames(sqlOptionTypeEntity.getSql()) ? String.join(",",PPStringUtils.getTableNames(sqlOptionTypeEntity.getSql())) : null)
                    .build();

            sqlExeResultMapper.insertSelective(rsSqlExeResult);

            //检查权限
            Result sqlCheck = sqlOptionsTypePermissionService.check(sqlOptionTypeEntity, rsSqlExeRecord.getCreate_account(), rsSqlExeRecord.getDatasource_id());
            if (sqlCheck.isSuccess()) {
                //检查sql语法问题
                DynamicSqlSyntaxCheck.check(sqlOptionTypeEntity);

                if (null != sqlOptionTypeEntity.getSyntax_check_result_enum()) {
                    if (sqlOptionTypeEntity.getSyntax_check_result_enum().getStop()) {
                        sqlExeResultMapper.updateByPrimaryKeySelective(RsSqlExeResult.builder()
                                .status(SqlExeResultStatusEnum.FAIL.getStatus())
                                .syntax_error_sql(sqlOptionTypeEntity.getOrigin_sql())
                                .syntax_error_type(sqlOptionTypeEntity.getSyntax_check_result_enum().getType())
                                .update_time(new Date())
                                .id(rsSqlExeResult.getId())
                                .result(JSON.toJSONString(SqlExeResult.builder().message(sqlOptionTypeEntity.getSyntax_check_result_enum().getMessage()).build(), SerializerFeature.WriteMapNullValue))
                                .build());
                    } else {
                        List<SqlExeResult> exeResultList = DynamicDataExeUtils.exeSql(sqlOptionTypeEntity.getSql(), cfDatasource.getId(), cfDatasource.getType(), cfDatasource.getIp(), cfDatasource.getPort(), rsSqlExeRecord.getDb(), cfDatasource.getUsername(), PPAesUtils.decodeAES(cfDatasource.getPassword()));
                        if (!CollectionUtils.isEmpty(exeResultList)) {
                            SqlExeResult sqlExeResult = exeResultList.get(0);

                            RsSqlExeResult result = RsSqlExeResult.builder()
                                    .update_time(new Date())
                                    .status(sqlExeResult.isSuccess() ? SqlExeResultStatusEnum.SUCCESS.getStatus() : SqlExeResultStatusEnum.FAIL.getStatus())
                                    .id(rsSqlExeResult.getId())
                                    .result(JSON.toJSONString(sqlExeResult, SerializerFeature.WriteMapNullValue))
                                    .build();

                            if (sqlOptionTypeEntity.getSyntax_check_result_enum().getType().equals(SqlSyntaxCheckResultEnum.NO_LIMIT.getType())) {
                                if (null != sqlExeResult.getData() && ((List<Map<String, Object>>) sqlExeResult.getData()).size() == DynamicSqlSyntaxCheck.LIMIT_ROW_NUM) {
                                    result.setSyntax_error_sql(sqlOptionTypeEntity.getOrigin_sql());
                                    result.setSyntax_error_type(sqlOptionTypeEntity.getSyntax_check_result_enum().getType());
                                }
                            }
                            sqlExeResultMapper.updateByPrimaryKeySelective(result);
                        }


                    }
                } else {
                    List<SqlExeResult> exeResultList = DynamicDataExeUtils.exeSql(sqlOptionTypeEntity.getSql(), cfDatasource.getId(), cfDatasource.getType(), cfDatasource.getIp(), cfDatasource.getPort(), rsSqlExeRecord.getDb(), cfDatasource.getUsername(), PPAesUtils.decodeAES(cfDatasource.getPassword()));
                    if (!CollectionUtils.isEmpty(exeResultList)) {
                        SqlExeResult sqlExeResult = exeResultList.get(0);
                        sqlExeResultMapper.updateByPrimaryKeySelective(RsSqlExeResult.builder()
                                .status(sqlExeResult.isSuccess() ? SqlExeResultStatusEnum.SUCCESS.getStatus() : SqlExeResultStatusEnum.FAIL.getStatus())
                                .update_time(new Date())
                                .id(rsSqlExeResult.getId())
                                .result(JSON.toJSONString(sqlExeResult, SerializerFeature.WriteMapNullValue))
                                .build());
                    }
                }

            } else {
                sqlExeResultMapper.updateByPrimaryKeySelective(RsSqlExeResult.builder()
                        .status(SqlExeResultStatusEnum.FAIL.getStatus())
                        .update_time(new Date())
                        .id(rsSqlExeResult.getId())
                        .syntax_error_sql(sqlOptionTypeEntity.getOrigin_sql())
                        .syntax_error_type(SqlSyntaxCheckResultEnum.NO_PERMISSION.getType())
                        .result(JSON.toJSONString(SqlExeResult.builder().message(sqlCheck.getMessage()).build(), SerializerFeature.WriteMapNullValue))
                        .build());
            }

        });

        sqlExeRecordMapper.updateByPrimaryKeySelective(RsSqlExeRecord.builder()
                .status(SqlExeRecordStatusEnum.COMPLETE.getStatus())
                .id(rsSqlExeRecord.getId())
                .update_time(new Date())
                .build());
    }

    private String getGroupName(Integer group_id) {
        try {
            CfBusGroup busGroup = busGroupMapper.selectByPrimaryKey(group_id);
            if (null != busGroup) {
                return busGroup.getName();
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}
