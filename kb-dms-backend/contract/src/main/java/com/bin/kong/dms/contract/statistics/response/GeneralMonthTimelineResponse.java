package com.bin.kong.dms.contract.statistics.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GeneralMonthTimelineResponse {
    private String date;

    private Integer sql_exe_result_total;

    private Integer sql_exe_result_success_total;

    private Integer sql_exe_result_running_total;

    private Integer sql_exe_result_fail_total;

    private Integer sql_syntax_no_permission_total;

    private Integer sql_syntax_no_limit_total;

    private Integer sql_syntax_no_where_total;

    private Integer sql_syntax_error_total;

}
