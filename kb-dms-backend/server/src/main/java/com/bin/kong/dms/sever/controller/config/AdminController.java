package com.bin.kong.dms.sever.controller.config;

import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.dao.mapper.config.CfAdminConfigMapper;
import com.bin.kong.dms.model.config.entity.CfAdminConfig;
import com.bin.kong.dms.model.config.search.AdminSearch;
import com.bin.kong.dms.sever.controller.common.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@RestController
@Slf4j
public class AdminController extends BaseController {

    @Resource
    private CfAdminConfigMapper adminConfigMapper;

    @RequestMapping(value = "/admin/_search", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_admin_search(@RequestParam(required = false) String kw) {

        GenericResponse response = new GenericResponse();
        try {
            List<CfAdminConfig> busGroupList = adminConfigMapper.searchList(AdminSearch.builder()
                    .kw(kw)
                    .build());
            response.setData(busGroupList);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("获取管理员接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    @RequestMapping(value = "/admin", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.POST)
    public GenericResponse ajax_add_admin(@RequestBody CfAdminConfig admin) {

        GenericResponse response = new GenericResponse();
        try {
            List<CfAdminConfig> adminConfigList = adminConfigMapper.selectList(CfAdminConfig.builder()
                    .account(admin.getAccount())
                    .build());

            if (null != adminConfigList && adminConfigList.size() > 0) {
                response.setStatus(ResponseConstants.FAIL_CODE);
                response.setMessage("该用户已是管理员！");

            } else {
                adminConfigMapper.insertSelective(CfAdminConfig.builder()
                        .account(admin.getAccount())
                        .name(admin.getName())
                        .create_time(new Date())
                        .creator_account(super.getUserInfoDTO().getAccount())
                        .creator_name(super.getUserInfoDTO().getName())
                        .build());
                response.setStatus(ResponseConstants.SUCCESS_CODE);
            }

        } catch (Exception e) {
            log.error("添加管理员接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
            response.setMessage("添加异常！");

        }
        return response;
    }

    @RequestMapping(value = "/admin/_delete", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.DELETE)
    public GenericResponse ajax_delete_admin(@RequestParam String account) {

        GenericResponse response = new GenericResponse();
        try {
            adminConfigMapper.deleteByAccount(account);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("删除管理员接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }
}
