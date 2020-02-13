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
public class TableColumnAndIndexEntity {
    private List<TableFieldEntity> columns;
    private List<TableIndexEntity> index;
    private TableInfoEntity info;

}
