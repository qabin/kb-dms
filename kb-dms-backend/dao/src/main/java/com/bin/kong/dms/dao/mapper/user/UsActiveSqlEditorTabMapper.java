package com.bin.kong.dms.dao.mapper.user;

import com.bin.kong.dms.model.user.entity.UsActiveSqlEditorTab;

import java.util.List;

public interface UsActiveSqlEditorTabMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(UsActiveSqlEditorTab record);

    UsActiveSqlEditorTab selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(UsActiveSqlEditorTab record);

    List<UsActiveSqlEditorTab> selectList(UsActiveSqlEditorTab base);

}
