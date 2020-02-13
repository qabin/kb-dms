package com.bin.kong.dms.model.statistics.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StSqlExeResultCountDay {
    private Integer id;

    private Integer type;

    private Integer count;

    private Date create_time;

}
