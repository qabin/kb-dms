package com.bin.kong.dms.sever.controller.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.contract.utils.SqlExeRequest;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.core.entity.TableFieldEntity;
import com.bin.kong.dms.core.enums.DatasourceTypeEnum;
import com.bin.kong.dms.core.enums.SqlExeRecordStatusEnum;
import com.bin.kong.dms.core.enums.SqlExeResultStatusEnum;
import com.bin.kong.dms.core.utils.DbUtils;
import com.bin.kong.dms.core.utils.PPAesUtils;
import com.bin.kong.dms.dao.mapper.config.CfDatasourceMapper;
import com.bin.kong.dms.dao.mapper.result.RsSqlExeRecordMapper;
import com.bin.kong.dms.dao.mapper.result.RsSqlExeResultMapper;
import com.bin.kong.dms.model.config.entity.CfDatasource;
import com.bin.kong.dms.model.result.entity.RsSqlExeRecord;
import com.bin.kong.dms.model.result.entity.RsSqlExeResult;
import com.bin.kong.dms.sever.controller.common.BaseController;
import com.bin.kong.dms.sever.service.ISqlExeService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

@RestController
@Slf4j
public class SqlExeController extends BaseController {

    @Resource
    private RsSqlExeRecordMapper sqlExeRecordMapper;
    @Resource
    private ISqlExeService sqlExeService;
    @Resource
    private CfDatasourceMapper datasourceMapper;
    @Resource
    private RsSqlExeResultMapper sqlExeResultMapper;


