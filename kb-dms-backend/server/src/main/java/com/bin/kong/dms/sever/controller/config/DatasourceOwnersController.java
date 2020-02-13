package com.bin.kong.dms.sever.controller.config;

import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.dao.mapper.config.CfDatasourceOwnersMapper;
import com.bin.kong.dms.model.config.entity.CfDatasourceOwners;
import com.bin.kong.dms.sever.controller.common.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@Slf4j
public class DatasourceOwnersController extends BaseController {
    @Resource
    private CfDatasourceOwnersMapper datasourceOwnersMapper;

    @RequestMapping(value = "/datasource/{id}/owners", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_datasource_owners_search(@PathVariable("id") Integer id) {

        GenericResponse response = new GenericResponse();
        try {
            List<CfDatasourceOwners> datasourceOwnersList = datasourceOwnersMapper.selectList(CfDatasourceOwners.builder()
                    .datasource_id(id)
                    .build());
            response.setData(datasourceOwnersList);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("查询数据源负责人接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    @RequestMapping(value = "/datasource/{id}/owners", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.PATCH)
    public GenericResponse ajax_update_datasource_owners(@PathVariable("id") Integer id, @RequestBody List<CfDatasourceOwners> data) {

        GenericResponse response = new GenericResponse();
        try {
            datasourceOwnersMapper.deleteByDatasourceId(id);
            if (!CollectionUtils.isEmpty(data)) {
                data.forEach(d -> {
                    datasourceOwnersMapper.insertSelective(CfDatasourceOwners.builder()
                            .datasource_id(id)
                            .account(d.getAccount())
                            .name(d.getName())
                            .build());
                });
            }
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("修改数据源负责人接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

}
