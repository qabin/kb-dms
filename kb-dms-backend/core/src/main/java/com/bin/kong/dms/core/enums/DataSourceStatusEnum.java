package com.bin.kong.dms.core.enums;

public enum DataSourceStatusEnum {
    //状态：-1 未生效  1. 生效
    NO_ACTIVE(-1), ACTIVE(1);

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    private Integer status;

    DataSourceStatusEnum(Integer status) {
        this.status = status;
    }

    public static DataSourceStatusEnum getByStatus(Integer status) {
        for (DataSourceStatusEnum statusEnum : values()) {
            if (statusEnum.getStatus() == status) {
                return statusEnum;
            }
        }
        return null;
    }
}
