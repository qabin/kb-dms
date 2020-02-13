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
public class BusGroupJoinOwner {

    private Integer id;

    private String name;

    private Date create_time;

    private Integer status;

    private String creator_account;

    private String creator_name;

    private String owner_account;

    private String owner_name;

}
