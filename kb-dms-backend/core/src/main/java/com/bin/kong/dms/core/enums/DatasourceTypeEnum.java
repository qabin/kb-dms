package com.bin.kong.dms.core.enums;

public enum DatasourceTypeEnum {
    //1. mysql 2. sqlserver
    MYSQL(1, "mysql","com.mysql.cj.jdbc.Driver"), SQL_SERVER(2,"sqlserver","com.microsoft.sqlserver.jdbc.SQLServerDriver");

    public Integer getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    public String getDriver() {
        return driver;
    }

    private Integer type;

    private String name;

    private String driver;


    DatasourceTypeEnum(Integer type, String name, String driver) {
        this.type = type;
        this.name = name;
        this.driver = driver;
    }

    public static DatasourceTypeEnum getByType(Integer type) {
        for (DatasourceTypeEnum statusEnum : values()) {
            if (statusEnum.getType() == type) {
                return statusEnum;
            }
        }
        return null;
    }
}
