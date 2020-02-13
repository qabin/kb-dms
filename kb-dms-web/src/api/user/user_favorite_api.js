import {axiosInstance} from '../../plugins/axios'

export function ajax_add_group_favorite(id) {
  return axiosInstance({
    url: '/api/group/' + id + '/_favorite',
    method: 'get',
  })
}

export function ajax_delete_group_favorite(id) {
  return axiosInstance({
    url: '/api/group/' + id + '/_favorite',
    method: 'delete',
  })
}

export function ajax_add_datasource_favorite(id) {
  return axiosInstance({
    url: '/api/datasource/' + id + '/_favorite',
    method: 'get',
  })
}

export function ajax_delete_datasource_favorite(id) {
  return axiosInstance({
    url: '/api/datasource/' + id + '/_favorite',
    method: 'delete',
  })
}

export function ajax_add_db_favorite(id, db) {
  return axiosInstance({
    url: '/api/datasource/' + id + '/' + db + '/_favorite',
    method: 'get',
  })
}

export function ajax_delete_db_favorite(id, db) {
  return axiosInstance({
    url: '/api/datasource/' + id + '/' + db + '/_favorite',
    method: 'delete',
  })
}

export function ajax_add_table_favorite(id, db, table) {
  return axiosInstance({
    url: '/api/datasource/' + id + '/' + db + '/' + table + '/_favorite',
    method: 'get',
  })
}

export function ajax_delete_table_favorite(id, db, table) {
  return axiosInstance({
    url: '/api/datasource/' + id + '/' + db + '/' + table + '/_favorite',
    method: 'delete',
  })
}

