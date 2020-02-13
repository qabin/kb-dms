package com.bin.kong.dms.dao.mapper.config;

import com.bin.kong.dms.model.config.entity.CfDatasource;
import com.bin.kong.dms.model.config.search.DatasourceSearch;

import java.util.List;

public interface CfDatasourceMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(CfDatasource record);

    CfDatasource selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(CfDatasource record);

    List<CfDatasource> searchList(DatasourceSearch search);

    List<CfDatasource> selectList(CfDatasource record);

    int selectCount(CfDatasource record);

}
