import {
  axiosInstance
} from '../../plugins/axios'

export function ajax_get_datasource_permission_member(id) {
  return axiosInstance({
    url: '/api/datasource/' + id + '/permission/member',
    method: 'get',
  })

}

export function ajax_add_datasource_permission_member(id, model) {
  return axiosInstance({
    url: '/api/datasource/' + id + '/permission/member',
    method: 'post',
    data: model
  })

}

export function ajax_delete_datasource_permission_member(id, account) {
  return axiosInstance({
    url: '/api/datasource/' + id + '/permission/member',
    method: 'delete',
    params: {account: account}
  })

}
