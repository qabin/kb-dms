package com.bin.kong.dms.sever.controller.user;

import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.contract.user.entity.RequestUserInfo;
import com.bin.kong.dms.contract.user.request.SqlEditorShareRequest;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.core.enums.SqlEditorStatusEnum;
import com.bin.kong.dms.dao.mapper.join.SqlEditorTabJoinDatasourceMapper;
import com.bin.kong.dms.dao.mapper.user.UsActiveSqlEditorTabMapper;
import com.bin.kong.dms.dao.mapper.user.UsSqlEditorTabMapper;
import com.bin.kong.dms.model.join.entity.SqlEditorTabJoinDatasource;
import com.bin.kong.dms.model.join.search.SqlEditorTabJoinDatasourceSearch;
import com.bin.kong.dms.model.user.entity.UsActiveSqlEditorTab;
import com.bin.kong.dms.model.user.entity.UsSqlEditorTab;
import com.bin.kong.dms.sever.controller.common.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@Slf4j
public class SqlEditorTabController extends BaseController {

    @Resource
    private UsSqlEditorTabMapper sqlEditorTabMapper;
    @Resource
    private SqlEditorTabJoinDatasourceMapper sqlEditorTabJoinDatasourceMapper;

    @Resource
    private UsActiveSqlEditorTabMapper activeSqlEditorTabMapper;

    @RequestMapping(value = "/sql/editor/tab", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.POST)
    public GenericResponse ajax_add_sql_editor_tab(@RequestBody UsSqlEditorTab request) {

        GenericResponse response = new GenericResponse();
        try {
            UsSqlEditorTab usSqlEditorTab = UsSqlEditorTab.builder()
                    .create_time(new Date())
                    .update_time(new Date())
                    .creator_account(super.getUserInfoDTO().getAccount())
                    .creator_name(super.getUserInfoDTO().getName())
                    .datasource_id(request.getDatasource_id())
                    .db(request.getDb())
                    .name(request.getName())
                    .table_name(request.getTable_name())
                    .type(request.getType())
                    .sql_text(request.getSql_text())
                    .build();
            sqlEditorTabMapper.insertSelective(usSqlEditorTab);

            List<UsActiveSqlEditorTab> activeSqlEditorTabList = activeSqlEditorTabMapper.selectList(UsActiveSqlEditorTab.builder()
                    .account(super.getUserInfoDTO().getAccount())
                    .build());
            if (CollectionUtils.isNotEmpty(activeSqlEditorTabList)) {
                activeSqlEditorTabMapper.updateByPrimaryKeySelective(UsActiveSqlEditorTab.builder()
                        .id(activeSqlEditorTabList.get(0).getId())
                        .sql_tab_id(usSqlEditorTab.getId())
                        .update_time(new Date())
                        .build());
            } else {
                activeSqlEditorTabMapper.insertSelective(UsActiveSqlEditorTab.builder()
                        .update_time(new Date())
                        .create_time(new Date())
                        .sql_tab_id(usSqlEditorTab.getId())
                        .account(super.getUserInfoDTO().getAccount())
                        .build());
            }
            response.setData(usSqlEditorTab.getId());
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("保存SQL Editor tab异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    @RequestMapping(value = "/sql/editor/tab/{id}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.PATCH)
    public GenericResponse ajax_update_sql_editor_tab(@PathVariable("id") Integer id, @RequestBody UsSqlEditorTab request) {

        GenericResponse response = new GenericResponse();
        try {
            UsSqlEditorTab usSqlEditorTab = UsSqlEditorTab.builder()
                    .id(id)
                    .update_time(new Date())
                    .datasource_id(request.getDatasource_id())
                    .db(request.getDb())
                    .name(request.getName())
                    .table_name(request.getTable_name())
                    .sql_text(request.getSql_text())
                    .build();
            sqlEditorTabMapper.updateByPrimaryKeySelective(usSqlEditorTab);

            response.setData(usSqlEditorTab.getId());
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("更新SQL Editor tab异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    @RequestMapping(value = "/sql/editor/tab/{id}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.DELETE)
    public GenericResponse ajax_delete_sql_editor_tab(@PathVariable("id") Integer id) {

        GenericResponse response = new GenericResponse();
        try {
            sqlEditorTabMapper.deleteByPrimaryKey(id);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("删除SQL Editor tab异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }


    @RequestMapping(value = "/sql/editor/tab/{id}/_close", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_close_sql_editor_tab(@PathVariable("id") Integer id) {

        GenericResponse response = new GenericResponse();
        try {
            sqlEditorTabMapper.updateByPrimaryKeySelective(UsSqlEditorTab.builder()
                    .id(id)
                    .update_time(new Date())
                    .status(SqlEditorStatusEnum.CLOSED.getStatus())
                    .build());
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("关闭SQL Editor tab异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    @RequestMapping(value = "/sql/editor/tab/{id}/_open", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_open_sql_editor_tab(@PathVariable("id") Integer id) {

        GenericResponse response = new GenericResponse();
        try {
            sqlEditorTabMapper.updateByPrimaryKeySelective(UsSqlEditorTab.builder()
                    .id(id)
                    .update_time(new Date())
                    .status(SqlEditorStatusEnum.OPEN.getStatus())
                    .build());
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("打开SQL Editor tab异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    @RequestMapping(value = "/sql/editor/tab/_search", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_search_sql_editor_tab(@RequestParam(required = false) Integer status) {

        GenericResponse response = new GenericResponse();
        try {
            List<SqlEditorTabJoinDatasource> sqlEditorTabList = new ArrayList<>();

            if (null != super.getUserInfoDTO()) {
                SqlEditorTabJoinDatasourceSearch search = SqlEditorTabJoinDatasourceSearch.builder()
                        .creator_account(super.getUserInfoDTO().getAccount())
                        .build();

                if (null != status) {
                    search.setStatus(status);
                }

                sqlEditorTabList = sqlEditorTabJoinDatasourceMapper.searchList(search);
            }

            response.setData(sqlEditorTabList);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("搜索SQL editor tab异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    @RequestMapping(value = "/sql/editor/tab/{id}/_share", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.POST)
    public GenericResponse ajax_share_sql_editor_tab(@PathVariable("id") Integer id, @RequestBody SqlEditorShareRequest request) {

        GenericResponse response = new GenericResponse();
        try {
            if (CollectionUtils.isNotEmpty(request.getUsers())) {
                UsSqlEditorTab usSqlEditorTab = sqlEditorTabMapper.selectByPrimaryKey(id);

                if (null != usSqlEditorTab) {
                    for (RequestUserInfo user : request.getUsers()) {
                        sqlEditorTabMapper.insertSelective(UsSqlEditorTab.builder()
                                .creator_name(user.getName())
                                .status(SqlEditorStatusEnum.OPEN.getStatus())
                                .update_time(new Date())
                                .type(usSqlEditorTab.getType())
                                .creator_account(user.getAccount())
                                .name(usSqlEditorTab.getName())
                                .sql_text(usSqlEditorTab.getSql_text())
                                .db(usSqlEditorTab.getDb())
                                .datasource_id(usSqlEditorTab.getDatasource_id())
                                .create_time(new Date())
                                .table_name(usSqlEditorTab.getTable_name())
                                .build());
                    }
                }
            }
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("分享SQL editor tab异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }
}
