package com.bin.kong.dms.sever.controller.config;

import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.contract.config.response.DatasourceForSearchResponse;
import com.bin.kong.dms.contract.config.response.DbResponse;
import com.bin.kong.dms.contract.config.response.TableResponse;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.core.entity.*;
import com.bin.kong.dms.core.enums.DataSourceStatusEnum;
import com.bin.kong.dms.core.enums.DatasourceSearchTypeEnum;
import com.bin.kong.dms.core.utils.DbUtils;
import com.bin.kong.dms.core.utils.PPAesUtils;
import com.bin.kong.dms.dao.mapper.config.CfBusGroupOwnersMapper;
import com.bin.kong.dms.dao.mapper.config.CfBusGroupUsersMapper;
import com.bin.kong.dms.dao.mapper.config.CfDatasourceMapper;
import com.bin.kong.dms.dao.mapper.join.DatasourceJoinGroupJoinOwnerMapper;
import com.bin.kong.dms.dao.mapper.join.DatasourceJoinGroupMapper;
import com.bin.kong.dms.dao.mapper.user.UsFavoriteDatasourceMapper;
import com.bin.kong.dms.dao.mapper.user.UsFavoriteDbMapper;
import com.bin.kong.dms.dao.mapper.user.UsFavoriteGroupMapper;
import com.bin.kong.dms.dao.mapper.user.UsFavoriteTableMapper;
import com.bin.kong.dms.model.config.entity.CfBusGroupOwners;
import com.bin.kong.dms.model.config.entity.CfBusGroupUsers;
import com.bin.kong.dms.model.config.entity.CfDatasource;
import com.bin.kong.dms.model.join.entity.DatasourceJoinGroup;
import com.bin.kong.dms.model.join.entity.DatasourceJoinGroupJoinOwner;
import com.bin.kong.dms.model.join.search.DatasourceJoinGroupJoinOwnerSearch;
import com.bin.kong.dms.model.join.search.DatasourceJoinGroupSearch;
import com.bin.kong.dms.model.user.entity.UsFavoriteDatasource;
import com.bin.kong.dms.model.user.entity.UsFavoriteDb;
import com.bin.kong.dms.model.user.entity.UsFavoriteGroup;
import com.bin.kong.dms.model.user.entity.UsFavoriteTable;
import com.bin.kong.dms.sever.controller.common.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@Slf4j
public class DatasourceController extends BaseController {

    @Resource
    private CfDatasourceMapper datasourceMapper;
    @Resource
    private DatasourceJoinGroupMapper datasourceJoinGroupMapper;
    @Resource
    private DatasourceJoinGroupJoinOwnerMapper datasourceJoinGroupJoinOwnerMapper;

    @Resource
    private UsFavoriteGroupMapper favoriteGroupMapper;
    @Resource
    private UsFavoriteDatasourceMapper favoriteDatasourceMapper;
    @Resource
    private CfBusGroupUsersMapper busGroupUsersMapper;
    @Resource
    private CfBusGroupOwnersMapper busGroupOwnersMapper;
    @Resource
    private UsFavoriteDbMapper favoriteDbMapper;
    @Resource
    private UsFavoriteTableMapper favoriteTableMapper;

