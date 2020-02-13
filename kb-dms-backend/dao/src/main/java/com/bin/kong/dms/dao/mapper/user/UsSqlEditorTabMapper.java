package com.bin.kong.dms.dao.mapper.user;

import com.bin.kong.dms.model.user.entity.UsSqlEditorTab;
import com.bin.kong.dms.model.user.search.SqlEditorTabSearch;

import java.util.List;

public interface UsSqlEditorTabMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(UsSqlEditorTab record);

    UsSqlEditorTab selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(UsSqlEditorTab record);

    List<UsSqlEditorTab> searchList(SqlEditorTabSearch search);

}
