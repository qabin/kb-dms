package com.bin.kong.dms.contract.common;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class GenericResponse<T> extends BaseResponse implements ResponseState {
    private T data;

    @Override
    public boolean isSuccess() {
        return getStatus() == 1;
    }
}
