package com.bin.kong.dms.dao.mapper.user;

import com.bin.kong.dms.contract.common.BaseSearch;
import com.bin.kong.dms.model.user.entity.UserInfo;

import java.util.List;

public interface UserInfoMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(UserInfo record);

    UserInfo selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(UserInfo record);

    UserInfo selectByLoginName(String loginName);

    List<UserInfo> searchList(BaseSearch search);

}
