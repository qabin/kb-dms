package com.bin.kong.dms.dao.mapper.statistics;

import com.bin.kong.dms.model.statistics.entity.StSqlSyntaxErrorCountDay;
import com.bin.kong.dms.model.statistics.search.StSqlSyntaxErrorCountDaySearch;

import java.util.List;

public interface StSqlSyntaxErrorCountDayMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(StSqlSyntaxErrorCountDay record);

    StSqlSyntaxErrorCountDay selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(StSqlSyntaxErrorCountDay record);

    List<StSqlSyntaxErrorCountDay> searchList(StSqlSyntaxErrorCountDaySearch search);

}
