package com.bin.kong.dms.sever.service;

import com.bin.kong.dms.model.result.entity.RsSqlExeRecord;

public interface ISqlExeService {
    void sqlExeAsync(RsSqlExeRecord rsSqlExeRecord, String sql);

    void sqlExe(RsSqlExeRecord rsSqlExeRecord, String sql);
}
