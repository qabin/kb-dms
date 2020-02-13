package com.bin.kong.dms.sever.controller.config;

import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.dao.mapper.config.CfDatasourcePermissionSqlOptionsMapper;
import com.bin.kong.dms.model.config.entity.CfDatasourcePermissionSqlOptions;
import com.bin.kong.dms.sever.controller.common.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@Slf4j
public class DatasourcePermissionSqlOptionsController extends BaseController {

    @Resource
    private CfDatasourcePermissionSqlOptionsMapper datasourcePermissionSqlOptionsMapper;


    @RequestMapping(value = "/datasource/{id}/permission/sql/options", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.POST)
    public GenericResponse ajax_add_datasource_permission_sql_options(@PathVariable("id") Integer id, @RequestBody CfDatasourcePermissionSqlOptions request) {

        GenericResponse response = new GenericResponse();
        try {

            List<CfDatasourcePermissionSqlOptions> permissionSqlOptionsList = datasourcePermissionSqlOptionsMapper.selectList(CfDatasourcePermissionSqlOptions.builder()
                    .account(request.getAccount())
                    .option_type(request.getOption_type())
                    .datasource_id(id)
                    .build());

            if (CollectionUtils.isEmpty(permissionSqlOptionsList)) {
                datasourcePermissionSqlOptionsMapper.insertSelective(CfDatasourcePermissionSqlOptions.builder()
                        .datasource_id(id)
                        .account(request.getAccount())
                        .option_type(request.getOption_type())
                        .build());
            }

            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("添加用户数据源权限异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }


    @RequestMapping(value = "/datasource/{id}/permission/sql/options", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.DELETE)
    public GenericResponse ajax_delete_datasource_permission_sql_options(@PathVariable("id") Integer id, @RequestParam Integer option_type, @RequestParam String account) {

        GenericResponse response = new GenericResponse();
        try {

            datasourcePermissionSqlOptionsMapper.deleteByKeySelective(CfDatasourcePermissionSqlOptions.builder()
                    .datasource_id(id)
                    .account(account)
                    .option_type(option_type)
                    .build());

            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("删除用户数据源权限异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }
}
