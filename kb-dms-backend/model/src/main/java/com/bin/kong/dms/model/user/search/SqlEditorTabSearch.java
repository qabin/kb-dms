package com.bin.kong.dms.model.user.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SqlEditorTabSearch {
    private String kw;

    private String creator_account;
}
