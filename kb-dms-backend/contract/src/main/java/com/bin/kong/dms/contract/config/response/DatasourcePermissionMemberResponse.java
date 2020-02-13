package com.bin.kong.dms.contract.config.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DatasourcePermissionMemberResponse<T> {

    private String account;

    private String name;

    private Integer datasource_id;

    private List<T> auth_list;
}
