package com.bin.kong.dms.model.join.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SqlEditorTabJoinDatasource {

    private Integer id;

    private String name;

    private String db;

    private Integer datasource_id;

    private String sql_text;

    private Date create_time;

    private Date update_time;

    private String creator_account;

    private String creator_name;

    private String datasource_name;

    private Integer datasource_type;

    private String table_name;

    private Integer type;
}
