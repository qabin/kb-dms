package com.bin.kong.dms.dao.mapper.statistics;

import com.bin.kong.dms.model.statistics.entity.StSqlExeBizTotal;

public interface StSqlExeBizTotalMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(StSqlExeBizTotal record);

    StSqlExeBizTotal selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(StSqlExeBizTotal record);

    int updateAddStatisticsCount(StSqlExeBizTotal record);
}
