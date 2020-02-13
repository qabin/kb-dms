package com.bin.kong.dms.contract.common;

import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

@Getter
@Setter
public class BaseResponse {
    private int status;
    private String message;

    public void addMessage(String msg) {
        if (StringUtils.hasText(msg)) {
            if (StringUtils.hasText(this.message)) {
                this.message += ";" + msg;
            } else {
                this.message = msg;
            }
        }
    }

}
