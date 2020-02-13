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
public class DatasourceJoinGroupJoinOwner {

    private Integer id;

    private Date create_time;

    private Date update_time;

    private String creator_name;

    private String creator_account;

    private String name;

    private String description;

    private Integer group_id;

    private Integer status;

    private String group_name;

    private Integer type;

    private String ip;

    private Integer port;

    private String username;

    private String db;

    private Integer query_switch;

}
