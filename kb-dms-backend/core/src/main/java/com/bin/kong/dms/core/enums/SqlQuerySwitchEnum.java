package com.bin.kong.dms.core.enums;

public enum SqlQuerySwitchEnum {
    //状态：-1 关闭  1. 打开
    CLOSED(-1), OPEN(1);

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    private Integer status;

    SqlQuerySwitchEnum(Integer status) {
        this.status = status;
    }

    public static SqlQuerySwitchEnum getByStatus(Integer status) {
        for (SqlQuerySwitchEnum statusEnum : values()) {
            if (statusEnum.getStatus() == status) {
                return statusEnum;
            }
        }
        return null;
    }
}
