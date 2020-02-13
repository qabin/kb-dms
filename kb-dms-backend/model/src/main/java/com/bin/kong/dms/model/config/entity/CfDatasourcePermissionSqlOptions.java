package com.bin.kong.dms.model.config.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CfDatasourcePermissionSqlOptions {
    private Integer id;

    private Integer datasource_id;

    private Integer option_type;

    private String account;

}
