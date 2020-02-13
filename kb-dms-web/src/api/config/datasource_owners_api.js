import {
  axiosInstance
} from '../../plugins/axios'

export function ajax_datasource_owners_search(datasource_id) {
  return axiosInstance({
    url: '/api/datasource/'+datasource_id+'/owners',
    method: 'get',
  })
}
export function ajax_update_datasource_owners(datasource_id, data) {
  return axiosInstance({
    url: '/api/datasource/' + datasource_id+'/owners',
    method: 'patch',
    data: data
  })
}
