package com.bin.kong.dms.model.config.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BusGroupUsersSearch {
    private String kw;
    private Integer bus_group_id;
    private String account;
}
