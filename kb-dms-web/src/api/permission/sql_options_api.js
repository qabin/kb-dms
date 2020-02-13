import {axiosInstance} from '../../plugins/axios'

export function ajax_get_sql_options() {
  return axiosInstance({
    url: '/api/permission/sql/options',
    method: 'get',
  })
}

export function ajax_get_datasource_update_permission(id) {
  return axiosInstance({
    url: '/api/permission/datasource/'+id+'/_update',
    method: 'get',
  })
}

export function ajax_get_datasource_sql_options_permission(id) {
  return axiosInstance({
    url: '/api/permission/datasource/'+id+'/sql/_options',
    method: 'get',
  })
}


export function ajax_get_group_update_permission(id) {
  return axiosInstance({
    url: '/api/permission/group/'+id+'/_update',
    method: 'get',
  })
}
