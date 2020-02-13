package com.bin.kong.dms.sever.service;

import com.bin.kong.dms.core.dynamicdatasource.DynamicSqlOptionTypeEntity;
import com.bin.kong.dms.core.entity.Result;

public interface ISqlOptionsTypePermissionService {
    Result check(DynamicSqlOptionTypeEntity sqlOptionTypeEntity, String account, Integer datasource_id);
}
