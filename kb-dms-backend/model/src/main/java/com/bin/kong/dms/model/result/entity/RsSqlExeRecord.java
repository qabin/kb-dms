package com.bin.kong.dms.model.result.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RsSqlExeRecord {
    private Integer id;

    private String sql_text;

    private Integer datasource_id;

    private String db;

    private Integer status;

    private String create_account;

    private String create_name;

    private Date create_time;

    private Date update_time;
}
