package com.bin.kong.dms.dao.mapper.result;

import com.bin.kong.dms.model.result.entity.RsSqlExeResult;
import com.bin.kong.dms.model.result.search.SqlExeResultForStatisticsSearch;
import com.bin.kong.dms.model.result.search.SqlExeResultSearch;

import java.util.List;

public interface RsSqlExeResultMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(RsSqlExeResult record);

    RsSqlExeResult selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(RsSqlExeResult record);


    List<RsSqlExeResult> selectList(RsSqlExeResult base);


    int searchCountForStatistics(SqlExeResultForStatisticsSearch base);


    List<RsSqlExeResult> searchList(SqlExeResultSearch search);

    Integer searchCount(SqlExeResultSearch search);

}
