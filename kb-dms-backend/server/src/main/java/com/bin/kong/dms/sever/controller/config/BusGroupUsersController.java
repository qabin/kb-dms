package com.bin.kong.dms.sever.controller.config;

import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.dao.mapper.config.CfBusGroupUsersMapper;
import com.bin.kong.dms.model.config.entity.CfBusGroupUsers;
import com.bin.kong.dms.model.config.search.BusGroupUsersSearch;
import com.bin.kong.dms.sever.controller.common.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
public class BusGroupUsersController extends BaseController {
    @Resource
    private CfBusGroupUsersMapper busGroupUsersMapper;

    @RequestMapping(value = "/bus/group/users/_search", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse search_list(@RequestParam Integer id) {

        GenericResponse response = new GenericResponse();
        try {
            List<CfBusGroupUsers> busGroupList = busGroupUsersMapper.searchList(BusGroupUsersSearch.builder()
                    .bus_group_id(id)
                    .build());
            response.setData(busGroupList);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("获取团队下人员接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    @RequestMapping(value = "/bus/group/users", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.POST)
    public GenericResponse ajax_add_group_user(@RequestBody CfBusGroupUsers base) {

        GenericResponse response = new GenericResponse();
        try {

            List<CfBusGroupUsers> dbUsers = busGroupUsersMapper.selectList(CfBusGroupUsers.builder()
                    .account(base.getAccount())
                    .bus_group_id(base.getBus_group_id())
                    .build());

            if (!CollectionUtils.isEmpty(dbUsers)) {
                response.setMessage("该用户已添加！");
                response.setStatus(ResponseConstants.FAIL_CODE);
                return response;
            }

            Integer count = busGroupUsersMapper.insertSelective(CfBusGroupUsers.builder()
                    .name(base.getName())
                    .bus_group_id(base.getBus_group_id())
                    .name(base.getName())
                    .creator_account(super.getUserInfoDTO().getAccount())
                    .creator_name(super.getUserInfoDTO().getName())
                    .account(base.getAccount())
                    .build());
            response.setData(count);
            response.setStatus(ResponseConstants.SUCCESS_CODE);
        } catch (Exception e) {
            log.error("添加团队人员接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }


    @RequestMapping(value = "/bus/group/users/_delete", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.DELETE)
    public GenericResponse ajax_delete_group_user(@RequestParam Integer bus_group_id, @RequestParam String account) {

        GenericResponse response = new GenericResponse();
        try {
            Map<String,Object> params= new HashMap<>();
            params.put("bus_group_id",bus_group_id);
            params.put("account",account);
            Integer count = busGroupUsersMapper.deleteByAccount(params);
            response.setData(count);
            response.setStatus(ResponseConstants.SUCCESS_CODE);
        } catch (Exception e) {
            log.error("删除团队人员接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

}
