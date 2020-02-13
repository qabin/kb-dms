package com.bin.kong.dms.core.dynamicdatasource;

import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DynamicDataSourceContextHolder {


    private static Map<String, DataSource> dataSourceMap = new HashMap<>();

    private static Map<String, JdbcTemplate> jdbcTemplateMap = new HashMap<>();

    public static List<String> dataSourceNames = new ArrayList<>();

    private static final ThreadLocal<String> CONTEXT_HOLDER = new ThreadLocal<>();


    public static void setDataSource(String dataSourceName) {
        if (dataSourceMap.containsKey(dataSourceName)) {
            CONTEXT_HOLDER.set(dataSourceName);
        } else {
            throw new NullPointerException("不存在的dataSourceName:" + dataSourceName);
        }
    }

    public static String getDataSource() {
        return CONTEXT_HOLDER.get();
    }

    public static void clearDataSource() {
        CONTEXT_HOLDER.remove();
    }


    public static void putDataSource(String sourceName, DataSource dataSource) {
        dataSourceMap.put(sourceName, dataSource);
    }

    public static DataSource getDataSource(String sourceName) {
        return dataSourceMap.get(sourceName);
    }

    public static boolean containsDataSource(String dataSourceName) {
        return dataSourceNames.contains(dataSourceName);
    }

    public static void putJdbcTemplate(String dataSourceName, JdbcTemplate jdbcTemplate) {
        if (!jdbcTemplateMap.containsKey(dataSourceName)) {
            jdbcTemplateMap.put(dataSourceName, jdbcTemplate);
        }
    }

    public static JdbcTemplate getJdbcTemplate(String dataSourceName) {
        if (jdbcTemplateMap.containsKey(dataSourceName)) {
            return jdbcTemplateMap.get(dataSourceName);
        }
        return null;
    }
}
