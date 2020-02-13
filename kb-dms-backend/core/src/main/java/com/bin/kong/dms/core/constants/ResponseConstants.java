package com.bin.kong.dms.core.constants;

public class ResponseConstants {
    public final static Integer SUCCESS_CODE = 1;
    public final static Integer FAIL_CODE = 0;

    //未登录
    public final static Integer STATUS_UNLOGIN = 1001;
    //Token异常
    public final static Integer STATUS_TOKEN_ERROR = 1002;
    //无权限
    public final static Integer STATUS_NO_AUTH = 1003;
    //用户名密码错误
    public final static Integer STATUS_WRONG_PWD = 1004;

    public final static Integer STATUS_OTHER = 1005;
}
