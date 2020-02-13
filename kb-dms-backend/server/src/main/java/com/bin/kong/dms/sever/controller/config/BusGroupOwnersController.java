package com.bin.kong.dms.sever.controller.config;

import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.dao.mapper.config.CfBusGroupOwnersMapper;
import com.bin.kong.dms.model.config.entity.CfBusGroupOwners;
import com.bin.kong.dms.sever.controller.common.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@Slf4j
public class BusGroupOwnersController extends BaseController {
    @Resource
    private CfBusGroupOwnersMapper busGroupOwnersMapper;

    @RequestMapping(value = "/bus/group/{id}/owners", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_link_owners_search(@PathVariable("id") Integer id) {

        GenericResponse response = new GenericResponse();
        try {
            List<CfBusGroupOwners> linkOwnersList = busGroupOwnersMapper.selectList(CfBusGroupOwners.builder()
                    .bus_group_id(id)
                    .build());
            response.setData(linkOwnersList);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("查询业务团队负责人接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    @RequestMapping(value = "/bus/group/{id}/owners", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.PATCH)
    public GenericResponse ajax_update_link_owners(@PathVariable("id") Integer id, @RequestBody List<CfBusGroupOwners> data) {

        GenericResponse response = new GenericResponse();
        try {
            busGroupOwnersMapper.deleteByBusGroupId(id);
            if (!CollectionUtils.isEmpty(data)) {
                data.forEach(d -> {
                    busGroupOwnersMapper.insertSelective(CfBusGroupOwners.builder()
                            .bus_group_id(id)
                            .account(d.getAccount())
                            .name(d.getName())
                            .build());
                });
            }
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("修改业务团队负责人接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

}
