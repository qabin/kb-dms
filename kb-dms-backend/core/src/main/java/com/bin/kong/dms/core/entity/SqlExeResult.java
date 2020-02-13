package com.bin.kong.dms.core.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SqlExeResult<T> {
    private Date start_time;
    private Date end_time;
    private String sql;
    private boolean success;
    private T data;
    private String message;
    private Map<String, String> field_type;
}
