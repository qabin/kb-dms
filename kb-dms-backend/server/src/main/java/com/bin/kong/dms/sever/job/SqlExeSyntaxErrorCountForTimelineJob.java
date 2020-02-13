package com.bin.kong.dms.sever.job;

import com.bin.kong.dms.core.enums.SqlSyntaxCheckResultEnum;
import com.bin.kong.dms.core.enums.SqlSyntaxErrorCountTypeForStatisticsEnum;
import com.bin.kong.dms.dao.mapper.result.RsSqlExeResultMapper;
import com.bin.kong.dms.dao.mapper.statistics.StSqlSyntaxErrorCountTimelineMapper;
import com.bin.kong.dms.model.result.search.SqlExeResultForStatisticsSearch;
import com.bin.kong.dms.model.statistics.entity.StSqlExeBizTotal;
import com.bin.kong.dms.model.statistics.entity.StSqlSyntaxErrorCountTimeline;
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
public class SqlExeSyntaxErrorCountForTimelineJob {
    @Value("${job.sql-exe-result.sql-syntax-error-count:#{true}}")
    private boolean sqlSyntaxErrorCountSwitch;
    @Resource
    private StSqlSyntaxErrorCountTimelineMapper stSqlSyntaxErrorCountTimelineMapper;

    @Resource
    private RsSqlExeResultMapper sqlExeResultMapper;

    @Resource
    private IStSqlExeBizTotalService sqlExeBizTotalService;

    @Async("threadExecutor")
    @Scheduled(cron = "0 0/5 * * * ?")
    public void exec() {
        if (sqlSyntaxErrorCountSwitch) {
            log.info("开始统计SQL Syntax执行结果信息！开始时间：" + System.currentTimeMillis());
            try {

                Calendar calendar = Calendar.getInstance();
                Date cur_time = calendar.getTime();
                Date end_time;
                calendar.add(Calendar.MINUTE, -5);
                end_time = calendar.getTime();
                Date start_time;
                calendar.add(Calendar.MINUTE, -5);
                start_time = calendar.getTime();

                //统计缺少LIMIT
                int no_limit_count = sqlExeResultMapper.searchCountForStatistics(SqlExeResultForStatisticsSearch.builder()
                        .syntax_error_type(SqlSyntaxCheckResultEnum.NO_LIMIT.getType())
                        .start_time(start_time)
                        .end_time(end_time)
                        .build());
                stSqlSyntaxErrorCountTimelineMapper.insertSelective(StSqlSyntaxErrorCountTimeline.builder()
                        .count(no_limit_count)
                        .create_time(cur_time)
                        .type(SqlSyntaxErrorCountTypeForStatisticsEnum.NO_LIMIT.getType())
                        .build());
                //统计缺少WHERE
                int no_where_count = sqlExeResultMapper.searchCountForStatistics(SqlExeResultForStatisticsSearch.builder()
                        .syntax_error_type(SqlSyntaxCheckResultEnum.NO_WHERE.getType())
                        .start_time(start_time)
                        .end_time(end_time)
                        .build());
                stSqlSyntaxErrorCountTimelineMapper.insertSelective(StSqlSyntaxErrorCountTimeline.builder()
                        .count(no_where_count)
                        .create_time(cur_time)
                        .type(SqlSyntaxErrorCountTypeForStatisticsEnum.NO_WHERE.getType())
                        .build());
                //统计缺少permission
                int no_permission_count = sqlExeResultMapper.searchCountForStatistics(SqlExeResultForStatisticsSearch.builder()
                        .syntax_error_type(SqlSyntaxCheckResultEnum.NO_PERMISSION.getType())
                        .start_time(start_time)
                        .end_time(end_time)
                        .build());
                stSqlSyntaxErrorCountTimelineMapper.insertSelective(StSqlSyntaxErrorCountTimeline.builder()
                        .count(no_permission_count)
                        .create_time(cur_time)
                        .type(SqlSyntaxErrorCountTypeForStatisticsEnum.NO_PERMISSION.getType())
                        .build());

                //统计全部
                stSqlSyntaxErrorCountTimelineMapper.insertSelective(StSqlSyntaxErrorCountTimeline.builder()
                        .count(no_permission_count + no_limit_count + no_where_count)
                        .create_time(cur_time)
                        .type(SqlSyntaxErrorCountTypeForStatisticsEnum.ALL.getType())
                        .build());


                //统计信息写入总表

                sqlExeBizTotalService.update(StSqlExeBizTotal.builder()
                        .sql_syntax_error_total(no_permission_count + no_limit_count + no_where_count)
                        .sql_syntax_no_limit_total(no_limit_count)
                        .sql_syntax_no_permission_total(no_permission_count)
                        .sql_syntax_no_where_total(no_where_count)
                        .build());
            } catch (Exception e) {
                log.error("统计SQL Syntax执行结果信息异常:" + e.getMessage());
            }
            log.info("统计SQL Syntax执行结果信息完成！结束时间：" + System.currentTimeMillis());
        }
    }
}
