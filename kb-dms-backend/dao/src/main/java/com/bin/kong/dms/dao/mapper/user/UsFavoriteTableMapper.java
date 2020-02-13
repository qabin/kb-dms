package com.bin.kong.dms.dao.mapper.user;

import com.bin.kong.dms.model.user.entity.UsFavoriteTable;

import java.util.List;

public interface UsFavoriteTableMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(UsFavoriteTable record);

    UsFavoriteTable selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(UsFavoriteTable record);


    List<UsFavoriteTable> selectList(UsFavoriteTable record);

    int deleteByPrimaryKeySelective(UsFavoriteTable record);

}