    @RequestMapping(value = "/datasource/{id}/{db}/async/_exe", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.POST)
    public GenericResponse ajax_datasource_db_async_sql_exe(@PathVariable("id") Integer id, @PathVariable("db") String db, @RequestBody SqlExeRequest request) {

        GenericResponse response = new GenericResponse();
        try {

            if (StringUtils.isNotEmpty(request.getSql())) {
                String sql = request.getSql();

                RsSqlExeRecord rsSqlExeRecord = RsSqlExeRecord.builder()
                        .sql_text(request.getSql())
                        .create_account(super.getUserInfoDTO().getAccount())
                        .create_name(super.getUserInfoDTO().getName())
                        .update_time(new Date())
                        .create_time(new Date())
                        .datasource_id(id)
                        .status(SqlExeRecordStatusEnum.RUNNING.getStatus())
                        .db(db)
                        .build();

                sqlExeRecordMapper.insertSelective(rsSqlExeRecord);

                sqlExeService.sqlExeAsync(rsSqlExeRecord, sql);

                response.setData(rsSqlExeRecord.getId());
                response.setStatus(ResponseConstants.SUCCESS_CODE);
            }


        } catch (Exception e) {
            log.error("ajax_datasource_db_async_sql_exe执行接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }


    @RequestMapping(value = "/datasource/{id}/{db}/_exe", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.POST)
    public GenericResponse ajax_datasource_db_sql_exe(@PathVariable("id") Integer id, @PathVariable("db") String db, @RequestBody SqlExeRequest request) {

        GenericResponse response = new GenericResponse();
        try {

            String sql = request.getSql();
            if (StringUtils.isNotEmpty(sql)) {
                List<RsSqlExeResult> exeResultList = this.getSqlExeResultList(id, db, sql);

                if (CollectionUtils.isNotEmpty(exeResultList)) {
                    RsSqlExeResult exeResult = exeResultList.get(0);
                    response.setStatus(exeResult.getStatus().equals(SqlExeResultStatusEnum.SUCCESS.getStatus()) ? ResponseConstants.SUCCESS_CODE : ResponseConstants.FAIL_CODE);
                    response.setData(exeResult.getSql_exe_record_id());
                } else {
                    response.setData(null);
                    response.setStatus(ResponseConstants.FAIL_CODE);
                }

            }


        } catch (Exception e) {
            log.error("ajax_datasource_db_sql_exe执行接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }


    @RequestMapping(value = "/datasource/{id}/{db}/{table}/_drop", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_datasource_drop_table(@PathVariable("id") Integer id, @PathVariable("db") String db, @PathVariable("table") String table) {

        GenericResponse response = new GenericResponse();
        try {

            String sql = "DROP TABLE " + table;

            RsSqlExeRecord rsSqlExeRecord = RsSqlExeRecord.builder()
                    .sql_text(sql)
                    .create_account(super.getUserInfoDTO().getAccount())
                    .create_name(super.getUserInfoDTO().getName())
                    .update_time(new Date())
                    .create_time(new Date())
                    .datasource_id(id)
                    .status(SqlExeRecordStatusEnum.RUNNING.getStatus())
                    .db(db)
                    .build();

            sqlExeRecordMapper.insertSelective(rsSqlExeRecord);

            sqlExeService.sqlExe(rsSqlExeRecord, sql);

            response.setData(rsSqlExeRecord.getId());
            response.setStatus(ResponseConstants.SUCCESS_CODE);


        } catch (Exception e) {
            log.error("ajax_datasource_drop_table执行接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }


    @RequestMapping(value = "/datasource/{id}/{db}/{table}/_truncate", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_datasource_truncate_table(@PathVariable("id") Integer id, @PathVariable("db") String db, @PathVariable("table") String table) {

        GenericResponse response = new GenericResponse();
        try {

            RsSqlExeRecord rsSqlExeRecord = RsSqlExeRecord.builder()
                    .sql_text("TRUNCATE TABLE " + table)
                    .create_account(super.getUserInfoDTO().getAccount())
                    .create_name(super.getUserInfoDTO().getName())
                    .update_time(new Date())
                    .create_time(new Date())
                    .datasource_id(id)
                    .status(SqlExeRecordStatusEnum.RUNNING.getStatus())
                    .db(db)
                    .build();

            sqlExeRecordMapper.insertSelective(rsSqlExeRecord);

            sqlExeService.sqlExe(rsSqlExeRecord, "TRUNCATE TABLE " + table);

            response.setData(rsSqlExeRecord.getId());
            response.setStatus(ResponseConstants.SUCCESS_CODE);


        } catch (Exception e) {
            log.error("ajax_datasource_truncate_table执行接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    @RequestMapping(value = "/datasource/{id}/{db}/{table}/_content", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_get_datasource_table_content(@PathVariable("id") Integer id, @PathVariable("db") String db, @PathVariable("table") String table, @RequestParam(required = false) Integer page, @RequestParam(required = false) String order_by_field) {

        GenericResponse response = new GenericResponse();
        try {

            CfDatasource datasource = datasourceMapper.selectByPrimaryKey(id);


            if (StringUtils.isEmpty(order_by_field)) {
                List<TableFieldEntity> fieldEntityList = DbUtils.getColumnNames(datasource.getId(),datasource.getIp(), datasource.getPort(), datasource.getUsername(), PPAesUtils.decodeAES(datasource.getPassword()), db, table, datasource.getType());
                AtomicBoolean contains_id = new AtomicBoolean(false);
                fieldEntityList.forEach(f -> {
                    if (f.getColumn_name().toUpperCase().equals("ID")) {
                        contains_id.set(true);
                    }
                });
                if (contains_id.get()) {
                    order_by_field = "ORDER BY ID";
                } else {
                    if (CollectionUtils.isNotEmpty(fieldEntityList)) {
                        order_by_field = "ORDER BY " + fieldEntityList.get(0).getColumn_name();
                    }
                }
            }

            //查询数据
            RsSqlExeRecord rsSqlExeRecord = RsSqlExeRecord.builder()
                    .sql_text(this.get_datasource_table_content_sql(datasource.getType(), table, page, order_by_field))
                    .create_account(super.getUserInfoDTO().getAccount())
                    .create_name(super.getUserInfoDTO().getName())
                    .update_time(new Date())
                    .create_time(new Date())
                    .datasource_id(id)
                    .status(SqlExeRecordStatusEnum.RUNNING.getStatus())
                    .db(db)
                    .build();

            sqlExeRecordMapper.insertSelective(rsSqlExeRecord);
            sqlExeService.sqlExe(rsSqlExeRecord, rsSqlExeRecord.getSql_text());

            List<RsSqlExeResult> sqlExeResultList = sqlExeResultMapper.selectList(RsSqlExeResult.builder().sql_exe_record_id(rsSqlExeRecord.getId()).build());
            String result = null;
            if (CollectionUtils.isNotEmpty(sqlExeResultList)) {
                result = sqlExeResultList.get(0).getResult();
            }

            //查询数量
            RsSqlExeRecord countRecord = RsSqlExeRecord.builder()
                    .sql_text("SELECT COUNT(*) AS TOTAL_NUM FROM " + table)
                    .create_account(super.getUserInfoDTO().getAccount())
                    .create_name(super.getUserInfoDTO().getName())
                    .update_time(new Date())
                    .create_time(new Date())
                    .datasource_id(id)
                    .status(SqlExeRecordStatusEnum.RUNNING.getStatus())
                    .db(db)
                    .build();

            sqlExeRecordMapper.insertSelective(countRecord);
            sqlExeService.sqlExe(countRecord, countRecord.getSql_text());

            List<RsSqlExeResult> countResultList = sqlExeResultMapper.selectList(RsSqlExeResult.builder().sql_exe_record_id(countRecord.getId()).build());
            Integer count = 0;
            if (CollectionUtils.isNotEmpty(countResultList)) {
                try {
                    JSONObject countJSON = JSON.parseObject(countResultList.get(0).getResult());
                    JSONArray countArr = countJSON.getJSONArray("data");
                    count = countArr.getJSONObject(0).getInteger("TOTAL_NUM");

                } catch (Exception e) {
                    count = 0;
                }
            }
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("count", count);
            resultMap.put("data", result);
            response.setData(resultMap);
            response.setStatus(ResponseConstants.SUCCESS_CODE);


        } catch (Exception e) {
            log.error("ajax_get_datasource_table_content执行接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    private String get_datasource_table_content_sql(Integer datasource_type, String table, Integer page, String order_by_field) {
        int default_size = 10;
        String default_order_by = "ORDER BY ID";
        if (page == null) {
            page = 0;
        }

        String SQL_MYSQL_TEMPLATE = "SELECT * FROM %s %s LIMIT %d,%d";//表，order by id desc，limit 1,2
        // String SQL_SERVER_TEMPLATE = "SELECT * FROM %s %s offset %d rows fetch next %d rows only";//表，order by id desc ,start_index ,size

        String SQL_SERVER_TEMPLATE = "SELECT * FROM (SELECT *, ROW_NUMBER() OVER(%s) AS dms_ROW_ID FROM %s) AS B WHERE dms_ROW_ID BETWEEN %d AND %d";//order by id desc,表,start_index,end_index


        String sql;
        switch (DatasourceTypeEnum.getByType(datasource_type)) {
            case MYSQL:
                sql = String.format(SQL_MYSQL_TEMPLATE, table, StringUtils.isNotEmpty(order_by_field) ? order_by_field : default_order_by, page * default_size, default_size);
                break;
            case SQL_SERVER:
                sql = String.format(SQL_SERVER_TEMPLATE, StringUtils.isNotEmpty(order_by_field) ? order_by_field : default_order_by, table, page * default_size, (page + 1) * default_size);
                break;
            default:
                sql = String.format(SQL_MYSQL_TEMPLATE, table, StringUtils.isNotEmpty(order_by_field) ? order_by_field : default_order_by, page * default_size, default_size);
                break;
        }

        return sql;
    }


    private List<RsSqlExeResult> getSqlExeResultList(Integer id, String db, String sql) {
        RsSqlExeRecord rsSqlExeRecord = RsSqlExeRecord.builder()
                .sql_text(sql)
                .create_account(super.getUserInfoDTO().getAccount())
                .create_name(super.getUserInfoDTO().getName())
                .update_time(new Date())
                .create_time(new Date())
                .datasource_id(id)
                .status(SqlExeRecordStatusEnum.RUNNING.getStatus())
                .db(db)
                .build();

        sqlExeRecordMapper.insertSelective(rsSqlExeRecord);

        sqlExeService.sqlExe(rsSqlExeRecord, sql);

        List<RsSqlExeResult> exeResultList = sqlExeResultMapper.selectList(RsSqlExeResult.builder()
                .sql_exe_record_id(rsSqlExeRecord.getId())
                .build());

        return exeResultList;
    }
}
