package com.bin.kong.dms.dao.mapper.config;

import com.bin.kong.dms.model.config.entity.CfBusGroupOwners;

import java.util.List;

public interface CfBusGroupOwnersMapper {
    int deleteByPrimaryKey(Integer id);

    int deleteByBusGroupId(Integer bus_group_id);

    int insertSelective(CfBusGroupOwners record);

    CfBusGroupOwners selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(CfBusGroupOwners record);

    List<CfBusGroupOwners> selectList(CfBusGroupOwners base);
}
