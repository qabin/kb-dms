package com.bin.kong.dms.contract.config.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TableResponse {

    private String name;

    @Builder.Default
    private Boolean favorite = false;
}
