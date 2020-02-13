package com.bin.kong.dms.core.enums;

public enum SqlExeResultStatusEnum {
    //状态：1 执行中  2. 执行成功 -1. 执行失败
    RUNNING(1), SUCCESS(2), FAIL(-1);

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    private Integer status;

    SqlExeResultStatusEnum(Integer status) {
        this.status = status;
    }

    public static SqlExeResultStatusEnum getByStatus(Integer status) {
        for (SqlExeResultStatusEnum statusEnum : values()) {
            if (statusEnum.getStatus() == status) {
                return statusEnum;
            }
        }
        return null;
    }
}
