import {axiosInstance} from '../../plugins/axios'

export function ajax_get_table_create_sql(datasource_id, db, table) {
  return axiosInstance({
    url: '/api/sql/datasource/' + datasource_id + '/' + db + '/' + table + '/_create',
    method: 'get',
  })
}
