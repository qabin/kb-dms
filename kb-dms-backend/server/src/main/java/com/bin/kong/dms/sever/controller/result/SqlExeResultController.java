package com.bin.kong.dms.sever.controller.result;

import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.core.enums.*;
import com.bin.kong.dms.dao.mapper.result.RsSqlExeRecordMapper;
import com.bin.kong.dms.dao.mapper.result.RsSqlExeResultMapper;
import com.bin.kong.dms.model.result.entity.RsSqlExeRecord;
import com.bin.kong.dms.model.result.entity.RsSqlExeResult;
import com.bin.kong.dms.model.result.search.SqlExeResultSearch;
import com.bin.kong.dms.sever.controller.common.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
public class SqlExeResultController extends BaseController {

    @Resource
    private RsSqlExeRecordMapper sqlExeRecordMapper;
    @Resource
    private RsSqlExeResultMapper sqlExeResultMapper;

    @RequestMapping(value = "/sql/exe/record/{id}/_result", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_get_sql_exe_record_result(@PathVariable("id") Integer id) {

        GenericResponse response = new GenericResponse();
        try {
            RsSqlExeRecord sqlExeRecord = sqlExeRecordMapper.selectByPrimaryKey(id);

            if (sqlExeRecord.getStatus().equals(SqlExeRecordStatusEnum.COMPLETE.getStatus())) {
                List<RsSqlExeResult> sqlExeResultList = sqlExeResultMapper.selectList(RsSqlExeResult.builder()
                        .sql_exe_record_id(sqlExeRecord.getId())
                        .build());

                response.setData(sqlExeResultList);
                response.setStatus(ResponseConstants.SUCCESS_CODE);
            } else {

                response.setStatus(ResponseConstants.SUCCESS_CODE);
            }

        } catch (Exception e) {
            log.error("SQL执行结果查询接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }


    @RequestMapping(value = "/sql/exe/result/_search", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_sql_exe_result_search(@RequestParam(required = false) String kw, @RequestParam(required = false) Integer page, @RequestParam(required = false) Integer size, @RequestParam(required = false) String query_by, @RequestParam(required = false) String query_type) {


        SqlExeResultSearch search = SqlExeResultSearch.builder()
                .kw(kw)
                .pageNum(page)
                .pageSize(size)
                .build();
        if (StringUtils.isNotEmpty(query_by)) {
            switch (SqlExeResultSearchByEnum.getByName(query_by)) {
                case EXECUTED_BY_ME:
                    search.setCreator(super.getUserInfoDTO().getAccount());
                    break;
            }
        }

        if (StringUtils.isNotEmpty(query_type)) {
            switch (SqlExeResultSearchTypeEnum.getByName(query_type)) {
                case DQL_TYPE:
                    search.setSql_option_type(SqlOptionTypeEnum.DQL.getType());
                    break;
                case DML_TYPE:
                    search.setSql_option_type(SqlOptionTypeEnum.DML.getType());
                    break;
                case DDL_TYPE:
                    search.setSql_option_type(SqlOptionTypeEnum.DDL.getType());
                    break;
                case NO_PERMISSION:
                    search.setSyntax_error_type(SqlSyntaxCheckResultEnum.NO_PERMISSION.getType());
                    break;
                case SYNTAX_ERROR:
                    search.setIs_syntax_error(true);
                    break;
                case EXE_FAILED:
                    search.setStatus(SqlExeResultStatusEnum.FAIL.getStatus());
                    break;

            }
        }
        GenericResponse response = new GenericResponse();
        try {
            List<RsSqlExeResult> sqlExeResultList = sqlExeResultMapper.searchList(search);
            Integer count = sqlExeResultMapper.searchCount(search);
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("data", sqlExeResultList);
            resultMap.put("count", count);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

            response.setData(resultMap);
        } catch (Exception e) {
            log.error("SQL执行结果搜索异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }
}
