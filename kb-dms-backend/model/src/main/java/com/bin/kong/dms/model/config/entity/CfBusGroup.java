package com.bin.kong.dms.model.config.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CfBusGroup {
    private Integer id;

    private String name;

    private Date create_time;

    private Integer status;

    private String creator_account;

    private String creator_name;

}
