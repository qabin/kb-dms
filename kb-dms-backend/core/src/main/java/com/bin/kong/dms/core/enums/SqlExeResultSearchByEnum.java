package com.bin.kong.dms.core.enums;

public enum SqlExeResultSearchByEnum {
    //1. ALL 2. CREATE_BY_ME
    ALL(1, "all"), EXECUTED_BY_ME(2, "executed_by_me"), OWNER_BY_ME(3, "owner_by_me");

    public Integer getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    private Integer type;

    private String name;


    SqlExeResultSearchByEnum(Integer type, String name) {
        this.type = type;
        this.name = name;
    }

    public static SqlExeResultSearchByEnum getByType(Integer type) {
        for (SqlExeResultSearchByEnum statusEnum : values()) {
            if (statusEnum.getType() == type) {
                return statusEnum;
            }
        }
        return null;
    }

    public static SqlExeResultSearchByEnum getByName(String name) {
        for (SqlExeResultSearchByEnum statusEnum : values()) {
            if (statusEnum.getName().equals(name)) {
                return statusEnum;
            }
        }
        return null;
    }
}
