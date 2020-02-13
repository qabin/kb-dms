package com.bin.kong.dms.model.config.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CfBusGroupOwners {
    private Integer id;

    private String name;

    private String account;

    private Integer bus_group_id;
}
