package com.bin.kong.dms.core.exception;

public class UserNotExistException extends RuntimeException {
    public UserNotExistException() {
        super("user not found");
    }
}
