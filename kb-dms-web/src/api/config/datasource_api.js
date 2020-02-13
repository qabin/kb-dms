import {
  axiosInstance
} from '../../plugins/axios'

export function ajax_datasource_search(kw, status, type) {
  let form = {
    kw: kw,
    status: status,
    type: type
  }
  return axiosInstance({
    url: '/api/datasource/_search',
    method: 'get',
    params: form,
  })

}

export function ajax_add_datasource(name, type, group_id, description) {
  let form = {
    name: name,
    type: type,
    group_id: group_id,
    description: description
  }
  return axiosInstance({
    url: '/api/datasource',
    method: 'post',
    data: form
  })

}

export function ajax_get_datasource(id) {
  return axiosInstance({
    url: '/api/datasource/' + id,
    method: 'get',
  })

}

export function ajax_update_datasource(id, model) {
  return axiosInstance({
    url: '/api/datasource/' + id,
    method: 'patch',
    data: model
  })

}

export function ajax_active_datasource(id) {
  return axiosInstance({
    url: '/api/datasource/' + id + '/_active',
    method: 'get',
  })

}

export function ajax_get_datasource_db(id) {
  return axiosInstance({
    url: '/api/datasource/' + id + '/_db',
    method: 'get',
  })

}

export function ajax_get_datasource_db_table(id, db) {
  return axiosInstance({
    url: '/api/datasource/' + id + '/' + db + '/_table',
    method: 'get',
  })

}

export function ajax_get_datasource_db_table_field(id, db, table) {
  return axiosInstance({
    url: '/api/datasource/' + id + '/' + db + '/' + table + '/_field',
    method: 'get',
  })

}

export function ajax_get_datasource_db_table_info(id, db, table) {
  return axiosInstance({
    url: '/api/datasource/' + id + '/' + db + '/' + table + '/_info',
    method: 'get',
  })

}
