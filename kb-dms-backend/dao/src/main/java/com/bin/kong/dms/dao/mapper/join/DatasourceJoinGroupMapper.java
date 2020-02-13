package com.bin.kong.dms.dao.mapper.join;


import com.bin.kong.dms.model.join.entity.DatasourceJoinGroup;
import com.bin.kong.dms.model.join.search.DatasourceJoinGroupSearch;

import java.util.List;

public interface DatasourceJoinGroupMapper {

    DatasourceJoinGroup selectByPrimaryKey(Integer id);

    List<DatasourceJoinGroup> searchList(DatasourceJoinGroupSearch search);

}
