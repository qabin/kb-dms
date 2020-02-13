package com.bin.kong.dms.contract.user.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserInfoRequest {
    private String name;
    private Integer port;
    private String new_pwd;
    private String old_pwd;
}
