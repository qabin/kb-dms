package com.bin.kong.dms.sever.controller.statistics;

import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.contract.statistics.response.GeneralBizCountResponse;
import com.bin.kong.dms.contract.statistics.response.GeneralMonthTimelineResponse;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.core.enums.BusGroupStatusEnum;
import com.bin.kong.dms.core.enums.DataSourceStatusEnum;
import com.bin.kong.dms.core.enums.SqlExeResultCountTypeForStatisticsEnum;
import com.bin.kong.dms.core.enums.SqlSyntaxErrorCountTypeForStatisticsEnum;
import com.bin.kong.dms.dao.mapper.config.CfBusGroupMapper;
import com.bin.kong.dms.dao.mapper.config.CfDatasourceMapper;
import com.bin.kong.dms.dao.mapper.statistics.*;
import com.bin.kong.dms.model.config.entity.CfBusGroup;
import com.bin.kong.dms.model.config.entity.CfDatasource;
import com.bin.kong.dms.model.statistics.entity.StSqlExeBizTotal;
import com.bin.kong.dms.model.statistics.entity.StSqlExeResultCountDay;
import com.bin.kong.dms.model.statistics.entity.StSqlSyntaxErrorCountDay;
import com.bin.kong.dms.model.statistics.search.StSqlExeResultCountDaySearch;
import com.bin.kong.dms.model.statistics.search.StSqlExeResultCountTimelineSearch;
import com.bin.kong.dms.model.statistics.search.StSqlSyntaxErrorCountDaySearch;
import com.bin.kong.dms.model.statistics.search.StSqlSyntaxErrorCountTimelineSearch;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@Slf4j
public class GeneralStatisticsController {
    private final static Integer TABLE_ID = 1;
    private final static Integer DEFAULT_COUNT = 0;
    private final static Integer SQL_EXE_RESULT_MONTH_NUM = 4 * 30;
    private final static Integer SQL_SYNTAX_ERROR_MONTH_NUM = 4 * 30;

    private final static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    @Resource
    private StSqlExeBizTotalMapper sqlExeBizTotalMapper;
    @Resource
    private StSqlSyntaxErrorCountDayMapper sqlSyntaxErrorCountDayMapper;
    @Resource
    private StSqlExeResultCountDayMapper sqlExeResultCountDayMapper;

    @Resource
    private CfBusGroupMapper busGroupMapper;
    @Resource
    private CfDatasourceMapper datasourceMapper;

    @Resource
    private StSqlExeResultCountTimelineMapper sqlExeResultCountTimelineMapper;

    @Resource
    private StSqlSyntaxErrorCountTimelineMapper sqlSyntaxErrorCountTimelineMapper;

