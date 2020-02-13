package com.bin.kong.dms.core.dynamicdatasource;

import com.bin.kong.dms.core.enums.SqlSyntaxCheckResultEnum;
import org.apache.commons.lang3.StringUtils;

public class DynamicSqlSyntaxCheck {

    public final static Integer LIMIT_ROW_NUM = 100;
    private final static String MAX_ROWS_LIMIT_FOR_MYSQL = " limit 100";
    private final static String MAX_ROWS_TOP_FOR_SQLSERVER = "TOP 100 ";

    /**
     * 检查语法 +发现语法问题 修复
     *
     * @return
     */

    public static void check(DynamicSqlOptionTypeEntity entity) {
        switch (entity.getDatasource_type_enum()) {
            case MYSQL:
                check_for_mysql(entity);
                break;
            case SQL_SERVER:
                check_for_sqlserver(entity);
                break;

        }

    }


    private static void check_for_mysql(DynamicSqlOptionTypeEntity entity) {
        if (StringUtils.isNotEmpty(entity.getSql())) {
            switch (entity.getOption_type_enum()) {
                case DQL:
                    if (entity.getSql().toUpperCase().indexOf(" LIMIT ") == -1) {
                        entity.setSql(entity.getSql() + MAX_ROWS_LIMIT_FOR_MYSQL);
                        entity.setSyntax_check_result_enum(SqlSyntaxCheckResultEnum.NO_LIMIT);
                    }
                    break;
                case DML:
                    if (!entity.getSql().trim().toUpperCase().startsWith("INSERT") && entity.getSql().toUpperCase().indexOf(" WHERE ") == -1) {
                        entity.setSyntax_check_result_enum(SqlSyntaxCheckResultEnum.NO_WHERE);
                    }
                    break;
            }
        }
    }


    private static void check_for_sqlserver(DynamicSqlOptionTypeEntity entity) {
        if (StringUtils.isNotEmpty(entity.getSql())) {
            switch (entity.getOption_type_enum()) {
                case DQL:
                    if (entity.getSql().toUpperCase().indexOf(" TOP ") == -1) {
                        if (entity.getSql().toUpperCase().indexOf("SELECT ") != -1) {
                            entity.setSql(entity.getSql().substring(0, 7) + MAX_ROWS_TOP_FOR_SQLSERVER + entity.getSql().substring(7));
                            entity.setSyntax_check_result_enum(SqlSyntaxCheckResultEnum.NO_LIMIT);
                        }
                    }
                    break;
                case DML:
                    if (!entity.getSql().trim().toUpperCase().startsWith("INSERT") && entity.getSql().toUpperCase().indexOf(" WHERE ") == -1) {
                        entity.setSyntax_check_result_enum(SqlSyntaxCheckResultEnum.NO_WHERE);
                    }
                    break;
            }
        }
    }
}
