package com.bin.kong.dms.sever.service.impl;

import com.bin.kong.dms.dao.mapper.statistics.StSqlExeBizTotalMapper;
import com.bin.kong.dms.model.statistics.entity.StSqlExeBizTotal;
import com.bin.kong.dms.sever.service.IStSqlExeBizTotalService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class StSqlExeBizTotalServiceImpl implements IStSqlExeBizTotalService {
    private final static Integer TABLE_ID = 1;

    @Resource
    private StSqlExeBizTotalMapper sqlExeBizTotalMapper;

    @Override
    public void update(StSqlExeBizTotal bizTotal) {
        StSqlExeBizTotal stSqlExeBizTotal = sqlExeBizTotalMapper.selectByPrimaryKey(TABLE_ID);

        if (null == stSqlExeBizTotal || stSqlExeBizTotal.getId() == null) {
            sqlExeBizTotalMapper.insertSelective(bizTotal);
        } else {
            bizTotal.setId(TABLE_ID);
            sqlExeBizTotalMapper.updateAddStatisticsCount(bizTotal);
        }
    }
}
