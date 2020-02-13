package com.bin.kong.dms.core.enums;

public enum GroupSearchTypeEnum {
    //1. ALL 2. CREATE_BY_ME
    ALL(1, "all"), CREATED_BY_ME(2,"created_by_me"),OWNER_BY_ME(3, "owner_by_me");

    public Integer getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    private Integer type;

    private String name;


    GroupSearchTypeEnum(Integer type, String name) {
        this.type = type;
        this.name = name;
    }

    public static GroupSearchTypeEnum getByType(Integer type) {
        for (GroupSearchTypeEnum statusEnum : values()) {
            if (statusEnum.getType() == type) {
                return statusEnum;
            }
        }
        return null;
    }
}
