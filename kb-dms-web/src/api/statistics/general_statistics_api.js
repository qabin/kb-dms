import {axiosInstance} from '../../plugins/axios'

export function ajax_get_general_all_biz_total() {
  return axiosInstance({
    url: '/api/statistics/general/all/biz',
    method: 'get',
  })
}

export function ajax_get_general_month_timeline() {
  return axiosInstance({
    url: '/api/statistics/general/month/timeline',
    method: 'get',
  })
}
