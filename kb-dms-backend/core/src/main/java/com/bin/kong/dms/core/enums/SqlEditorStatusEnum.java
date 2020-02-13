package com.bin.kong.dms.core.enums;

public enum SqlEditorStatusEnum {
    //状态：0 关闭窗口  1. 打开窗口
    CLOSED(0), OPEN(1);

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    private Integer status;

    SqlEditorStatusEnum(Integer status) {
        this.status = status;
    }

    public static SqlEditorStatusEnum getByStatus(Integer status) {
        for (SqlEditorStatusEnum statusEnum : values()) {
            if (statusEnum.getStatus() == status) {
                return statusEnum;
            }
        }
        return null;
    }
}
