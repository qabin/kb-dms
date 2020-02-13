package com.bin.kong.dms.core.enums;

public enum SqlEditorActiveStatusEnum {
    //状态：-1 非当前窗口  1. 当前窗口
    NO_ACTIVE(-1), ACTIVE(1);

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    private Integer status;

    SqlEditorActiveStatusEnum(Integer status) {
        this.status = status;
    }

    public static SqlEditorActiveStatusEnum getByStatus(Integer status) {
        for (SqlEditorActiveStatusEnum statusEnum : values()) {
            if (statusEnum.getStatus() == status) {
                return statusEnum;
            }
        }
        return null;
    }
}
