package com.bin.kong.dms.sever.controller.user;

import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.dao.mapper.user.UsActiveSqlEditorTabMapper;
import com.bin.kong.dms.model.user.entity.UsActiveSqlEditorTab;
import com.bin.kong.dms.sever.controller.common.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@RestController
@Slf4j
public class ActiveSqlEditorTabController extends BaseController {

    @Resource
    private UsActiveSqlEditorTabMapper activeSqlEditorTabMapper;

    @RequestMapping(value = "/sql/editor/tab/{id}/_active", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_add_active_sql_editor_tab(@PathVariable("id") Integer id) {

        GenericResponse response = new GenericResponse();
        try {
            List<UsActiveSqlEditorTab> activeSqlEditorTabList = activeSqlEditorTabMapper.selectList(UsActiveSqlEditorTab.builder()
                    .account(super.getUserInfoDTO().getAccount())
                    .build());
            if (CollectionUtils.isNotEmpty(activeSqlEditorTabList)) {
                activeSqlEditorTabMapper.updateByPrimaryKeySelective(UsActiveSqlEditorTab.builder()
                        .id(activeSqlEditorTabList.get(0).getId())
                        .sql_tab_id(id)
                        .update_time(new Date())
                        .build());
            } else {
                activeSqlEditorTabMapper.insertSelective(UsActiveSqlEditorTab.builder()
                        .update_time(new Date())
                        .create_time(new Date())
                        .sql_tab_id(id)
                        .account(super.getUserInfoDTO().getAccount())
                        .build());
            }
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("保存 ACTIVE SQL Editor tab异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    @RequestMapping(value = "/active/sql/editor/tab/_search", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_search_active_sql_editor_tab() {

        GenericResponse response = new GenericResponse();
        try {
            List<UsActiveSqlEditorTab> activeSqlEditorTabList = activeSqlEditorTabMapper.selectList(UsActiveSqlEditorTab.builder()
                    .account(super.getUserInfoDTO().getAccount())
                    .build());
            response.setData(activeSqlEditorTabList);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("查询 ACTIVE SQL Editor tab异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }
}
