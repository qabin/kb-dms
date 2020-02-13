package com.bin.kong.dms.core.enums;

public enum SqlExeRecordStatusEnum {
    //状态：1 执行中  2. 执行完成
    RUNNING(1), COMPLETE(2);

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    private Integer status;

    SqlExeRecordStatusEnum(Integer status) {
        this.status = status;
    }

    public static SqlExeRecordStatusEnum getByStatus(Integer status) {
        for (SqlExeRecordStatusEnum statusEnum : values()) {
            if (statusEnum.getStatus() == status) {
                return statusEnum;
            }
        }
        return null;
    }
}
