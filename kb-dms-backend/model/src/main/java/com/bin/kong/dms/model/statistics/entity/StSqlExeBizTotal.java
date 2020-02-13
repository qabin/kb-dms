package com.bin.kong.dms.model.statistics.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StSqlExeBizTotal {
    private Integer id;

    private Integer sql_exe_result_total;

    private Integer sql_exe_result_success_total;

    private Integer sql_exe_result_running_total;

    private Integer sql_exe_result_fail_total;

    private Integer sql_syntax_no_permission_total;

    private Integer sql_syntax_no_limit_total;

    private Integer sql_syntax_no_where_total;

    private Integer sql_syntax_error_total;

}
