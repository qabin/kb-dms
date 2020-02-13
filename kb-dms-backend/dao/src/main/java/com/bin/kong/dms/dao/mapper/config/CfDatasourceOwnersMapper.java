package com.bin.kong.dms.dao.mapper.config;

import com.bin.kong.dms.model.config.entity.CfDatasourceOwners;

import java.util.List;

public interface CfDatasourceOwnersMapper {
    int deleteByPrimaryKey(Integer id);

    int deleteByDatasourceId(Integer datasource_id);

    int insertSelective(CfDatasourceOwners record);

    CfDatasourceOwners selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(CfDatasourceOwners record);

    List<CfDatasourceOwners> selectList(CfDatasourceOwners base);


}
