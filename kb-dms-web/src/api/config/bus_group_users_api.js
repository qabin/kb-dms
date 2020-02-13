import {
  axiosInstance
} from '../../plugins/axios'

export function ajax_bus_group_users_search(id) {
  let searchForm = {
    "id": id
  }
  return axiosInstance({
    url: '/api/bus/group/users/_search',
    method: 'get',
    params: searchForm
  })
}

export function ajax_add_bus_group_users(bus_group_id,name,account) {
  let model={
    name:name,
    bus_group_id:bus_group_id,
    account:account
  }
  return axiosInstance({
    url: '/api/bus/group/users',
    method: 'post',
    data: model,
  })

}

export function ajax_delete_bus_group_users(bus_group_id,account) {
  let model={
    bus_group_id:bus_group_id,
    account:account
  }
  return axiosInstance({
    url: '/api/bus/group/users/_delete',
    method: 'delete',
    params:model
  })

}
