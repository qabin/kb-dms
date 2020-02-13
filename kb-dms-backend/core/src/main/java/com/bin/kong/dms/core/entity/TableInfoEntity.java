package com.bin.kong.dms.core.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TableInfoEntity {
    private String database_name;
    private String table_name;
    private String engine;
    private String character_set;
    private String commit;
    private String folder;
}
