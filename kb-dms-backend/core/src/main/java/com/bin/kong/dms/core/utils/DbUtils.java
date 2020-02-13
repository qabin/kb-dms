package com.bin.kong.dms.core.utils;

import com.bin.kong.dms.core.dynamicdatasource.DynamicDataSourceContextHolder;
import com.bin.kong.dms.core.dynamicdatasource.DynamicDataSourceUtils;
import com.bin.kong.dms.core.entity.*;
import com.bin.kong.dms.core.enums.DatasourceTypeEnum;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;
import org.springframework.util.CollectionUtils;

import java.sql.*;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
public class DbUtils {
    private final static String MYSQL_CONNECT_URL = "jdbc:mysql://%s:%s?useSSL=false&serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf8";

    private final static String MYSQL_CONNECT_URL_WITH_DB = "jdbc:mysql://%s:%s/%s?useSSL=false&serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf8";

    private final static String SQL_SERVER_CONNECT_URL = "jdbc:sqlserver://%s:%s";

    private final static String SQL_SERVER_CONNECT_URL_WITH_DB = "jdbc:sqlserver://%s:%s;DatabaseName=%s";

    private final static String[] EXCLUDE_DB_LIST_FOR_MYSQL = new String[]{
            "information_schema", "performance_schema", "mysql", "sys"
    };
    private final static String[] MYSQL_DATE_TYPE_LIST = new String[]{
            "datetime",
            "date",
            "timestamp",
            "time",
            "year"
    };


    private final static String[] MYSQL_TEXT_TYPE_LIST = new String[]{
            "longtext",
            "mediumtext",
            "text",
            "tinytext",
    };


    private final static String[] SQL_NO_LENGTH_TYPE_LIST = new String[]{
            "text",
            "ntext",
            "bit",
            "tinyint",
            "smallint",
            "int",
            "int identity",
            "bigint",
            "smallmoney",
            "money",
            "real",
            "datetime",
            "datetime2",
            "smalldatetime",
            "date",
            "time",
            "datetimeoffset",
            "timestamp",

    };

    /**
     * Mysql数据库连接
     *
     * @param ip
     * @param port
     * @param username
     * @param password
     * @return
     */
    public static Result connectForMysql(String ip, Integer port, String username, String password) {
        return getConnection(ip, port, username, password, DatasourceTypeEnum.MYSQL.getType(), null);
    }


