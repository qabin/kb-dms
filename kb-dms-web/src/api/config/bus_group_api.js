import {
  axiosInstance
} from '../../plugins/axios'

export function ajax_bus_group_search(kw, status, type) {
  let searchForm = {
    kw: kw,
    status: status,
    type: type
  }
  return axiosInstance({
    url: '/api/bus/group/_search',
    method: 'get',
    params: searchForm
  })
}

export function ajax_add_bus_group(name) {
  let model = {
    name: name
  }
  return axiosInstance({
    url: '/api/bus/group',
    method: 'post',
    data: model,
  })

}

export function ajax_update_bus_group(id, name, status) {
  let form = {
    name: name,
    status: status
  }
  return axiosInstance({
    url: '/api/bus/group/' + id,
    method: 'patch',
    data: form,
  })

}


export function ajax_get_bus_group(id) {
  return axiosInstance({
    url: '/api/bus/group/' + id,
    method: 'get',
  })

}

export function ajax_get_user_group() {
  return axiosInstance({
    url: '/api/bus/group/user/_group',
    method: 'get',
  })

}
