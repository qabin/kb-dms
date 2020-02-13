package com.bin.kong.dms.core.dynamicdatasource;

import com.alibaba.druid.pool.DruidDataSource;
import com.bin.kong.dms.core.enums.DatasourceTypeEnum;
import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.util.Properties;

public class DynamicDataSourceUtils {

    /**
     * 添加数据源
     * 为了防止多线程添加同一个数据源，这里采用同步,同时会判断是否已存在
     *
     * @param datasource_id
     * @param type
     * @param ip
     * @param port
     * @param db            实例名
     * @param username
     * @param password
     * @return String 新建数据源对应的key，如果已经存在，则返回之前的key。
     */
    public static synchronized String addDataSource(Integer datasource_id, Integer type, String ip,
                                                    int port, String db, String username, String password) {

        String dataSourceName = getDataSourceName(datasource_id, type, db);

        if (DynamicDataSourceContextHolder.getDataSource(dataSourceName) == null) {
            DataSource ds = createDataSource(ip, port, db, username, password, type);
            //存储数据源
            if (null != ds) {
                DynamicDataSourceContextHolder.putDataSource(dataSourceName, ds);
                //存储jdbcTemplate
                DynamicDataSourceContextHolder.putJdbcTemplate(dataSourceName, new JdbcTemplate(ds));
            }

        }

        return dataSourceName;
    }


    public static String getDataSourceName(Integer datasource_id, Integer type, String db) {
        return (DatasourceTypeEnum.getByType(type).getName() + "_" + datasource_id + "_" + db).toUpperCase();
    }

    /**
     * 创建一个数据源
     *
     * @param ip
     * @param port
     * @param db
     * @param username
     * @param password
     * @return
     */
    private static DataSource createDataSource(String ip, int port, String db, String username, String password, Integer type) {
        if (StringUtils.isEmpty(db)) {
            return null;
        }

        Properties properties = new Properties();
        properties.setProperty("remarks", "true");
        properties.setProperty("useInformationSchema", "true");
        DruidDataSource dds = new DruidDataSource();
        dds.setDriverClassName(DatasourceTypeEnum.getByType(type).getDriver());
        dds.setUrl(getConnectionUrlWithDb(ip, port, db, type));
        dds.setUsername(username);
        dds.setPassword(password);
        dds.setConnectProperties(properties);
        dds.setMaxActive(5);
        dds.setMinIdle(1);
        dds.setInitialSize(1);
        dds.setMaxWait(60 * 1000);
        return dds;
    }

    private static String getConnectionUrlWithDb(String ip, Integer port, String db, Integer type) {
        switch (DatasourceTypeEnum.getByType(type)) {
            case MYSQL:
                return "jdbc:" + DatasourceTypeEnum.MYSQL.getName() + "://" + ip + ":" + port + "/" + db + "?useSSL=false&useUnicode=true&characterEncoding=utf8&tinyInt1isBit=false";
            case SQL_SERVER:
                return "jdbc:" + DatasourceTypeEnum.SQL_SERVER.getName() + "://" + ip + ":" + port + ";DatabaseName=" + db;

        }
        return null;
    }
}
