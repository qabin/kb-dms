package com.bin.kong.dms.dao.mapper.join;


import com.bin.kong.dms.model.join.entity.BusGroupJoinOwner;
import com.bin.kong.dms.model.join.search.BusGroupJoinOwnerSearch;

import java.util.List;

public interface BusGroupJoinOwnerMapper {

    List<BusGroupJoinOwner> searchList(BusGroupJoinOwnerSearch search);

}
