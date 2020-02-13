package com.bin.kong.dms.sever.job;

import com.bin.kong.dms.core.enums.SqlExeResultStatusEnum;
import com.bin.kong.dms.core.enums.SqlExeResultCountTypeForStatisticsEnum;
import com.bin.kong.dms.dao.mapper.result.RsSqlExeResultMapper;
import com.bin.kong.dms.dao.mapper.statistics.StSqlExeResultCountTimelineMapper;
import com.bin.kong.dms.model.result.search.SqlExeResultForStatisticsSearch;
import com.bin.kong.dms.model.statistics.entity.StSqlExeBizTotal;
import com.bin.kong.dms.model.statistics.entity.StSqlExeResultCountTimeline;
import com.bin.kong.dms.sever.service.IStSqlExeBizTotalService;
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
public class SqlExeResultCountForTimelineJob {
    @Value("${job.sql-exe-result.sql-result-count:#{true}}")
    private boolean sqlResultCountSwitch;
    @Resource
    private StSqlExeResultCountTimelineMapper sqlExeResultCountTimelineMapper;

    @Resource
    private RsSqlExeResultMapper sqlExeResultMapper;

    @Resource
    private IStSqlExeBizTotalService sqlExeBizTotalService;

    @Async("threadExecutor")
    @Scheduled(cron = "0 0/5 * * * ?")
    public void exec() {
        if (sqlResultCountSwitch) {
            log.info("开始统计SQL执行结果信息！开始时间：" + System.currentTimeMillis());
            try {

                Calendar calendar = Calendar.getInstance();
                Date cur_time = calendar.getTime();
                Date end_time;
                calendar.add(Calendar.MINUTE, -5);
                end_time = calendar.getTime();
                Date start_time;
                calendar.add(Calendar.MINUTE, -5);
                start_time = calendar.getTime();


                //统计成功
                int success_count = sqlExeResultMapper.searchCountForStatistics(SqlExeResultForStatisticsSearch.builder()
                        .status(SqlExeResultStatusEnum.SUCCESS.getStatus())
                        .start_time(start_time)
                        .end_time(end_time)
                        .build());
                sqlExeResultCountTimelineMapper.insertSelective(StSqlExeResultCountTimeline.builder()
                        .count(success_count)
                        .create_time(cur_time)
                        .type(SqlExeResultCountTypeForStatisticsEnum.SUCCESS.getType())
                        .build());
                //统计失败
                int fail_count = sqlExeResultMapper.searchCountForStatistics(SqlExeResultForStatisticsSearch.builder()
                        .status(SqlExeResultStatusEnum.FAIL.getStatus())
                        .start_time(start_time)
                        .end_time(end_time)
                        .build());
                sqlExeResultCountTimelineMapper.insertSelective(StSqlExeResultCountTimeline.builder()
                        .count(fail_count)
                        .create_time(cur_time)
                        .type(SqlExeResultCountTypeForStatisticsEnum.FAIL.getType())
                        .build());
                //统计执行中
                int running_count = sqlExeResultMapper.searchCountForStatistics(SqlExeResultForStatisticsSearch.builder()
                        .status(SqlExeResultStatusEnum.RUNNING.getStatus())
                        .start_time(start_time)
                        .end_time(end_time)
                        .build());
                sqlExeResultCountTimelineMapper.insertSelective(StSqlExeResultCountTimeline.builder()
                        .count(running_count)
                        .create_time(cur_time)
                        .type(SqlExeResultCountTypeForStatisticsEnum.RUNNING.getType())
                        .build());

                //统计全部

                sqlExeResultCountTimelineMapper.insertSelective(StSqlExeResultCountTimeline.builder()
                        .count(success_count + fail_count + running_count)
                        .create_time(cur_time)
                        .type(SqlExeResultCountTypeForStatisticsEnum.ALL.getType())
                        .build());

                //更新统计总表
                sqlExeBizTotalService.update(StSqlExeBizTotal.builder()
                        .sql_exe_result_total(success_count+fail_count+running_count)
                        .sql_exe_result_fail_total(fail_count)
                        .sql_exe_result_success_total(success_count)
                        .sql_exe_result_running_total(running_count)
                        .build());

            } catch (Exception e) {
                log.error("开始统计SQL执行结果信息异常:" + e.getMessage());
            }
            log.info("开始统计SQL执行结果信息完成！结束时间：" + System.currentTimeMillis());
        }
    }
}
