package com.bin.kong.dms.model.join.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DatasourceJoinGroupSearch {
    private String kw;
    private Integer status;
    private String creator;
}
