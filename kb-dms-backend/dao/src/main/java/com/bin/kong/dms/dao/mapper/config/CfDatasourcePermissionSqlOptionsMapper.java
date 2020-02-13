package com.bin.kong.dms.dao.mapper.config;

import com.bin.kong.dms.model.config.entity.CfDatasourcePermissionSqlOptions;

import java.util.List;

public interface CfDatasourcePermissionSqlOptionsMapper {
    int deleteByPrimaryKey(Integer id);

    int deleteByKeySelective(CfDatasourcePermissionSqlOptions record);

    int insertSelective(CfDatasourcePermissionSqlOptions record);

    CfDatasourcePermissionSqlOptions selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(CfDatasourcePermissionSqlOptions record);

    List<CfDatasourcePermissionSqlOptions> selectList(CfDatasourcePermissionSqlOptions base);

}
