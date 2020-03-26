package com.bin.kong.dms.core.enums;

public enum SqlExeResultSearchTypeEnum {
    ALL(0, "all"), DQL_TYPE(1, "dql_type"), DML_TYPE(2, "dml_type"), DDL_TYPE(3, "ddl_type"),
    NO_PERMISSION(3, "no_permission"), SYNTAX_ERROR(5, "syntax_error"),EXE_FAILED(6, "exe_failed");

    public Integer getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    private Integer type;

    private String name;


    SqlExeResultSearchTypeEnum(Integer type, String name) {
        this.type = type;
        this.name = name;
    }

    public static SqlExeResultSearchTypeEnum getByType(Integer type) {
        for (SqlExeResultSearchTypeEnum statusEnum : values()) {
            if (statusEnum.getType() == type) {
                return statusEnum;
            }
        }
        return null;
    }

    public static SqlExeResultSearchTypeEnum getByName(String name) {
        for (SqlExeResultSearchTypeEnum statusEnum : values()) {
            if (statusEnum.getName().equals(name)) {
                return statusEnum;
            }
        }
        return null;
    }
}
