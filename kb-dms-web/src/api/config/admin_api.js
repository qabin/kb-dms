import {
  axiosInstance
} from '../../plugins/axios'

export function ajax_admin_search(kw) {
  let form ={
    'kw':kw
  }
  return axiosInstance({
    url: '/api/admin/_search',
    method: 'get',
    params: form,
  })

}

export function ajax_delete_admin(account) {
  let form={
    account:account
  }
  return axiosInstance({
    url: '/api/admin/_delete',
    method: 'delete',
    params:form
  })

}

export function ajax_add_admin(name,account) {
  let form={
    account:account,
    name:name
  }
  return axiosInstance({
    url: '/api/admin',
    method: 'post',
    data:form
  })

}
