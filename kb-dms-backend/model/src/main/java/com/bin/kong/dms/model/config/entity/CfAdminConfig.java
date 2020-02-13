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
public class CfAdminConfig {
    private Integer id;

    private String account;

    private String name;

    private Date create_time;

    private String creator_name;

    private String creator_account;
}
