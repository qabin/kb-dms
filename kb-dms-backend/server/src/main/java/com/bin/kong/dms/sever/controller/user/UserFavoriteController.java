package com.bin.kong.dms.sever.controller.user;


import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.dao.mapper.user.UsFavoriteDatasourceMapper;
import com.bin.kong.dms.dao.mapper.user.UsFavoriteDbMapper;
import com.bin.kong.dms.dao.mapper.user.UsFavoriteGroupMapper;
import com.bin.kong.dms.dao.mapper.user.UsFavoriteTableMapper;
import com.bin.kong.dms.model.user.entity.UsFavoriteDatasource;
import com.bin.kong.dms.model.user.entity.UsFavoriteDb;
import com.bin.kong.dms.model.user.entity.UsFavoriteGroup;
import com.bin.kong.dms.model.user.entity.UsFavoriteTable;
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
public class UserFavoriteController extends BaseController {
    @Resource
    private UsFavoriteGroupMapper favoriteGroupMapper;
    @Resource
    private UsFavoriteDatasourceMapper favoriteDatasourceMapper;
    @Resource
    private UsFavoriteDbMapper favoriteDbMapper;

    @Resource
    private UsFavoriteTableMapper favoriteTableMapper;

    @RequestMapping(value = "group/{id}/_favorite", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_add_group_favorite(@PathVariable("id") Integer id) {
        GenericResponse response = new GenericResponse();
        try {
            List<UsFavoriteGroup> favoriteGroupList = favoriteGroupMapper.selectList(UsFavoriteGroup.builder()
                    .account(super.getUserInfoDTO().getAccount())
                    .group_id(id)
                    .build());

            if (CollectionUtils.isEmpty(favoriteGroupList)) {
                favoriteGroupMapper.insertSelective(UsFavoriteGroup.builder()
                        .group_id(id)
                        .account(super.getUserInfoDTO().getAccount())
                        .create_time(new Date())
                        .build());
            }

            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("执行ajax_add_group_favorite异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
        }
        return response;
    }


    @RequestMapping(value = "group/{id}/_favorite", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_delete_group_favorite(@PathVariable("id") Integer id) {
        GenericResponse response = new GenericResponse();
        try {
            favoriteGroupMapper.deleteByPrimaryKeySelective(UsFavoriteGroup.builder()
                    .account(super.getUserInfoDTO().getAccount())
                    .group_id(id)
                    .build());

            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("执行ajax_delete_group_favorite异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
        }
        return response;
    }


    @RequestMapping(value = "datasource/{id}/_favorite", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_add_datasource_favorite(@PathVariable("id") Integer id) {
        GenericResponse response = new GenericResponse();
        try {
            List<UsFavoriteDatasource> favoriteDatasourceList = favoriteDatasourceMapper.selectList(UsFavoriteDatasource.builder()
                    .account(super.getUserInfoDTO().getAccount())
                    .datasource_id(id)
                    .build());

            if (CollectionUtils.isEmpty(favoriteDatasourceList)) {
                favoriteDatasourceMapper.insertSelective(UsFavoriteDatasource.builder()
                        .datasource_id(id)
                        .account(super.getUserInfoDTO().getAccount())
                        .create_time(new Date())
                        .build());
            }

            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("执行ajax_add_datasource_favorite异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
        }
        return response;
    }


    @RequestMapping(value = "datasource/{id}/_favorite", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_delete_datasource_favorite(@PathVariable("id") Integer id) {
        GenericResponse response = new GenericResponse();
        try {
            favoriteDatasourceMapper.deleteByPrimaryKeySelective(UsFavoriteDatasource.builder()
                    .account(super.getUserInfoDTO().getAccount())
                    .datasource_id(id)
                    .build());

            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("执行ajax_delete_datasource_favorite异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
        }
        return response;
    }

    @RequestMapping(value = "datasource/{id}/{db}/_favorite", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_add_db_favorite(@PathVariable("id") Integer id, @PathVariable("db") String db) {
        GenericResponse response = new GenericResponse();
        try {
            List<UsFavoriteDb> favoriteDbList = favoriteDbMapper.selectList(UsFavoriteDb.builder()
                    .account(super.getUserInfoDTO().getAccount())
                    .datasource_id(id)
                    .db(db)
                    .build());

            if (CollectionUtils.isEmpty(favoriteDbList)) {
                favoriteDbMapper.insertSelective(UsFavoriteDb.builder()
                        .datasource_id(id)
                        .account(super.getUserInfoDTO().getAccount())
                        .db(db)
                        .create_time(new Date())
                        .build());
            }

            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("执行ajax_add_db_favorite异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
        }
        return response;
    }


    @RequestMapping(value = "datasource/{id}/{db}/_favorite", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_delete_db_favorite(@PathVariable("id") Integer id, @PathVariable("db") String db) {
        GenericResponse response = new GenericResponse();
        try {
            favoriteDbMapper.deleteByPrimaryKeySelective(UsFavoriteDb.builder()
                    .account(super.getUserInfoDTO().getAccount())
                    .db(db)
                    .datasource_id(id)
                    .build());

            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("执行ajax_delete_db_favorite异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
        }
        return response;
    }


    @RequestMapping(value = "datasource/{id}/{db}/{table}/_favorite", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_add_table_favorite(@PathVariable("id") Integer id, @PathVariable("db") String db, @PathVariable("table") String table) {
        GenericResponse response = new GenericResponse();
        try {
            List<UsFavoriteTable> favoriteTableList = favoriteTableMapper.selectList(UsFavoriteTable.builder()
                    .account(super.getUserInfoDTO().getAccount())
                    .datasource_id(id)
                    .db(db)
                    .table_name(table)
                    .build());

            if (CollectionUtils.isEmpty(favoriteTableList)) {
                favoriteTableMapper.insertSelective(UsFavoriteTable.builder()
                        .datasource_id(id)
                        .account(super.getUserInfoDTO().getAccount())
                        .db(db)
                        .table_name(table)
                        .create_time(new Date())
                        .build());
            }

            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("执行ajax_add_table_favorite异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
        }
        return response;
    }


    @RequestMapping(value = "datasource/{id}/{db}/{table}/_favorite", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public GenericResponse ajax_delete_table_favorite(@PathVariable("id") Integer id, @PathVariable("db") String db, @PathVariable("table") String table) {
        GenericResponse response = new GenericResponse();
        try {
            favoriteTableMapper.deleteByPrimaryKeySelective(UsFavoriteTable.builder()
                    .account(super.getUserInfoDTO().getAccount())
                    .db(db)
                    .datasource_id(id)
                    .table_name(table)
                    .build());

            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("执行ajax_delete_table_favorite异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
        }
        return response;
    }

}
