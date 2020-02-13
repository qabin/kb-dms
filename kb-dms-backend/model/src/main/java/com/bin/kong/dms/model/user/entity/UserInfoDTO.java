package com.bin.kong.dms.model.user.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoDTO {
    private String name;
    private String account;
    @Builder.Default
    private Boolean is_admin = false;
}
