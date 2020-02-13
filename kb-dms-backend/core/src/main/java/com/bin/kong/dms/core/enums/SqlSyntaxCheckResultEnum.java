package com.bin.kong.dms.core.enums;

public enum SqlSyntaxCheckResultEnum {
    //状态：0.正常，1 NO_LIMIT  2. NO_WHERE
    SUCCESS(0, "没有检测到语法问题", false), NO_LIMIT(1, "SQL缺少返回行数限制！", false), NO_WHERE(2, "SQL缺少WHERE条件限制！", true),NO_PERMISSION(3, "越权操作！", true);

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getStop() {
        return stop;
    }

    public void setStop(Boolean stop) {
        this.stop = stop;
    }

    private Integer type;
    private String message;
    private Boolean stop;

    SqlSyntaxCheckResultEnum(Integer type, String message, Boolean stop) {
        this.type = type;
        this.message = message;
        this.stop = stop;
    }

    public static SqlSyntaxCheckResultEnum getByType(Integer type) {
        for (SqlSyntaxCheckResultEnum typeEnum : values()) {
            if (typeEnum.getType() == type) {
                return typeEnum;
            }
        }
        return null;
    }
}
