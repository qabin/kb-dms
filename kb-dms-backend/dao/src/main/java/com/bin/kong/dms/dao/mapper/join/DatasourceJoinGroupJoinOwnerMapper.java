package com.bin.kong.dms.dao.mapper.join;


import com.bin.kong.dms.model.join.entity.DatasourceJoinGroupJoinOwner;
import com.bin.kong.dms.model.join.search.DatasourceJoinGroupJoinOwnerSearch;

import java.util.List;

public interface DatasourceJoinGroupJoinOwnerMapper {

    DatasourceJoinGroupJoinOwner selectByPrimaryKey(Integer id);

    List<DatasourceJoinGroupJoinOwner> searchList(DatasourceJoinGroupJoinOwnerSearch search);

}
