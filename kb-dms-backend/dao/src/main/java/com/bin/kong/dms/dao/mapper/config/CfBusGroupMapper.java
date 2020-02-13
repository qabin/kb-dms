package com.bin.kong.dms.dao.mapper.config;

import com.bin.kong.dms.model.config.entity.CfBusGroup;
import com.bin.kong.dms.model.config.search.BusGroupSearch;

import java.util.List;

public interface CfBusGroupMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(CfBusGroup record);

    CfBusGroup selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(CfBusGroup record);

    List<CfBusGroup> selectList(CfBusGroup base);

    List<CfBusGroup> searchList(BusGroupSearch search);

    int selectCount(CfBusGroup base);


}
