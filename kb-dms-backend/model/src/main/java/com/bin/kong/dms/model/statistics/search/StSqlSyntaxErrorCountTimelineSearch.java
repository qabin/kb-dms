package com.bin.kong.dms.model.statistics.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StSqlSyntaxErrorCountTimelineSearch {

   private Integer type;

   private Date start_time;

   private Date end_time;
}
