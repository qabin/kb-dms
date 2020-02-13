package com.bin.kong.dms.sever.job;

import com.bin.kong.dms.core.enums.SqlSyntaxErrorCountTypeForStatisticsEnum;
import com.bin.kong.dms.dao.mapper.statistics.StSqlSyntaxErrorCountDayMapper;
import com.bin.kong.dms.dao.mapper.statistics.StSqlSyntaxErrorCountTimelineMapper;
import com.bin.kong.dms.model.statistics.entity.StSqlSyntaxErrorCountDay;
import com.bin.kong.dms.model.statistics.search.StSqlSyntaxErrorCountTimelineSearch;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Calendar;
import java.util.Date;

@Component
@Slf4j
public class SqlExeSyntaxErrorCountForDayJob {
    @Value("${job.sql-exe-result.sql-syntax-error-count:#{true}}")
    private boolean sqlSyntaxErrorCountSwitch;
    @Resource
    private StSqlSyntaxErrorCountTimelineMapper sqlSyntaxErrorCountTimelineMapper;
    @Resource
    private StSqlSyntaxErrorCountDayMapper stSqlSyntaxErrorCountDayMapper;

    @Async("threadExecutor")
    @Scheduled(cron = "0 01 0 * * ?")
    public void exec() {
        if (sqlSyntaxErrorCountSwitch) {
            log.info("开始统计SQL Syntax Error DAY执行结果信息！开始时间：" + System.currentTimeMillis());
            try {

                Calendar calendar = Calendar.getInstance();
                Date end_time;
                calendar.add(Calendar.DAY_OF_MONTH, -1);
                calendar.set(Calendar.HOUR_OF_DAY, 23);
                calendar.set(Calendar.MINUTE, 59);
                calendar.set(Calendar.SECOND, 59);
                end_time = calendar.getTime();
                Date start_time;
                calendar.set(Calendar.HOUR_OF_DAY, 0);
                calendar.set(Calendar.MINUTE, 0);
                calendar.set(Calendar.SECOND, 0);
                start_time = calendar.getTime();

                //统计NO_LIMIT
                int no_limit = sqlSyntaxErrorCountTimelineMapper.searchCountForStatistics(StSqlSyntaxErrorCountTimelineSearch.builder()
                        .type(SqlSyntaxErrorCountTypeForStatisticsEnum.NO_LIMIT.getType())
                        .start_time(start_time)
                        .end_time(end_time)
                        .build());
                stSqlSyntaxErrorCountDayMapper.insertSelective(StSqlSyntaxErrorCountDay.builder()
                        .count(no_limit)
                        .create_time(start_time)
                        .type(SqlSyntaxErrorCountTypeForStatisticsEnum.NO_LIMIT.getType())
                        .build());
                //统计NO_WHERE
                int no_where = sqlSyntaxErrorCountTimelineMapper.searchCountForStatistics(StSqlSyntaxErrorCountTimelineSearch.builder()
                        .type(SqlSyntaxErrorCountTypeForStatisticsEnum.NO_WHERE.getType())
                        .start_time(start_time)
                        .end_time(end_time)
                        .build());
                stSqlSyntaxErrorCountDayMapper.insertSelective(StSqlSyntaxErrorCountDay.builder()
                        .count(no_where)
                        .create_time(start_time)
                        .type(SqlSyntaxErrorCountTypeForStatisticsEnum.NO_WHERE.getType())
                        .build());
                //统计NO_PERMISSION
                int no_permission = sqlSyntaxErrorCountTimelineMapper.searchCountForStatistics(StSqlSyntaxErrorCountTimelineSearch.builder()
                        .type(SqlSyntaxErrorCountTypeForStatisticsEnum.NO_PERMISSION.getType())
                        .start_time(start_time)
                        .end_time(end_time)
                        .build());
                stSqlSyntaxErrorCountDayMapper.insertSelective(StSqlSyntaxErrorCountDay.builder()
                        .count(no_permission)
                        .create_time(start_time)
                        .type(SqlSyntaxErrorCountTypeForStatisticsEnum.NO_PERMISSION.getType())
                        .build());

                //统计全部
                stSqlSyntaxErrorCountDayMapper.insertSelective(StSqlSyntaxErrorCountDay.builder()
                        .count(no_limit + no_where + no_permission)
                        .create_time(start_time)
                        .type(SqlSyntaxErrorCountTypeForStatisticsEnum.ALL.getType())
                        .build());

            } catch (Exception e) {
                log.error("开始统计SQL Syntax Error DAY执行结果信息异常:" + e.getMessage());
            }
            log.info("开始统计SQL Syntax Error DAY执行结果信息完成！结束时间：" + System.currentTimeMillis());
        }
    }
}
