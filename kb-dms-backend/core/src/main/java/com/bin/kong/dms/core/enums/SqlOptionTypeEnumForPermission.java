package com.bin.kong.dms.core.enums;

public enum SqlOptionTypeEnumForPermission {
    //状态：1 执行中  2. 执行完成
    DQL(1, "DQL", "查询权限", new String[]{"SELECT"}), DML(2, "DML", "修改数据权限", new String[]{"INSERT", "UPDATE", "DELETE"}), DDL(3, "DDL", "操作表结构权限", new String[]{"CREATE", "ALTER", "DROP", "TRUNCATE", "EXEC", "IF", "DECLARE", "BEGIN"});

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }


    public String[] getCommand() {
        return command;
    }

    public void setCommand(String[] command) {
        this.command = command;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    private Integer type;

    private String[] command;

    private String name;

    private String desc;

    SqlOptionTypeEnumForPermission(Integer type, String name, String desc, String[] command) {
        this.type = type;
        this.command = command;
        this.name = name;
        this.desc = desc;
    }

    public static SqlOptionTypeEnumForPermission getByType(Integer type) {
        for (SqlOptionTypeEnumForPermission typeEnum : values()) {
            if (typeEnum.getType() == type) {
                return typeEnum;
            }
        }
        return null;
    }
}
