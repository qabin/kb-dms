package com.bin.kong.dms.core.dynamicdatasource;

import com.bin.kong.dms.core.enums.DatasourceTypeEnum;
import com.bin.kong.dms.core.enums.SqlOptionTypeEnum;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class DynamicSqlOptionTypeControl {

    /**
     * SQL分割 +分类
     *
     * @param sql
     * @return
     */
    public static List<DynamicSqlOptionTypeEntity> dealSqlOptionType(String sql, DatasourceTypeEnum datasourceTypeEnum) {
        List<DynamicSqlOptionTypeEntity> sqlOptionTypeEntityList = new ArrayList<>();

        if (StringUtils.isNotEmpty(sql)) {
            List<String> sqlList = Arrays.asList(sql.split(";"));

            sqlList = sqlList.stream().filter(d -> {
                if (StringUtils.isNotEmpty(d)&&StringUtils.isNotEmpty(d.trim())) {
                    if (!d.trim().equals("\r") && !d.trim().equals("\r\n") && !d.trim().equals("\n")) {
                        return true;
                    }
                }
                return false;
            }).collect(Collectors.toList());

            if (!CollectionUtils.isEmpty(sqlList)) {
                sqlList.forEach(s -> {
                    if (StringUtils.isNotEmpty(s)) {
                        s = s.trim();
                        DynamicSqlOptionTypeEntity sqlOptionTypeEntity = DynamicSqlOptionTypeEntity.builder().build();
                        sqlOptionTypeEntity.setDatasource_type_enum(datasourceTypeEnum);
                        sqlOptionTypeEntity.setOrigin_sql(s);
                        sqlOptionTypeEntity.setSql(s);
                        if (s.indexOf(" ") != -1) {
                            String sql_start = s.substring(0, s.indexOf(" "));

                            if (Arrays.asList(SqlOptionTypeEnum.DQL.getCommand()).contains(sql_start.toUpperCase())) {
                                sqlOptionTypeEntity.setOption_type_enum(SqlOptionTypeEnum.DQL);
                            } else if (Arrays.asList(SqlOptionTypeEnum.DML.getCommand()).contains(sql_start.toUpperCase())) {
                                sqlOptionTypeEntity.setOption_type_enum(SqlOptionTypeEnum.DML);

                            } else if (Arrays.asList(SqlOptionTypeEnum.DDL.getCommand()).contains(sql_start.toUpperCase())) {
                                sqlOptionTypeEntity.setOption_type_enum(SqlOptionTypeEnum.DDL);
                            } else {
                                sqlOptionTypeEntity.setOption_type_enum(SqlOptionTypeEnum.DQL);
                            }

                            sqlOptionTypeEntityList.add(sqlOptionTypeEntity);
                        } else {
                            sqlOptionTypeEntity.setOption_type_enum(SqlOptionTypeEnum.DQL);
                            sqlOptionTypeEntityList.add(sqlOptionTypeEntity);

                        }
                    }
                });
                return sqlOptionTypeEntityList;
            }
        }
        return sqlOptionTypeEntityList;
    }
}
