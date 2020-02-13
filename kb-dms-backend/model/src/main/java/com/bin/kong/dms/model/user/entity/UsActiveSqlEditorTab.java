package com.bin.kong.dms.model.user.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsActiveSqlEditorTab {
    private Integer id;

    private String account;

    private Date create_time;

    private Date update_time;

    private Integer sql_tab_id;

}
