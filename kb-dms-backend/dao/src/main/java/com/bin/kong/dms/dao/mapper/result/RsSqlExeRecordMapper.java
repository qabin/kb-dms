package com.bin.kong.dms.dao.mapper.result;

import com.bin.kong.dms.model.result.entity.RsSqlExeRecord;

public interface RsSqlExeRecordMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(RsSqlExeRecord record);

    RsSqlExeRecord selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(RsSqlExeRecord record);

}
