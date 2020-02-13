package com.bin.kong.dms.sever.job;

import com.bin.kong.dms.core.enums.SqlExeResultCountTypeForStatisticsEnum;
import com.bin.kong.dms.dao.mapper.statistics.StSqlExeResultCountDayMapper;
import com.bin.kong.dms.dao.mapper.statistics.StSqlExeResultCountTimelineMapper;
import com.bin.kong.dms.model.statistics.entity.StSqlExeResultCountDay;
import com.bin.kong.dms.model.statistics.search.StSqlExeResultCountTimelineSearch;
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
public class SqlExeResultCountForDayJob {
    @Value("${job.sql-exe-result.sql-result-count:#{true}}")
    private boolean sqlResultCountSwitch;
    @Resource
    private StSqlExeResultCountTimelineMapper sqlExeResultCountTimelineMapper;
    @Resource
    private StSqlExeResultCountDayMapper sqlExeResultCountDayMapper;

    @Async("threadExecutor")
    @Scheduled(cron = "0 01 0 * * ?")
    public void exec() {
        if (sqlResultCountSwitch) {
            log.info("开始统计SQL DAY执行结果信息！开始时间：" + System.currentTimeMillis());
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

                //统计成功
                int success_count = sqlExeResultCountTimelineMapper.searchCountForStatistics(StSqlExeResultCountTimelineSearch.builder()
                        .type(SqlExeResultCountTypeForStatisticsEnum.SUCCESS.getType())
                        .start_time(start_time)
                        .end_time(end_time)
                        .build());
                sqlExeResultCountDayMapper.insertSelective(StSqlExeResultCountDay.builder()
                        .count(success_count)
                        .create_time(start_time)
                        .type(SqlExeResultCountTypeForStatisticsEnum.SUCCESS.getType())
                        .build());
                //统计失败
                int fail_count = sqlExeResultCountTimelineMapper.searchCountForStatistics(StSqlExeResultCountTimelineSearch.builder()
                        .type(SqlExeResultCountTypeForStatisticsEnum.FAIL.getType())
                        .start_time(start_time)
                        .end_time(end_time)
                        .build());
                sqlExeResultCountDayMapper.insertSelective(StSqlExeResultCountDay.builder()
                        .count(fail_count)
                        .create_time(start_time)
                        .type(SqlExeResultCountTypeForStatisticsEnum.FAIL.getType())
                        .build());
                //统计执行中
                int running_count = sqlExeResultCountTimelineMapper.searchCountForStatistics(StSqlExeResultCountTimelineSearch.builder()
                        .type(SqlExeResultCountTypeForStatisticsEnum.RUNNING.getType())
                        .start_time(start_time)
                        .end_time(end_time)
                        .build());
                sqlExeResultCountDayMapper.insertSelective(StSqlExeResultCountDay.builder()
                        .count(running_count)
                        .create_time(start_time)
                        .type(SqlExeResultCountTypeForStatisticsEnum.RUNNING.getType())
                        .build());


                //统计全部

                sqlExeResultCountDayMapper.insertSelective(StSqlExeResultCountDay.builder()
                        .count(success_count + fail_count + running_count)
                        .create_time(start_time)
                        .type(SqlExeResultCountTypeForStatisticsEnum.ALL.getType())
                        .build());

            } catch (Exception e) {
                log.error("开始统计SQL DAY执行结果信息异常:" + e.getMessage());
            }
            log.info("开始统计SQL DAY执行结果信息完成！结束时间：" + System.currentTimeMillis());
        }
    }
}
