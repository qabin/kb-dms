package com.bin.kong.dms.core.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TableFieldEntity {

    private String column_name;
    private Integer ordinal_position;
    private String type_name;
    private String extra;
    @Builder.Default
    private Boolean is_nullable = false;
    @Builder.Default
    private Boolean is_autoincrement = false;
    @Builder.Default
    private Boolean is_primary_key = false;
    @Builder.Default
    private Boolean is_unsigned = false;
    private String column_def;
    private String remarks;
    @Builder.Default
    private Boolean is_online = true;

    private String online_column_name;

    private String online_after;

}
