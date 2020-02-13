package com.bin.kong.dms.model.user.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {
    private Integer id;

    private String account;

    private String login_pwd;

    private String name;

    private Date create_time;

    private Date update_time;

    private String ip;
}
