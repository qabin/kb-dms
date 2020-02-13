package com.bin.kong.dms.dao.mapper.join;


import com.bin.kong.dms.model.join.entity.SqlEditorTabJoinDatasource;
import com.bin.kong.dms.model.join.search.SqlEditorTabJoinDatasourceSearch;

import java.util.List;

public interface SqlEditorTabJoinDatasourceMapper {

    List<SqlEditorTabJoinDatasource> searchList(SqlEditorTabJoinDatasourceSearch search);

}
