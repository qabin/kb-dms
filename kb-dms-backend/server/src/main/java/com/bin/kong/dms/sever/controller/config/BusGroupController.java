package com.bin.kong.dms.sever.controller.config;

import com.bin.kong.dms.contract.common.GenericResponse;
import com.bin.kong.dms.core.constants.ResponseConstants;
import com.bin.kong.dms.core.enums.GroupSearchTypeEnum;
import com.bin.kong.dms.dao.mapper.config.CfBusGroupMapper;
import com.bin.kong.dms.dao.mapper.config.CfBusGroupUsersMapper;
import com.bin.kong.dms.dao.mapper.join.BusGroupJoinOwnerMapper;
import com.bin.kong.dms.model.config.entity.CfBusGroup;
import com.bin.kong.dms.model.config.entity.CfBusGroupUsers;
import com.bin.kong.dms.model.config.search.BusGroupSearch;
import com.bin.kong.dms.model.config.search.BusGroupUsersSearch;
import com.bin.kong.dms.model.join.entity.BusGroupJoinOwner;
import com.bin.kong.dms.model.join.search.BusGroupJoinOwnerSearch;
import com.bin.kong.dms.sever.controller.common.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@RestController
@Slf4j
public class BusGroupController extends BaseController {
    @Resource
    private CfBusGroupMapper busGroupMapper;
    @Resource
    private BusGroupJoinOwnerMapper groupJoinOwnerMapper;
    @Resource
    private CfBusGroupUsersMapper groupUsersMapper;

    @RequestMapping(value = "/bus/group/_search", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse search_list(@RequestParam(required = false) String kw, @RequestParam(required = false) Integer status, @RequestParam(required = false) String type) {

        GenericResponse response = new GenericResponse();
        try {

            response.setStatus(ResponseConstants.SUCCESS_CODE);

            if (StringUtils.isNotEmpty(type) && type.toUpperCase().equals(GroupSearchTypeEnum.OWNER_BY_ME.getName().toUpperCase())) {
                List<BusGroupJoinOwner> busGroupJoinOwnerList = groupJoinOwnerMapper.searchList(BusGroupJoinOwnerSearch.builder()
                        .owner(super.getUserInfoDTO().getAccount())
                        .kw(kw)
                        .status(status)
                        .build());
                response.setData(busGroupJoinOwnerList);
                return response;

            }
            BusGroupSearch groupSearch = BusGroupSearch.builder()
                    .kw(kw)
                    .status(status)
                    .build();
            if (StringUtils.isNotEmpty(type) && type.toUpperCase().equals(GroupSearchTypeEnum.CREATED_BY_ME.getName().toUpperCase())) {
                groupSearch.setCreator(super.getUserInfoDTO().getAccount());
            }

            List<CfBusGroup> busGroupList = busGroupMapper.searchList(groupSearch);
            response.setData(busGroupList);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("获取业务线列表接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    @RequestMapping(value = "/bus/group/{id}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse detail(@PathVariable("id") Integer id) {

        GenericResponse response = new GenericResponse();
        try {
            CfBusGroup cfBusGroup = busGroupMapper.selectByPrimaryKey(id);
            response.setData(cfBusGroup);
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("获取业务线详情接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    @RequestMapping(value = "/bus/group", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.POST)
    public GenericResponse trouble_create(@RequestBody CfBusGroup base) {

        GenericResponse response = new GenericResponse();
        try {

            List<CfBusGroup> groupList = busGroupMapper.selectList(CfBusGroup.builder()
                    .name(base.getName())
                    .build());
            if (!CollectionUtils.isEmpty(groupList)) {
                response.setMessage("该业务团队已存在！");
                response.setStatus(ResponseConstants.FAIL_CODE);
            } else {
                Integer count = busGroupMapper.insertSelective(CfBusGroup.builder()
                        .name(base.getName())
                        .create_time(new Date())
                        .creator_name(super.getUserInfoDTO().getName())
                        .creator_account(super.getUserInfoDTO().getAccount())
                        .name(base.getName())
                        .build());
                response.setData(count);
                response.setStatus(ResponseConstants.SUCCESS_CODE);
            }
        } catch (Exception e) {
            log.error("添加业务团队接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }


    @RequestMapping(value = "/bus/group/{id}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.PATCH)
    public GenericResponse trouble_update(@PathVariable("id") Integer id, @RequestBody CfBusGroup base) {

        GenericResponse response = new GenericResponse();
        try {

            Integer count = busGroupMapper.updateByPrimaryKeySelective(CfBusGroup.builder()
                    .id(id)
                    .name(base.getName())
                    .status(base.getStatus())
                    .build());
            response.setData(count);
            response.setStatus(ResponseConstants.SUCCESS_CODE);
        } catch (Exception e) {
            log.error("修改业务团队接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);

        }
        return response;
    }

    /**
     * 获取用户所属团队
     *
     * @return
     */
    @RequestMapping(value = "/bus/group/user/_group", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.GET)
    public GenericResponse get_user_group() {

        GenericResponse response = new GenericResponse();
        try {

            List<CfBusGroupUsers> groupUsersList = groupUsersMapper.searchList(BusGroupUsersSearch.builder()
                    .account(super.getUserInfoDTO().getAccount())
                    .build());

            if (!CollectionUtils.isEmpty(groupUsersList)) {
                response.setData(groupUsersList.get(0));
            }
            response.setStatus(ResponseConstants.SUCCESS_CODE);

        } catch (Exception e) {
            log.error("获取用户所属团队接口异常：" + e);
            response.setStatus(ResponseConstants.FAIL_CODE);
        }
        return response;
    }

}
