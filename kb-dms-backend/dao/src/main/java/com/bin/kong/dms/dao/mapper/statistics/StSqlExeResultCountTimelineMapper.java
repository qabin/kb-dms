package com.bin.kong.dms.dao.mapper.statistics;

import com.bin.kong.dms.model.statistics.entity.StSqlExeResultCountTimeline;
import com.bin.kong.dms.model.statistics.search.StSqlExeResultCountTimelineSearch;

public interface StSqlExeResultCountTimelineMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(StSqlExeResultCountTimeline record);

    StSqlExeResultCountTimeline selectByPrimaryKey(Integer id);

    Integer updateByPrimaryKeySelective(StSqlExeResultCountTimeline record);

    Integer searchCountForStatistics(StSqlExeResultCountTimelineSearch base);

}
