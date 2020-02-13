package com.bin.kong.dms.contract.config.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DatasourceForSearchResponse {
    private Integer id;

    private String name;

    private String description;

    private Integer group_id;

    private String group_name;

    private Integer type;

    private String db;

    private Integer status;

    @Builder.Default
    private Boolean group_favorite = false;

    @Builder.Default
    private Boolean datasource_favorite = false;

    @Builder.Default
    private Boolean is_my_group=false;
}
