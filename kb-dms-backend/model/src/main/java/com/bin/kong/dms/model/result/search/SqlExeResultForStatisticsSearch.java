package com.bin.kong.dms.model.result.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SqlExeResultForStatisticsSearch {

   private Integer status;

   private Date start_time;

   private Date end_time;

   private Integer syntax_error_type;
}
