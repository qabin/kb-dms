import {axiosInstance} from '../../plugins/axios'

export function ajax_sql_exe_async(datasource_id, db, sql) {
  return axiosInstance({
    url: '/api/datasource/' + datasource_id + '/' + db + '/async/_exe',
    method: 'post',
    data: {sql: sql}
  })
}

export function ajax_sql_exe(datasource_id, db, sql) {
  return axiosInstance({
    url: '/api/datasource/' + datasource_id + '/' + db + '/_exe',
    method: 'post',
    data: {sql: sql}
  })
}


export function ajax_drop_table(datasource_id, db, table) {
  return axiosInstance({
    url: '/api/datasource/' + datasource_id + '/' + db + '/' + table + '/_drop',
    method: 'get',
  })
}

export function ajax_truncate_table(datasource_id, db, table) {
  return axiosInstance({
    url: '/api/datasource/' + datasource_id + '/' + db + '/' + table + '/_truncate',
    method: 'get',
  })
}

// export function ajax_table_row_delete(datasource_id, db, table, sql) {
//   return axiosInstance({
//     url: '/api/datasource/' + datasource_id + '/' + db + '/' + table + '/row/_delete',
//     method: 'post',
//     data: {sql: sql}
//   })
// }

export function ajax_get_datasource_table_content(datasource_id, db, table, page, order_by_field) {
  return axiosInstance({
    url: '/api/datasource/' + datasource_id + '/' + db + '/' + table + '/_content',
    method: 'get',
    params: {
      page: page,
      order_by_field: order_by_field
    }
  })
}

