package com.bin.kong.dms.model.join.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DdlOptionsJoinTaskSearch {
    private String kw;
    private Integer status;
    private String query_type;
    private String creator_account;
    private String member_account;

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
