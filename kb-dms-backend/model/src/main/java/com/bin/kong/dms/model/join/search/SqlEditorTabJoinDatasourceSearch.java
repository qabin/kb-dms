package com.bin.kong.dms.model.join.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SqlEditorTabJoinDatasourceSearch {
    private String kw;

    private String creator_account;

    private Integer status;
}
