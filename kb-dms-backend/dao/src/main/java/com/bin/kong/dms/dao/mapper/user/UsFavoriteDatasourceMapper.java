package com.bin.kong.dms.dao.mapper.user;

import com.bin.kong.dms.model.user.entity.UsFavoriteDatasource;

import java.util.List;

public interface UsFavoriteDatasourceMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(UsFavoriteDatasource record);

    UsFavoriteDatasource selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(UsFavoriteDatasource record);

    List<UsFavoriteDatasource> selectList(UsFavoriteDatasource record);

    int deleteByPrimaryKeySelective(UsFavoriteDatasource record);
}
