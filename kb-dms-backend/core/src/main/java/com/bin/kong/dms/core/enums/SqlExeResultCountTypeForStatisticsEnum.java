package com.bin.kong.dms.core.enums;

public enum SqlExeResultCountTypeForStatisticsEnum {
    //状态：
    ALL(1), SUCCESS(2), FAIL(3), RUNNING(4);

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    private Integer type;

    SqlExeResultCountTypeForStatisticsEnum(Integer type) {
        this.type = type;
    }

    public static SqlExeResultCountTypeForStatisticsEnum getByType(Integer type) {
        for (SqlExeResultCountTypeForStatisticsEnum typeEnum : values()) {
            if (typeEnum.getType() == type) {
                return typeEnum;
            }
        }
        return null;
    }
}
