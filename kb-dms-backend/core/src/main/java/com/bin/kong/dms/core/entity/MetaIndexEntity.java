package com.bin.kong.dms.core.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MetaIndexEntity {
    private String INDEX_NAME;
    private String COLUMN_NAME;
    private Boolean NON_UNIQUE;
    private Integer ORDINAL_POSITION;
}
