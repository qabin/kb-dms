package com.bin.kong.dms.dao.mapper.statistics;

import com.bin.kong.dms.model.statistics.entity.StSqlSyntaxErrorCountTimeline;
import com.bin.kong.dms.model.statistics.search.StSqlSyntaxErrorCountTimelineSearch;

public interface StSqlSyntaxErrorCountTimelineMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(StSqlSyntaxErrorCountTimeline record);

    StSqlSyntaxErrorCountTimeline selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(StSqlSyntaxErrorCountTimeline record);

    Integer searchCountForStatistics(StSqlSyntaxErrorCountTimelineSearch base);


}