    /**
     * 测试数据源连接
     *
     * @param ip
     * @param port
     * @param username
     * @param password
     * @param type
     * @return
     */
    public static Result testConnect(String ip, Integer port, String username, String password, Integer type) {
        Result<Connection> result = getConnection(ip, port, username, password, type, null);

        if (null != result) {
            Connection conn = result.getData();
            if (null != conn) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    log.error("关闭数据源连接异常！" + e);
                }
            }
        }
        return result;
    }

    public static Result connectForSqlServer(String ip, Integer port, String username, String password) {
        return getConnection(ip, port, username, password, DatasourceTypeEnum.SQL_SERVER.getType(), null);
    }

    /**
     * 拼接mysql数据库连接地址
     *
     * @param ip
     * @param port
     * @return
     */
    public static String getMysqlConnectUrl(String ip, Integer port, String db) {
        if (StringUtils.isNotEmpty(db)) {
            return String.format(MYSQL_CONNECT_URL_WITH_DB, ip, port, db);

        } else {
            return String.format(MYSQL_CONNECT_URL, ip, port);
        }
    }

    public static String getMysqlConnectUrl(String ip, Integer port) {
        return getMysqlConnectUrl(ip, port, null);
    }

    public static String getSqlServerConnectUrl(String ip, Integer port, String db) {
        if (StringUtils.isNotEmpty(db)) {
            return String.format(SQL_SERVER_CONNECT_URL_WITH_DB, ip, port, db);

        } else {
            return String.format(SQL_SERVER_CONNECT_URL, ip, port);
        }
    }


    public static List<String> getTableNames(String ip, Integer port, String username, String password, String db, Integer type) {
        List<String> tableNames = new ArrayList<>();
        Connection conn = getConnection(ip, port, username, password, type, db).getData();
        ResultSet rs = null;
        try {
            //获取数据库的元数据
            DatabaseMetaData metaData = conn.getMetaData();
            //从元数据中获取到所有的表名
            rs = metaData.getTables(db, null, null,
                    new String[]{"TABLE"});

            while (rs.next()) {
                tableNames.add(rs.getString(3));
            }
        } catch (SQLException e) {
            log.error("获取数据源异常！", e);
        } finally {
            try {
                rs.close();
                conn.close();
            } catch (SQLException e) {
                log.error("断开数据源连接异常！", e);
            }
        }
        return tableNames;
    }


    public static TableInfoEntity getTableInfo(Integer datasource_id, String ip, Integer port, String username, String password, String db, Integer type, String tableName) {
        TableInfoEntity infoEntity = TableInfoEntity.builder().build();
        try {
            String dataSource = DynamicDataSourceUtils.addDataSource(datasource_id, type, ip, port, db, username, password);
            JdbcTemplate jdbcTemplate = DynamicDataSourceContextHolder.getJdbcTemplate(dataSource);

            String sql = "select * from information_schema.tables where table_schema='" + db + "'  and table_name='" + tableName + "' limit 1";

            List<Map<String, Object>> resultList = jdbcTemplate.queryForList(sql);
            if (resultList.size() > 0) {
                Map<String, Object> resultMap = resultList.get(0);
                infoEntity.setEngine((String) resultMap.get("ENGINE"));
                infoEntity.setCommit((String) resultMap.get("TABLE_COMMENT"));
                String charset = (String) resultMap.get("TABLE_COLLATION");
                if (StringUtils.isNotEmpty(charset)) {
                    List<String> charsetList = Arrays.asList(charset.split("_"));
                    infoEntity.setCharacter_set(charsetList.get(0));
                }
            }

        } catch (Exception e) {
            log.error("获取数据源异常！", e);
        }
        return infoEntity;
    }

    /**
     * 获取字段名称
     *
     * @param db
     * @param tableName
     * @return
     */
    public static List<TableFieldEntity> getColumnNames(Integer datasource_id, String ip, Integer port, String username, String password, String db, String tableName, Integer type) {
        List<TableFieldEntity> tableFiledEntityList = new ArrayList<>();
        if (StringUtils.isEmpty(tableName)) {
            return tableFiledEntityList;
        }

        Connection conn = getConnection(ip, port, username, password, type, db).getData();
        ResultSet rs = null;
        try {
            //获取数据库的元数据
            //DatabaseMetaData metaData = conn.getMetaData();
            List<String> primaryKeyList = new ArrayList<>();
            ResultSet primaryKeys = conn.getMetaData().getPrimaryKeys(db, null, tableName);

            while (primaryKeys.next()) {
                String primaryKeyColumnName = primaryKeys.getString("COLUMN_NAME");
                primaryKeyList.add(primaryKeyColumnName);
            }
            ResultSet columns = conn.getMetaData().getColumns(db, "%", tableName, "%");

            int index = 0;
            while (columns.next()) {
                index++;
                String column_name = columns.getString("COLUMN_NAME");
                Boolean is_unsigned = false;
                Integer column_size = columns.getInt("COLUMN_SIZE");

                String type_name = columns.getString("TYPE_NAME");

                if (StringUtils.isNotEmpty(type_name)) {
                    if (type_name.toUpperCase().indexOf(" UNSIGNED") != -1) {
                        is_unsigned = true;
                        type_name = type_name.replaceAll(" UNSIGNED", "");
                    }
                }
                if (column_size > 0 && !check_is_no_length(type, type_name)) {
                    type_name += ("(" + column_size + ")");
                }

                tableFiledEntityList.add(TableFieldEntity.builder()
                        .column_name(column_name)
                        .is_primary_key(primaryKeyList.contains(columns.getString("COLUMN_NAME")) ? true : false)
                        .is_unsigned(is_unsigned)
                        .is_autoincrement(columns.getString("IS_AUTOINCREMENT").equals("YES") ? true : false)
                        .is_nullable(columns.getString("IS_NULLABLE").equals("YES") ? true : false)
                        .remarks(columns.getString("REMARKS"))
                        .type_name(type_name)
                        .column_def(columns.getString("COLUMN_DEF"))
                        .is_online(true)
                        .online_column_name(column_name)
                        .ordinal_position(index)
                        .build());
            }

            String dataSource = DynamicDataSourceUtils.addDataSource(datasource_id, type, ip, port, db, username, password);
            JdbcTemplate jdbcTemplate = DynamicDataSourceContextHolder.getJdbcTemplate(dataSource);

            String sql = "SELECT * FROM " + tableName;
            switch (DatasourceTypeEnum.getByType(type)) {
                case SQL_SERVER:
                    sql = "SELECT TOP 0 * FROM " + tableName;
                    break;
                case MYSQL:
                    sql = "SELECT * FROM " + tableName + " LIMIT 0";
                    break;
            }

            SqlRowSet rowSet = jdbcTemplate.queryForRowSet(sql);
            SqlRowSetMetaData metaData = rowSet.getMetaData();
            int columnCount = metaData.getColumnCount();
            for (int i = 1; i <= columnCount; i++) {
                for (int j = 0; j < tableFiledEntityList.size(); j++) {

                    String column_name = metaData.getColumnName(i);
                    String type_name = metaData.getColumnTypeName(i);
                    if (type_name.toUpperCase().indexOf(" UNSIGNED") != -1) {
                        type_name = type_name.replaceAll(" UNSIGNED", "");
                    }
                    if (tableFiledEntityList.get(j).getColumn_name().equals(column_name)) {
                        TableFieldEntity newTableFieldEntity = tableFiledEntityList.get(j);
                        newTableFieldEntity.setColumn_name(metaData.getColumnName(i));
                        if (metaData.getColumnDisplaySize(i) > 0 && !check_is_no_length(type, type_name)) {
                            type_name += ("(" + metaData.getColumnDisplaySize(i) + ")");
                            newTableFieldEntity.setType_name(type_name);
                        }
                        tableFiledEntityList.set(j, newTableFieldEntity);
                    }
                }

            }


        } catch (SQLException e) {
            log.error("获取数据源异常！", e);
        } finally {
            try {
                if (null != rs)
                    rs.close();
                if (null != conn)
                    conn.close();
            } catch (SQLException e) {
                log.error("断开数据源连接异常！", e);
            }
        }
        return tableFiledEntityList;
    }


    /**
     * 获取索引信息
     *
     * @param db
     * @param tableName
     * @return
     */
    public static List<TableIndexEntity> getTableIndex(Integer datasource_id, String ip, Integer port, String username, String password, String db, String tableName, Integer type) {

        Connection conn = getConnection(ip, port, username, password, type).getData();
        List<MetaIndexEntity> metaIndexEntityList = new ArrayList<>();
        List<TableIndexEntity> indexEntityList = new ArrayList<>();
        ResultSet rs = null;
        try {
            //获取数据库的元数据
            DatabaseMetaData metaData = conn.getMetaData();
            //从元数据中获取到表索引信息
            rs = metaData.getIndexInfo(db, db, tableName, false, false);
            ResultSetMetaData md = rs.getMetaData();
            while (rs.next()) {
                MetaIndexEntity metaIndexEntity = MetaIndexEntity.builder().build();
                for (int i = 1; i <= md.getColumnCount(); i++) {

                    String name = md.getColumnName(i);
                    if (name.equals("INDEX_NAME")) {
                        metaIndexEntity.setINDEX_NAME((String) rs.getObject(i));
                    }

                    if (name.equals("NON_UNIQUE")) {
                        metaIndexEntity.setNON_UNIQUE((Boolean) rs.getObject(i));
                    }

                    if (name.equals("COLUMN_NAME")) {
                        metaIndexEntity.setCOLUMN_NAME((String) rs.getObject(i));
                    }

                    if (name.equals("ORDINAL_POSITION")) {
                        metaIndexEntity.setORDINAL_POSITION((Integer) rs.getObject(i));
                    }

//                    System.out.println(md.getColumnName(i) + "==" + rs.getObject(i));
                }

                metaIndexEntityList.add(metaIndexEntity);
            }

            indexEntityList = deal_meta_index_to_table_index(metaIndexEntityList);

        } catch (SQLException e) {
            log.error("获取数据源异常！", e);
        } finally {
            try {
                rs.close();
                conn.close();
            } catch (SQLException e) {
                log.error("断开数据源连接异常！", e);
            }
        }
        return indexEntityList;

    }


    public static List<String> getDbNames(String ip, Integer port, String username, String password, Integer type) {
        List<String> dbNameList = new ArrayList<>();
        Connection conn = getConnection(ip, port, username, password, type).getData();
        ResultSet rs = null;
        try {
            //获取数据库的元数据
            DatabaseMetaData metaData = conn.getMetaData();
            //从元数据中获取到所有的表名
            rs = metaData.getCatalogs();
            while (rs.next()) {
                if (!Arrays.asList(EXCLUDE_DB_LIST_FOR_MYSQL).contains(rs.getString(1)))
                    dbNameList.add(rs.getString(1));
            }
        } catch (SQLException e) {
            log.error("获取数据源异常！", e);
        } finally {
            try {
                rs.close();
                conn.close();
            } catch (SQLException e) {
                log.error("断开数据源连接异常！", e);
            }
        }
        return dbNameList;
    }


    /**
     * 获取数据源连接
     *
     * @param ip
     * @param port
     * @param username
     * @param password
     * @param type
     * @return
     */
    public static Result<Connection> getConnection(String ip, Integer port, String username, String password, Integer type, String db) {
        Result result = new Result();

        Properties connectionProps = new Properties();
        connectionProps.put("remarks", "true");
        connectionProps.setProperty("remarksReporting", "true");
        connectionProps.put("user", username);
        connectionProps.put("password", password);
        try {
            switch (DatasourceTypeEnum.getByType(type)) {
                case SQL_SERVER:
                    Class.forName(DatasourceTypeEnum.SQL_SERVER.getDriver());
                    result.setData(DriverManager.getConnection(getSqlServerConnectUrl(ip, port, db), connectionProps));
                    result.setSuccess(true);
                    break;
                case MYSQL:
                    Class.forName(DatasourceTypeEnum.MYSQL.getDriver());
                    result.setData(DriverManager.getConnection(getMysqlConnectUrl(ip, port, db), connectionProps));
                    result.setSuccess(true);
                    break;
            }

        } catch (SQLException e) {
            result.setSuccess(false);
            result.setMessage("获取数据源连接异常!" + e);
            log.error("获取数据源连接异常！" + e);
        } catch (ClassNotFoundException e) {
            result.setSuccess(false);
            result.setMessage("获取Driver异常!" + e);
            log.error("获取Driver异常！" + e);
        }
        return result;
    }

    public static Result<Connection> getConnection(String ip, Integer port, String username, String password, Integer type) {
        return getConnection(ip, port, username, password, type, null);
    }

    private static boolean check_is_no_length(Integer type, String type_name) {

        if (type.equals(DatasourceTypeEnum.MYSQL.getType())) {
            if (Arrays.asList(MYSQL_DATE_TYPE_LIST).contains(type_name.toUpperCase()) || Arrays.asList(MYSQL_DATE_TYPE_LIST).contains(type_name.toLowerCase())) {
                return true;
            }

            if (Arrays.asList(MYSQL_TEXT_TYPE_LIST).contains(type_name.toUpperCase()) || Arrays.asList(MYSQL_TEXT_TYPE_LIST).contains(type_name.toLowerCase())) {
                return true;
            }
        }

        if (type.equals(DatasourceTypeEnum.SQL_SERVER.getType())) {
            if (Arrays.asList(SQL_NO_LENGTH_TYPE_LIST).contains(type_name.toUpperCase()) || Arrays.asList(SQL_NO_LENGTH_TYPE_LIST).contains(type_name.toLowerCase())) {
                return true;
            }
        }

        return false;
    }


    private static List<TableIndexEntity> deal_meta_index_to_table_index(List<MetaIndexEntity> metaIndexEntityList) {
        List<TableIndexEntity> indexEntityList = new ArrayList<>();
        Map<String, List<MetaIndexEntity>> resultMap = new HashMap<>();
        for (MetaIndexEntity metaIndexEntity : metaIndexEntityList) {
            if (!resultMap.containsKey(metaIndexEntity.getINDEX_NAME())) {
                List<MetaIndexEntity> metaIndexEntities = new ArrayList<>();
                metaIndexEntities.add(metaIndexEntity);
                resultMap.put(metaIndexEntity.getINDEX_NAME(), metaIndexEntities);
            } else {
                List<MetaIndexEntity> metaIndexEntities = resultMap.get(metaIndexEntity.getINDEX_NAME());
                metaIndexEntities.add(metaIndexEntity);
                resultMap.put(metaIndexEntity.getINDEX_NAME(), metaIndexEntities);
            }
        }

        for (String s : resultMap.keySet()) {
            List<MetaIndexEntity> metaIndexEntities = resultMap.get(s);
            if (!CollectionUtils.isEmpty(metaIndexEntities)) {
                metaIndexEntities = metaIndexEntities.stream().sorted(Comparator.comparing(d -> d.getORDINAL_POSITION(), Comparator.naturalOrder())).collect(Collectors.toList());
                List<String> ids = metaIndexEntities.stream().map(MetaIndexEntity::getCOLUMN_NAME).collect(Collectors.toList());
                indexEntityList.add(TableIndexEntity.builder()
                        .index_columns(ids)
                        .index_name(s)
                        .online_index_name(s)
                        .index_type(s.equals("PRIMARY") ? "PRIMARY" : (metaIndexEntities.get(0).getNON_UNIQUE() ? "INDEX" : "UNIQUE"))
                        .build());

            }

        }

        return indexEntityList;
    }
}
