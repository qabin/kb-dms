package com.bin.kong.dms.core.dynamicdatasource;

import com.bin.kong.dms.core.entity.SqlExeResult;
import com.bin.kong.dms.core.enums.DatasourceTypeEnum;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.util.CollectionUtils;

import java.util.*;

public class DynamicDataExeUtils {

    /**
     * 执行DQL queryForList
     *
     * @param datasource
     * @param sql
     * @return
     */
    private static SqlExeResult<List<Map<String, Object>>> queryForList(String datasource, String sql) {

        SqlExeResult<List<Map<String, Object>>> result = SqlExeResult.<List<Map<String, Object>>>builder().sql(sql).start_time(new Date()).build();
        JdbcTemplate jdbcTemplate = DynamicDataSourceContextHolder.getJdbcTemplate(datasource);
        try {
            List<Map<String, Object>> resultList = jdbcTemplate.queryForList(sql);
            result.setData(resultList);
            if (!CollectionUtils.isEmpty(resultList)) {
                Map<String, String> field_type_map = new HashMap<>();
                Integer count=0;
                for (Map<String, Object> stringObjectMap : resultList) {
                    count++;
                    if(count>=10){
                        break;
                    }
                    Set<String> keys = stringObjectMap.keySet();
                    keys.forEach(k -> {
                                if (stringObjectMap.get(k) != null)
                                    field_type_map.put(k, stringObjectMap.get(k).getClass().toString());
                            }
                    );
                }
                result.setField_type(field_type_map);
            }

            result.setSuccess(true);

        } catch (Exception e) {
            result.setSuccess(false);
            result.setMessage(e.getMessage());
        }
        result.setEnd_time(new Date());
        return result;
    }

    /**
     * 执行DML update
     *
     * @param datasource
     * @param sql
     * @return
     */
    private static SqlExeResult<List<Map<String, Object>>> update(String datasource, String sql) {

        SqlExeResult<List<Map<String, Object>>> result = SqlExeResult.<List<Map<String, Object>>>builder().sql(sql).start_time(new Date()).build();
        JdbcTemplate jdbcTemplate = DynamicDataSourceContextHolder.getJdbcTemplate(datasource);
        try {

            Integer count = jdbcTemplate.update(sql);
            List<Map<String, Object>> resultList = new ArrayList<>();
            HashMap<String, Object> resultMap = new HashMap<>();
            resultMap.put("影响行数", count);
            resultList.add(resultMap);
            result.setData(resultList);
            result.setSuccess(true);

        } catch (Exception e) {
            result.setSuccess(false);
            result.setMessage(e.getMessage());
        }
        result.setEnd_time(new Date());

        return result;
    }

    /**
     * 执行DDL execute
     *
     * @param datasource
     * @param sql
     * @return
     */
    private static SqlExeResult execute(String datasource, String sql) {

        SqlExeResult result = SqlExeResult.builder().sql(sql).start_time(new Date()).build();
        JdbcTemplate jdbcTemplate = DynamicDataSourceContextHolder.getJdbcTemplate(datasource);
        try {
            jdbcTemplate.execute(sql);
            result.setSuccess(true);

        } catch (Exception e) {
            result.setSuccess(false);
            result.setMessage(e.getMessage());
        }
        result.setEnd_time(new Date());

        return result;
    }

    /**
     * sql执行入口
     *
     * @param sql
     * @param datasource_id
     * @param type
     * @param ip
     * @param port
     * @param db
     * @param username
     * @param password
     * @return
     */
    public static List<SqlExeResult> exeSql(String sql, Integer datasource_id, Integer type, String ip, Integer port, String db, String username, String password) {

        String dataSource = DynamicDataSourceUtils.addDataSource(datasource_id, type, ip, port, db, username, password);

        List<DynamicSqlOptionTypeEntity> sqlList = DynamicSqlOptionTypeWithDruidControl.dealSqlOptionType(sql, DatasourceTypeEnum.getByType(type));

        List<SqlExeResult> resultList = new ArrayList<>();

        for (DynamicSqlOptionTypeEntity sqlOptionTypeEntity : sqlList) {
            switch (sqlOptionTypeEntity.getOption_type_enum()) {
                case DQL:
                    resultList.add(queryForList(dataSource, sqlOptionTypeEntity.getSql()));
                    break;
                case DML:
                    resultList.add(update(dataSource, sqlOptionTypeEntity.getSql()));
                    break;
                case DDL:
                    resultList.add(execute(dataSource, sqlOptionTypeEntity.getSql()));
                    break;
                case EXEC:
                    resultList.add(queryForList(dataSource, sqlOptionTypeEntity.getSql()));
                    break;

            }
        }
        return resultList;
    }

}
