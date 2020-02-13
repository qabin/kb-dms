package com.bin.kong.dms.dao.mapper.config;


import com.bin.kong.dms.model.config.entity.CfAdminConfig;
import com.bin.kong.dms.model.config.search.AdminSearch;

import java.util.List;

public interface CfAdminConfigMapper {
    int deleteByPrimaryKey(Integer id);

    int deleteByAccount(String account);

    int insertSelective(CfAdminConfig record);

    CfAdminConfig selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(CfAdminConfig record);

    List<CfAdminConfig> selectList(CfAdminConfig base);

    List<CfAdminConfig> searchList(AdminSearch search);

}
