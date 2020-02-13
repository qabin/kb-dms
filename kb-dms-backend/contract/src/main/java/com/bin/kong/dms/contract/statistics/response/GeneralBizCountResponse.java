package com.bin.kong.dms.contract.statistics.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GeneralBizCountResponse {

    private Integer bus_count;

    private Integer datasource_count;

    private Integer sql_exe_result_total;

    private Integer sql_syntax_no_permission_total;

    private Integer sql_syntax_other_error_total;

}
