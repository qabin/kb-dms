package com.bin.kong.dms.dao.mapper.statistics;

import com.bin.kong.dms.model.statistics.entity.StSqlExeResultCountDay;
import com.bin.kong.dms.model.statistics.search.StSqlExeResultCountDaySearch;

import java.util.List;

public interface StSqlExeResultCountDayMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(StSqlExeResultCountDay record);

    StSqlExeResultCountDay selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(StSqlExeResultCountDay record);

    List<StSqlExeResultCountDay> searchList(StSqlExeResultCountDaySearch search);

}
