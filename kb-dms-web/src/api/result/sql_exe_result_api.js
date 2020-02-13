import {axiosInstance} from '../../plugins/axios'

export function ajax_get_sql_exe_result(exe_record_id) {
  return axiosInstance({
    url: '/api/sql/exe/record/' + exe_record_id + '/_result',
    method: 'get',
  })
}

export function ajax_search_sql_exe_result(kw, page, size, query_by, query_type) {
  return axiosInstance({
    url: '/api/sql/exe/result/_search',
    method: 'get',
    params: {
      kw: kw,
      page: page,
      size: size,
      query_by: query_by,
      query_type: query_type
    }
  })
}
