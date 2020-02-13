package com.bin.kong.dms.sever.controller.utils;

import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.core.entity.TableFieldEntity;
import com.bin.kong.dms.core.entity.TableIndexEntity;
import com.bin.kong.dms.core.entity.TableInfoEntity;
import com.bin.kong.dms.core.utils.DbUtils;
import com.bin.kong.dms.core.utils.PPAesUtils;
import com.bin.kong.dms.dao.mapper.config.CfDatasourceMapper;
import com.bin.kong.dms.model.config.entity.CfDatasource;
import com.bin.kong.dms.sever.controller.common.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@Slf4j
public class SqlEditorUtilsController extends BaseController {

    @Resource
    private CfDatasourceMapper datasourceMapper;

    @RequestMapping(value = "/sql/datasource/{id}/{db}/{table}/_create", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_get_table_create_sql(@PathVariable("id") Integer id, @PathVariable("db") String db, @PathVariable("table") String table) {

        GenericResponse response = new GenericResponse();
        try {
            CfDatasource datasource = datasourceMapper.selectByPrimaryKey(id);

            response.setData(getTableCreateSql(datasource.getId(), datasource.getIp(), datasource.getPort(), datasource.getUsername(), PPAesUtils.decodeAES(datasource.getPassword()), db, datasource.getType(), table));
            response.setStatus(ResponseConstants.SUCCESS_CODE);
        } catch (Exception e) {
            log.error("执行ajax_datasource_db_sql_exe接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    private String getTableCreateSql(Integer datasource_id, String ip, Integer port, String username, String password, String db, Integer type, String table) {


        List<TableFieldEntity> fieldList = DbUtils.getColumnNames(datasource_id, ip, port, username, password, db, table, type);

        String sql = "CREATE TABLE `" + table + "`(\n";

        //拼接字段
        for (TableFieldEntity tableFieldEntity : fieldList) {
            sql += ("    `" + tableFieldEntity.getColumn_name()
                    + "` " + tableFieldEntity.getType_name()
                    + (tableFieldEntity.getIs_unsigned() ? " UNSIGNED" : "")
                    + (tableFieldEntity.getIs_nullable() ? "" : " NOT NULL")
                    + (tableFieldEntity.getIs_autoincrement() ? " AUTO_INCREMENT" : "")
                    + (((StringUtils.isNotEmpty(tableFieldEntity.getColumn_def()) && tableFieldEntity.getColumn_def().length() > 0) || null != tableFieldEntity.getColumn_def() && tableFieldEntity.getColumn_def().equals("")) ?
                    tableFieldEntity.getType_name().toUpperCase().indexOf("DATETIME") != -1 && tableFieldEntity.getColumn_def().toUpperCase().indexOf("CURRENT_TIMESTAMP") != -1 ?
                            " DEFAULT " + tableFieldEntity.getColumn_def() : " DEFAULT '" + tableFieldEntity.getColumn_def() + "'" : "")
                    + (StringUtils.isNotEmpty(tableFieldEntity.getRemarks()) ? " COMMENT '" + tableFieldEntity.getRemarks() + "'" : ""))
                    + ",\n";

        }
        //拼接主键

        List<TableFieldEntity> primaryKeys = fieldList.stream().filter(f -> f.getIs_primary_key()).collect(Collectors.toList());

        if (!CollectionUtils.isEmpty(primaryKeys)) {
            sql += "    PRIMARY KEY (";

            for (int i = 0; i < primaryKeys.size(); i++) {
                if (primaryKeys.size() - 1 == i) {
                    sql += "`" + primaryKeys.get(i).getColumn_name() + "`";
                } else {
                    sql += "`" + primaryKeys.get(i).getColumn_name() + "`,";
                }
            }
            sql += "),\n";
        }

        //拼接索引
        List<TableIndexEntity> indexEntityList = DbUtils.getTableIndex(datasource_id, ip, port, username, password, db, table, type);

        if (!CollectionUtils.isEmpty(indexEntityList)) {
            List<TableIndexEntity> filter_index_rows = indexEntityList.stream().filter(idx -> StringUtils.isNotEmpty(idx.getIndex_name()) && !idx.getIndex_name().equals("PRIMARY")).collect(Collectors.toList());

            for (int i = 0; i < filter_index_rows.size(); i++) {
                if (filter_index_rows.get(i).getIndex_type().equals("UNIQUE")) {
                    sql += "    UNIQUE KEY `" + filter_index_rows.get(i).getIndex_name() + "` (" + get_index_columns(filter_index_rows.get(i).getIndex_columns()) + "),\n";
                } else {
                    sql += "    KEY `" + filter_index_rows.get(i).getIndex_name() + "` (" + get_index_columns(filter_index_rows.get(i).getIndex_columns()) + "),\n";
                }
            }
        }

        if (sql.endsWith(",\n")) {
            sql = sql.substring(0, sql.lastIndexOf(",\n"));
            sql += '\n';
        }
        //拼接表引擎及备注
        TableInfoEntity tableInfoEntity = DbUtils.getTableInfo(datasource_id, ip, port, username, password, db, type, table);
        if (null != tableInfoEntity && null != tableInfoEntity.getEngine()) {
            sql += (") ENGINE=" + tableInfoEntity.getEngine() + " DEFAULT CHARSET=" + tableInfoEntity.getCharacter_set() + " COMMENT='" + (StringUtils.isNotEmpty(tableInfoEntity.getCommit()) ? tableInfoEntity.getCommit() : "") + "'");
        }

        sql += ";";
        return sql;
    }

    private String get_index_columns(List<String> columns) {
        String sql = "";
        for (int i = 0; i < columns.size(); i++) {
            if (i == columns.size() - 1) {
                sql += "`" + columns.get(i) + "`";
            } else {
                sql += "`" + columns.get(i) + "`,";
            }
        }
        return sql;
    }

}
