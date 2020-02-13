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
public class RsSqlExeResult {
    private Integer id;

    private Integer sql_exe_record_id;

    private String sql_text;

    private String result;

    private Date create_time;

    private Date update_time;

    private Integer status;

    private Integer syntax_error_type;

    private String syntax_error_sql;

    private String creator_name;

    private String creator_account;

    private Integer sql_option_type;

    private String datasource_name;

    private Integer datasource_type;

    private String db;

    private Integer datasource_id;

    private Integer group_id;

    private String group_name;

    private String table_name_list;
}