    @RequestMapping(value = "/statistics/general/all/biz", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_get_general_all_biz_total() {
        GenericResponse response = new GenericResponse();
        try {

            GeneralBizCountResponse bizCountResponse = new GeneralBizCountResponse();
            StSqlExeBizTotal stSqlExeBizTotal = sqlExeBizTotalMapper.selectByPrimaryKey(TABLE_ID);
            if (stSqlExeBizTotal == null) {
                bizCountResponse.setSql_exe_result_total(DEFAULT_COUNT);
                bizCountResponse.setSql_syntax_no_permission_total(DEFAULT_COUNT);
                bizCountResponse.setSql_syntax_other_error_total(DEFAULT_COUNT);
            } else {
                bizCountResponse.setSql_exe_result_total(stSqlExeBizTotal.getSql_exe_result_total());
                bizCountResponse.setSql_syntax_no_permission_total(stSqlExeBizTotal.getSql_syntax_no_permission_total());
                bizCountResponse.setSql_syntax_other_error_total(stSqlExeBizTotal.getSql_syntax_error_total() - stSqlExeBizTotal.getSql_syntax_no_permission_total());

            }

            Integer bus_count = busGroupMapper.selectCount(CfBusGroup.builder()
                    .status(BusGroupStatusEnum.ACTIVE.getStatus())
                    .build());
            bizCountResponse.setBus_count(bus_count);

            Integer datasource_count = datasourceMapper.selectCount(CfDatasource.builder()
                    .status(DataSourceStatusEnum.ACTIVE.getStatus())
                    .build());

            bizCountResponse.setDatasource_count(datasource_count);
            response.setData(bizCountResponse);
            response.setStatus(ResponseConstants.SUCCESS_CODE);
        } catch (Exception e) {
            log.error("执行ajax_get_all_biz_total异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
        }

        return response;
    }


    @RequestMapping(value = "/statistics/general/month/timeline", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_get_general_month_timeline() {
        GenericResponse response = new GenericResponse();
        try {

            List<GeneralMonthTimelineResponse> timelineResponseList = new ArrayList<>();


            Map<String, Integer> timeLineIndexMap = new HashMap<>();

            List<StSqlSyntaxErrorCountDay> sqlSyntaxErrorCountDayList = sqlSyntaxErrorCountDayMapper.searchList(StSqlSyntaxErrorCountDaySearch.builder()
                    .pageSize(SQL_SYNTAX_ERROR_MONTH_NUM)
                    .build());

            List<StSqlExeResultCountDay> sqlExeResultCountDayList = sqlExeResultCountDayMapper.searchList(StSqlExeResultCountDaySearch.builder()
                    .pageSize(SQL_EXE_RESULT_MONTH_NUM)
                    .build());

            if (CollectionUtils.isNotEmpty(sqlExeResultCountDayList)) {

                sqlExeResultCountDayList = sqlExeResultCountDayList.stream().sorted(Comparator.comparing(StSqlExeResultCountDay::getCreate_time, Comparator.naturalOrder())).collect(Collectors.toList());
                int index = 0;
                for (StSqlExeResultCountDay stSqlExeResultCountDay : sqlExeResultCountDayList) {
                    String date = sdf.format(stSqlExeResultCountDay.getCreate_time());
                    if (timeLineIndexMap.containsKey(date)) {

                        GeneralMonthTimelineResponse monthTimelineResponse = timelineResponseList.get(timeLineIndexMap.get(date));
                        dealResponseWithType(stSqlExeResultCountDay, monthTimelineResponse);
                        timelineResponseList.set(timeLineIndexMap.get(date), monthTimelineResponse);

                    } else {

                        GeneralMonthTimelineResponse monthTimelineResponse = GeneralMonthTimelineResponse.builder()
                                .date(date)
                                .build();
                        dealResponseWithType(stSqlExeResultCountDay, monthTimelineResponse);

                        timelineResponseList.add(monthTimelineResponse);
                        timeLineIndexMap.put(date, index);
                        index++;
                    }
                }
            }

            if (CollectionUtils.isNotEmpty(sqlSyntaxErrorCountDayList)) {
                sqlSyntaxErrorCountDayList = sqlSyntaxErrorCountDayList.stream().sorted(Comparator.comparing(StSqlSyntaxErrorCountDay::getCreate_time, Comparator.naturalOrder())).collect(Collectors.toList());

                for (StSqlSyntaxErrorCountDay stSqlSyntaxErrorCountDay : sqlSyntaxErrorCountDayList) {
                    String date = sdf.format(stSqlSyntaxErrorCountDay.getCreate_time());

                    if (timeLineIndexMap.containsKey(date)) {
                        GeneralMonthTimelineResponse monthTimelineResponse = timelineResponseList.get(timeLineIndexMap.get(date));
                        switch (SqlSyntaxErrorCountTypeForStatisticsEnum.getByType(stSqlSyntaxErrorCountDay.getType())) {
                            case ALL:
                                monthTimelineResponse.setSql_syntax_error_total(stSqlSyntaxErrorCountDay.getCount());
                                break;
                            case NO_LIMIT:
                                monthTimelineResponse.setSql_syntax_no_limit_total(stSqlSyntaxErrorCountDay.getCount());
                                break;
                            case NO_PERMISSION:
                                monthTimelineResponse.setSql_syntax_no_permission_total(stSqlSyntaxErrorCountDay.getCount());
                                break;
                            case NO_WHERE:
                                monthTimelineResponse.setSql_syntax_no_where_total(stSqlSyntaxErrorCountDay.getCount());
                                break;
                        }
                        timelineResponseList.set(timeLineIndexMap.get(date), monthTimelineResponse);

                    }
                }
            }

            //添加当前统计信息
            timelineResponseList.add(getTodayCount());

            response.setData(timelineResponseList);
            response.setStatus(ResponseConstants.SUCCESS_CODE);
        } catch (Exception e) {
            log.error("执行ajax_get_general_month_timeline异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
        }

        return response;
    }

    private void dealResponseWithType(StSqlExeResultCountDay stSqlExeResultCountDay, GeneralMonthTimelineResponse monthTimelineResponse) {
        switch (SqlExeResultCountTypeForStatisticsEnum.getByType(stSqlExeResultCountDay.getType())) {
            case ALL:
                monthTimelineResponse.setSql_exe_result_total(stSqlExeResultCountDay.getCount());
                break;
            case SUCCESS:
                monthTimelineResponse.setSql_exe_result_success_total(stSqlExeResultCountDay.getCount());
                break;
            case FAIL:
                monthTimelineResponse.setSql_exe_result_fail_total(stSqlExeResultCountDay.getCount());
                break;
            case RUNNING:
                monthTimelineResponse.setSql_exe_result_running_total(stSqlExeResultCountDay.getCount());
                break;
        }
    }

    private GeneralMonthTimelineResponse getTodayCount() {

        Calendar calendar = Calendar.getInstance();
        Date end_time;
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        end_time = calendar.getTime();

        Date start_time;
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        start_time = calendar.getTime();

        GeneralMonthTimelineResponse today_response = GeneralMonthTimelineResponse.builder()
                .date(sdf.format(start_time))
                .build();

        Integer today_sql_exe_result_total = sqlExeResultCountTimelineMapper.searchCountForStatistics(StSqlExeResultCountTimelineSearch.builder()
                .type(SqlExeResultCountTypeForStatisticsEnum.ALL.getType())
                .start_time(start_time)
                .end_time(end_time)
                .build());
        today_response.setSql_exe_result_total(null != today_sql_exe_result_total ? today_sql_exe_result_total : 0);


        Integer today_sql_exe_result_success_total = sqlExeResultCountTimelineMapper.searchCountForStatistics(StSqlExeResultCountTimelineSearch.builder()
                .type(SqlExeResultCountTypeForStatisticsEnum.SUCCESS.getType())
                .start_time(start_time)
                .end_time(end_time)
                .build());
        today_response.setSql_exe_result_success_total(null != today_sql_exe_result_success_total ? today_sql_exe_result_success_total : 0);


        Integer today_sql_exe_fail_total = sqlExeResultCountTimelineMapper.searchCountForStatistics(StSqlExeResultCountTimelineSearch.builder()
                .type(SqlExeResultCountTypeForStatisticsEnum.FAIL.getType())
                .start_time(start_time)
                .end_time(end_time)
                .build());
        today_response.setSql_exe_result_fail_total(null != today_sql_exe_fail_total ? today_sql_exe_fail_total : 0);


        Integer today_sql_exe_running_total = sqlExeResultCountTimelineMapper.searchCountForStatistics(StSqlExeResultCountTimelineSearch.builder()
                .type(SqlExeResultCountTypeForStatisticsEnum.RUNNING.getType())
                .start_time(start_time)
                .end_time(end_time)
                .build());
        today_response.setSql_exe_result_running_total(null != today_sql_exe_running_total ? today_sql_exe_running_total : 0);


        Integer today_sql_syntax_error_all_total = sqlSyntaxErrorCountTimelineMapper.searchCountForStatistics(StSqlSyntaxErrorCountTimelineSearch.builder()
                .type(SqlSyntaxErrorCountTypeForStatisticsEnum.ALL.getType())
                .start_time(start_time)
                .end_time(end_time)
                .build());
        today_response.setSql_syntax_error_total(null != today_sql_syntax_error_all_total ? today_sql_syntax_error_all_total : 0);


        Integer today_sql_syntax_error_no_permission_total = sqlSyntaxErrorCountTimelineMapper.searchCountForStatistics(StSqlSyntaxErrorCountTimelineSearch.builder()
                .type(SqlSyntaxErrorCountTypeForStatisticsEnum.NO_PERMISSION.getType())
                .start_time(start_time)
                .end_time(end_time)
                .build());
        today_response.setSql_syntax_no_permission_total(null != today_sql_syntax_error_no_permission_total ? today_sql_syntax_error_no_permission_total : 0);


        Integer today_sql_syntax_error_no_where_total = sqlSyntaxErrorCountTimelineMapper.searchCountForStatistics(StSqlSyntaxErrorCountTimelineSearch.builder()
                .type(SqlSyntaxErrorCountTypeForStatisticsEnum.NO_WHERE.getType())
                .start_time(start_time)
                .end_time(end_time)
                .build());
        today_response.setSql_syntax_no_where_total(null != today_sql_syntax_error_no_where_total ? today_sql_syntax_error_no_where_total : 0);


        Integer today_sql_syntax_error_no_limit_total = sqlSyntaxErrorCountTimelineMapper.searchCountForStatistics(StSqlSyntaxErrorCountTimelineSearch.builder()
                .type(SqlSyntaxErrorCountTypeForStatisticsEnum.NO_LIMIT.getType())
                .start_time(start_time)
                .end_time(end_time)
                .build());
        today_response.setSql_syntax_no_limit_total(null != today_sql_syntax_error_no_limit_total ? today_sql_syntax_error_no_limit_total : 0);


        return today_response;
    }

}
