package com.bin.kong.dms.dao.mapper.config;

import com.bin.kong.dms.model.config.entity.CfDatasourcePermissionMember;

import java.util.List;

public interface CfDatasourcePermissionMemberMapper {
    int deleteByPrimaryKey(Integer id);

    int deleteByKeySelective(CfDatasourcePermissionMember record);

    int insertSelective(CfDatasourcePermissionMember record);

    CfDatasourcePermissionMember selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(CfDatasourcePermissionMember record);

    List<CfDatasourcePermissionMember> selectList(CfDatasourcePermissionMember base);

}
