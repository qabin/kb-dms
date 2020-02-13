package com.bin.kong.dms.core.dynamicdatasource;

import com.bin.kong.dms.core.enums.DatasourceTypeEnum;
import com.bin.kong.dms.core.enums.SqlOptionTypeEnum;
import com.bin.kong.dms.core.enums.SqlSyntaxCheckResultEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DynamicSqlOptionTypeEntity {
    private String origin_sql;

    private String sql;

    private SqlOptionTypeEnum option_type_enum;

    private DatasourceTypeEnum datasource_type_enum;

    private SqlSyntaxCheckResultEnum syntax_check_result_enum;
}
