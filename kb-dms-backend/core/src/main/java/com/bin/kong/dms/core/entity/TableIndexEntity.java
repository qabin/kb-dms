package com.bin.kong.dms.core.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TableIndexEntity {

    private String index_name;
    private String index_type;
    private String storage_type;
    private List<String> index_columns;
    private String online_index_name;

}
