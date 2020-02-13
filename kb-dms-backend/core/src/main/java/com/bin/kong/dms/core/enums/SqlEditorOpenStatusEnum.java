package com.bin.kong.dms.core.enums;

public enum SqlEditorOpenStatusEnum {
    //状态：-1 关闭  1. 打开
    CLOSED(-1), OPEN(1);

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    private Integer status;

    SqlEditorOpenStatusEnum(Integer status) {
        this.status = status;
    }

    public static SqlEditorOpenStatusEnum getByStatus(Integer status) {
        for (SqlEditorOpenStatusEnum statusEnum : values()) {
            if (statusEnum.getStatus() == status) {
                return statusEnum;
            }
        }
        return null;
    }
}
