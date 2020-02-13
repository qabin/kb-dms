package com.bin.kong.dms.dao.mapper.user;

import com.bin.kong.dms.model.user.entity.UsFavoriteDb;

import java.util.List;

public interface UsFavoriteDbMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(UsFavoriteDb record);

    UsFavoriteDb selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(UsFavoriteDb record);

    List<UsFavoriteDb> selectList(UsFavoriteDb record);

    int deleteByPrimaryKeySelective(UsFavoriteDb record);
}
