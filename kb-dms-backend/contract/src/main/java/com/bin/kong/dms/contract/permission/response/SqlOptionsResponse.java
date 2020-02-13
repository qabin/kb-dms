package com.bin.kong.dms.contract.permission.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SqlOptionsResponse {
    private String name;

    private String desc;

    private Integer type;

}
