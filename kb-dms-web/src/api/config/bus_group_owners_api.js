import {
  axiosInstance
} from '../../plugins/axios'

export function ajax_bus_group_owners_search(link_id) {
  return axiosInstance({
    url: '/api/bus/group/'+link_id+'/owners',
    method: 'get',
  })
}
export function ajax_update_bus_group_owners(link_id, data) {
  return axiosInstance({
    url: '/api/bus/group/' + link_id+'/owners',
    method: 'patch',
    data: data
  })
}
