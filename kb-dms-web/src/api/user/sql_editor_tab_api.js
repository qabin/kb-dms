import {axiosInstance} from '../../plugins/axios'

export function ajax_add_sql_editor_tab(model) {
  return axiosInstance({
    url: '/api/sql/editor/tab',
    method: 'post',
    data: model
  })
}

export function ajax_search_open_sql_editor_tab(kw) {
  return axiosInstance({
    url: '/api/sql/editor/tab/_search',
    method: 'get',
    params: {
      status: 1,
    }
  })
}

export function ajax_search_all_sql_editor_tab(kw) {
  return axiosInstance({
    url: '/api/sql/editor/tab/_search',
    method: 'get',
  })
}

export function ajax_update_sql_editor_tab(id, model) {
  return axiosInstance({
    url: '/api/sql/editor/tab/' + id,
    method: 'patch',
    data: model
  })
}

export function ajax_delete_sql_editor_tab(id) {
  return axiosInstance({
    url: '/api/sql/editor/tab/' + id,
    method: 'delete',
  })
}

export function ajax_share_sql_editor_tab(id, data) {
  return axiosInstance({
    url: '/api/sql/editor/tab/' + id + '/_share',
    method: 'post',
    data: data
  })
}

export function ajax_close_sql_editor_tab(id) {
  return axiosInstance({
    url: '/api/sql/editor/tab/' + id + '/_close',
    method: 'get',
  })
}

export function ajax_open_sql_editor_tab(id) {
  return axiosInstance({
    url: '/api/sql/editor/tab/' + id + '/_open',
    method: 'get',
  })
}


export function ajax_sql_editor_tab_active(id) {
  return axiosInstance({
    url: '/api/sql/editor/tab/' + id + '/_active',
    method: 'get',
  })
}

export function ajax_search_active_sql_editor_tab() {
  return axiosInstance({
    url: '/api/active/sql/editor/tab/_search',
    method: 'get',
  })
}
