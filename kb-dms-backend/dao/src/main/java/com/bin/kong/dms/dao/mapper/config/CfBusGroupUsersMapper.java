package com.bin.kong.dms.dao.mapper.config;


import com.bin.kong.dms.model.config.entity.CfBusGroupUsers;
import com.bin.kong.dms.model.config.search.BusGroupUsersSearch;

import java.util.List;
import java.util.Map;

public interface CfBusGroupUsersMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(CfBusGroupUsers record);

    CfBusGroupUsers selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(CfBusGroupUsers record);

    List<CfBusGroupUsers> selectList(CfBusGroupUsers base);

    List<CfBusGroupUsers> searchList(BusGroupUsersSearch search);

    Integer deleteByAccount(Map<String, Object> params);
}
