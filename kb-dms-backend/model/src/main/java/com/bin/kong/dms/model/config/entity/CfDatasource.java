package com.bin.kong.dms.model.config.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CfDatasource {
    private Integer id;

    private Integer group_id;

    private String name;

    private String description;

    private Integer type;

    private Integer status;

    private String ip;

    private Integer port;

    private String db;

    private String username;

    private String password;

    private String creator_name;

    private String creator_account;

    private Date create_time;

    private Date update_time;

    private Integer query_switch;
}