    @RequestMapping(value = "/datasource/_search", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_datasource_search(@RequestParam(required = false) String kw, @RequestParam(required = false) Integer status, @RequestParam(required = false) String type) {

        GenericResponse response = new GenericResponse();
        try {

            List<DatasourceForSearchResponse> responseList = new ArrayList<>();
            if (StringUtils.isNotEmpty(type) && type.toUpperCase().equals(DatasourceSearchTypeEnum.OWNER_BY_ME.getName().toUpperCase())) {
                DatasourceJoinGroupJoinOwnerSearch datasourceJoinGroupJoinOwnerSearch = DatasourceJoinGroupJoinOwnerSearch.builder()
                        .owner(super.getUserInfoDTO().getAccount())
                        .kw(kw)
                        .status(status)
                        .build();
                List<DatasourceJoinGroupJoinOwner> datasourceJoinGroupJoinOwnerList = datasourceJoinGroupJoinOwnerMapper.searchList(datasourceJoinGroupJoinOwnerSearch);

                for (DatasourceJoinGroupJoinOwner d : datasourceJoinGroupJoinOwnerList) {
                    DatasourceForSearchResponse build = DatasourceForSearchResponse.builder()
                            .db(d.getDb())
                            .description(d.getDescription())
                            .group_id(d.getGroup_id())
                            .group_name(d.getGroup_name())
                            .id(d.getId())
                            .status(d.getStatus())
                            .name(d.getName())
                            .type(d.getType())
                            .build();
                    responseList.add(build);
                }


            } else {
                DatasourceJoinGroupSearch datasourceJoinGroupSearch = DatasourceJoinGroupSearch.builder()
                        .kw(kw)
                        .status(status)
                        .build();
                if (StringUtils.isNotEmpty(type) && type.toUpperCase().equals(DatasourceSearchTypeEnum.CREATED_BY_ME)) {
                    datasourceJoinGroupSearch.setCreator(super.getUserInfoDTO().getAccount());

                }

                List<DatasourceJoinGroup> datasourceJoinGroupList = datasourceJoinGroupMapper.searchList(datasourceJoinGroupSearch);

                responseList = datasourceJoinGroupList.stream().map(d -> DatasourceForSearchResponse.builder()
                        .db(d.getDb())
                        .description(d.getDescription())
                        .group_id(d.getGroup_id())
                        .group_name(d.getGroup_name())
                        .id(d.getId())
                        .status(d.getStatus())
                        .name(d.getName())
                        .type(d.getType())
                        .build()).collect(Collectors.toList());
            }

            response.setData(datasource_favorite_deal(responseList));
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("获取数据源接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    @RequestMapping(value = "/datasource", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.POST)
    public GenericResponse ajax_add_datasource(@RequestBody CfDatasource datasource) {

        GenericResponse response = new GenericResponse();
        try {
            CfDatasource new_datasource = CfDatasource.builder()
                    .type(datasource.getType())
                    .name(datasource.getName())
                    .description(datasource.getDescription())
                    .group_id(datasource.getGroup_id())
                    .create_time(new Date())
                    .update_time(new Date())
                    .creator_account(super.getUserInfoDTO().getAccount())
                    .creator_name(super.getUserInfoDTO().getName())
                    .build();
            datasourceMapper.insertSelective(new_datasource);
            response.setData(new_datasource.getId());
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("添加数据源接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
            response.setMessage("添加数据源接口异常！");

        }
        return response;
    }

    @RequestMapping(value = "/datasource/{id}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_get_datasource(@PathVariable Integer id) {

        GenericResponse response = new GenericResponse();
        try {

            DatasourceJoinGroup datasourceJoinGroup = datasourceJoinGroupMapper.selectByPrimaryKey(id);
            response.setData(datasourceJoinGroup);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("获取数据源详情源接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
            response.setMessage("获取数据源详情源接口异常！");

        }
        return response;
    }

    @RequestMapping(value = "/datasource/{id}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.PATCH)
    public GenericResponse ajax_update_datasource(@PathVariable Integer id, @RequestBody CfDatasource request) {

        GenericResponse response = new GenericResponse();
        try {
            datasourceMapper.updateByPrimaryKeySelective(CfDatasource.builder()
                    .id(id)
                    .group_id(request.getGroup_id())
                    .description(request.getDescription())
                    .db(request.getDb())
                    .name(request.getName())
                    .ip(request.getIp())
                    .password(PPAesUtils.encodeAES(request.getPassword()))
                    .port(request.getPort())
                    .status(request.getStatus())
                    .type(request.getType())
                    .username(request.getUsername())
                    .update_time(new Date())
                    .query_switch(request.getQuery_switch())
                    .build());
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("修改数据源源接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
            response.setMessage("修改数据源源接口异常！");

        }
        return response;
    }

    @RequestMapping(value = "/datasource/{id}/_active", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_active_datasource(@PathVariable Integer id) {

        GenericResponse response = new GenericResponse();
        try {

            CfDatasource datasource = datasourceMapper.selectByPrimaryKey(id);

            if (null != datasource) {
                if (datasource.getStatus().equals(DataSourceStatusEnum.NO_ACTIVE.getStatus())) {
                    Result result = DbUtils.getConnection(datasource.getIp(), datasource.getPort(), datasource.getUsername(), PPAesUtils.decodeAES(datasource.getPassword()), datasource.getType());

                    if (result.isSuccess()) {
                        response.setStatus(ResponseConstants.SUCCESS_CODE);
                        datasourceMapper.updateByPrimaryKeySelective(CfDatasource.builder()
                                .id(id)
                                .status(DataSourceStatusEnum.ACTIVE.getStatus())
                                .build());

                    } else {
                        response.setStatus(ResponseConstants.FAIL_CODE);
                        response.setMessage(result.getMessage());
                    }
                } else {
                    datasourceMapper.updateByPrimaryKeySelective(CfDatasource.builder()
                            .id(id)
                            .status(DataSourceStatusEnum.NO_ACTIVE.getStatus())
                            .build());
                    response.setStatus(ResponseConstants.SUCCESS_CODE);
                }

            }

        } catch (Exception e) {
            log.error("激活数据源源接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
            response.setMessage("激活数据源源接口异常！");

        }
        return response;
    }

    /**
     * 获取数据源下数据库信息
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/datasource/{id}/_db", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_get_datasource_db(@PathVariable Integer id) {

        GenericResponse response = new GenericResponse();
        try {
            CfDatasource datasource = datasourceMapper.selectByPrimaryKey(id);
            List<String> dbList = DbUtils.getDbNames(datasource.getIp(), datasource.getPort(), datasource.getUsername(), PPAesUtils.decodeAES(datasource.getPassword()), datasource.getType());
            List<DbResponse> dbResponseList = dbList.stream().map(d -> DbResponse.builder()
                    .name(d)
                    .build()).collect(Collectors.toList());

            if (CollectionUtils.isNotEmpty(dbResponseList)) {
                List<UsFavoriteDb> favoriteDbList = favoriteDbMapper.selectList(UsFavoriteDb.builder()
                        .datasource_id(id)
                        .account(super.getUserInfoDTO().getAccount())
                        .build());

                if (CollectionUtils.isNotEmpty(favoriteDbList)) {
                    dbResponseList = dbResponseList.stream().map(d -> {
                        if (CollectionUtils.isNotEmpty(favoriteDbList.stream().filter(f -> f.getDb().equals(d.getName())).collect(Collectors.toList()))) {
                            d.setFavorite(true);
                        }
                        return d;
                    }).collect(Collectors.toList());
                }
            }

            dbResponseList = dbResponseList.stream().sorted(Comparator.comparing(r -> null != r.getFavorite() && r.getFavorite() ? 1 : 0, Comparator.reverseOrder())).collect(Collectors.toList());

            response.setData(dbResponseList);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("获取数据库列表接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
            response.setMessage("获取数据库列表接口异常！");

        }
        return response;
    }


    @RequestMapping(value = "/datasource/{id}/{db}/_table", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_get_datasource_db_table(@PathVariable("id") Integer id, @PathVariable("db") String db) {

        GenericResponse response = new GenericResponse();
        try {
            CfDatasource datasource = datasourceMapper.selectByPrimaryKey(id);
            List<String> tableList = DbUtils.getTableNames(datasource.getIp(), datasource.getPort(), datasource.getUsername(), PPAesUtils.decodeAES(datasource.getPassword()), db, datasource.getType());

            List<TableResponse> tableResponseList = tableList.stream().map(d -> TableResponse.builder()
                    .name(d)
                    .build()).collect(Collectors.toList());

            if (CollectionUtils.isNotEmpty(tableResponseList)) {
                List<UsFavoriteTable> favoriteTableList = favoriteTableMapper.selectList(UsFavoriteTable.builder()
                        .datasource_id(id)
                        .account(super.getUserInfoDTO().getAccount())
                        .db(db)
                        .build());

                if (CollectionUtils.isNotEmpty(favoriteTableList)) {
                    tableResponseList = tableResponseList.stream().map(d -> {
                        if (CollectionUtils.isNotEmpty(favoriteTableList.stream().filter(f -> f.getTable_name().equals(d.getName())).collect(Collectors.toList()))) {
                            d.setFavorite(true);
                        }
                        return d;
                    }).collect(Collectors.toList());
                }
            }
            tableResponseList = tableResponseList.stream().sorted(Comparator.comparing(r -> null != r.getFavorite() && r.getFavorite() ? 1 : 0, Comparator.reverseOrder())).collect(Collectors.toList());

            response.setData(tableResponseList);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("获取数据库表接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
            response.setMessage("获取数据库表接口异常！");

        }
        return response;
    }


    @RequestMapping(value = "/datasource/{id}/{db}/{table}/_field", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_get_datasource_db_table_filed(@PathVariable("id") Integer id, @PathVariable("db") String db, @PathVariable("table") String table) {

        GenericResponse response = new GenericResponse();
        try {
            CfDatasource datasource = datasourceMapper.selectByPrimaryKey(id);
            if (StringUtils.isNotEmpty(table) && table.indexOf(".") != -1) {
                table = table.substring(table.lastIndexOf(".") + 1);
            }
            List<TableFieldEntity> fieldList = DbUtils.getColumnNames(datasource.getId(), datasource.getIp(), datasource.getPort(), datasource.getUsername(), PPAesUtils.decodeAES(datasource.getPassword()), db, table, datasource.getType());
            response.setData(fieldList);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("获取数据库表字段接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
            response.setMessage("获取数据库表字段接口异常！");

        }
        return response;
    }

    @RequestMapping(value = "/datasource/{id}/{db}/{table}/_info", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse ajax_get_datasource_db_table_info(@PathVariable("id") Integer id, @PathVariable("db") String db, @PathVariable("table") String table) {

        GenericResponse response = new GenericResponse();
        try {
            CfDatasource datasource = datasourceMapper.selectByPrimaryKey(id);
            if (StringUtils.isNotEmpty(table) && table.indexOf(".") != -1) {
                table = table.substring(table.lastIndexOf(".") + 1);
            }
            List<TableFieldEntity> fieldList = DbUtils.getColumnNames(datasource.getId(), datasource.getIp(), datasource.getPort(), datasource.getUsername(), PPAesUtils.decodeAES(datasource.getPassword()), db, table, datasource.getType());

            List<TableIndexEntity> indexEntityList = DbUtils.getTableIndex(datasource.getId(), datasource.getIp(), datasource.getPort(), datasource.getUsername(), PPAesUtils.decodeAES(datasource.getPassword()), db, table, datasource.getType());

            TableInfoEntity tableInfoEntity = DbUtils.getTableInfo(datasource.getId(), datasource.getIp(), datasource.getPort(), datasource.getUsername(), PPAesUtils.decodeAES(datasource.getPassword()), db, datasource.getType(), table);


            response.setData(TableColumnAndIndexEntity.builder()
                    .columns(fieldList)
                    .index(indexEntityList)
                    .info(tableInfoEntity)
                    .build());
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("获取数据库表详情接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
            response.setMessage("获取数据库表详情接口异常！");

        }
        return response;
    }

    private List<DatasourceForSearchResponse> datasource_favorite_deal(List<DatasourceForSearchResponse> responseList) {

        //处理数据源收藏排序

        List<UsFavoriteDatasource> favoriteDatasourceList = favoriteDatasourceMapper.selectList(UsFavoriteDatasource.builder()
                .account(super.getUserInfoDTO().getAccount())
                .build());

        if (CollectionUtils.isNotEmpty(favoriteDatasourceList)) {
            responseList.stream().map(d -> {
                if (CollectionUtils.isNotEmpty(favoriteDatasourceList.stream().filter(f -> f.getDatasource_id().equals(d.getId())).collect(Collectors.toList()))) {
                    d.setDatasource_favorite(true);
                    return d;
                } else {
                    d.setDatasource_favorite(false);
                    return d;
                }
            }).collect(Collectors.toList());
        }

        responseList = responseList.stream().sorted(Comparator.comparing(r -> null != r.getDatasource_favorite() && r.getDatasource_favorite() ? 1 : 0, Comparator.reverseOrder())).collect(Collectors.toList());

        //处理所属团队
        List<CfBusGroupOwners> groupOwnersList = busGroupOwnersMapper.selectList(CfBusGroupOwners.builder()
                .account(super.getUserInfoDTO().getAccount())
                .build());

        if (CollectionUtils.isNotEmpty(groupOwnersList)) {
            responseList.stream().map(d -> {
                if (CollectionUtils.isNotEmpty(groupOwnersList.stream().filter(f -> f.getBus_group_id().equals(d.getGroup_id())).collect(Collectors.toList()))) {
                    d.setIs_my_group(true);
                    return d;
                } else {
                    if (d.getIs_my_group() == null)
                        d.setGroup_favorite(false);
                    return d;
                }
            }).collect(Collectors.toList());
        }


        List<CfBusGroupUsers> groupUsersList = busGroupUsersMapper.selectList(CfBusGroupUsers.builder()
                .account(super.getUserInfoDTO().getAccount())
                .build());
        if (CollectionUtils.isNotEmpty(groupUsersList)) {
            responseList.stream().map(d -> {
                if (CollectionUtils.isNotEmpty(groupUsersList.stream().filter(f -> d.getGroup_id().equals(f.getBus_group_id())).collect(Collectors.toList()))) {
                    d.setIs_my_group(true);
                    return d;
                } else {
                    if (d.getIs_my_group() == null)
                        d.setGroup_favorite(false);
                    return d;
                }
            }).collect(Collectors.toList());
        }

        responseList = responseList.stream().sorted(Comparator.comparing(r -> null != r.getIs_my_group() && r.getIs_my_group() ? 1 : 0, Comparator.reverseOrder())).collect(Collectors.toList());


        //处理团队收藏排序

        List<UsFavoriteGroup> favoriteGroupList = favoriteGroupMapper.selectList(UsFavoriteGroup.builder()
                .account(super.getUserInfoDTO().getAccount())
                .build());

        if (CollectionUtils.isNotEmpty(favoriteGroupList)) {
            responseList.stream().map(d -> {
                if (CollectionUtils.isNotEmpty(favoriteGroupList.stream().filter(f -> f.getGroup_id().equals(d.getGroup_id())).collect(Collectors.toList()))) {
                    d.setGroup_favorite(true);
                    return d;
                } else {
                    d.setGroup_favorite(false);
                    return d;
                }
            }).collect(Collectors.toList());
        }

        responseList = responseList.stream().sorted(Comparator.comparing(r -> null != r.getGroup_favorite() && r.getGroup_favorite() ? 1 : 0, Comparator.reverseOrder())).collect(Collectors.toList());

        return responseList;
    }
}
