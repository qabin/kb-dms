package com.bin.kong.dms.model.user.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsFavoriteTable {
    private Integer id;

    private Integer datasource_id;

    private String db;

    private String table_name;

    private String account;

    private Date create_time;

}
