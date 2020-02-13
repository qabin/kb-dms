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
public class DdlOptionJoinTask {

    private Integer id;

    private Integer task_id;

    private Integer type;

    private Integer status;

    private String cluster_id;

    private String rds_datasource_url;

    private String rds_datasource_port;

    private String rds_db;

    private String rds_table;

    private Integer is_delete;

    private String creator_name;

    private String creator_account;

    private Date create_time;

    private Date update_time;

    private String new_table;

    private String ddl;

    private String ddl_rows;

    private String online_rows;

    private String table_remarks;

    private String new_table_remarks;

    private String table_charset;

    private String new_table_charset;

    private String task_name;

}
