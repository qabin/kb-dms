package com.bin.kong.dms.model.statistics.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StSqlExeResultCountDaySearch {
    @Builder.Default
    private String orderBy = "id desc";
    @Builder.Default
    private Integer pageSize = 10;
    @Builder.Default
    private Integer pageNum = 0;
    private Integer startNum;

    public Integer getStartNum() {
        if (pageNum > 0) {
            return pageSize * (pageNum);
        } else {
            return 0;
        }
    }

}
