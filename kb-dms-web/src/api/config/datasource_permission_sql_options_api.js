import {
  axiosInstance
} from '../../plugins/axios'

export function ajax_add_datasource_permission_sql_options(id, model) {
  return axiosInstance({
    url: '/api/datasource/' + id + '/permission/sql/options',
    method: 'post',
    data: model
  })

}

export function ajax_delete_datasource_permission_sql_options(id, model) {
  return axiosInstance({
    url: '/api/datasource/' + id + '/permission/sql/options',
    method: 'delete',
    params: model
  })

}
