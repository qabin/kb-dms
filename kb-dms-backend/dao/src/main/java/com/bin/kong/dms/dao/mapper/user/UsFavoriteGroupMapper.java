package com.bin.kong.dms.dao.mapper.user;

import com.bin.kong.dms.model.user.entity.UsFavoriteGroup;

import java.util.List;

public interface UsFavoriteGroupMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(UsFavoriteGroup record);

    UsFavoriteGroup selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(UsFavoriteGroup record);

    int updateByPrimaryKey(UsFavoriteGroup record);

    List<UsFavoriteGroup> selectList(UsFavoriteGroup record);

    int deleteByPrimaryKeySelective(UsFavoriteGroup record);
}
