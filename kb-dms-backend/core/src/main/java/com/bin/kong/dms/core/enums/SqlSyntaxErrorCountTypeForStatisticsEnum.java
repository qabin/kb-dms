package com.bin.kong.dms.core.enums;

public enum SqlSyntaxErrorCountTypeForStatisticsEnum {
    //状态：
   ALL(1), NO_LIMIT(2), NO_WHERE(3), NO_PERMISSION(4);

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    private Integer type;

    SqlSyntaxErrorCountTypeForStatisticsEnum(Integer type) {
        this.type = type;
    }

    public static SqlSyntaxErrorCountTypeForStatisticsEnum getByType(Integer type) {
        for (SqlSyntaxErrorCountTypeForStatisticsEnum typeEnum : values()) {
            if (typeEnum.getType() == type) {
                return typeEnum;
            }
        }
        return null;
    }
}
