import {axiosInstance} from '../../plugins/axios'

export function ajax_login_in(form) {

  return axiosInstance({
    url: '/api/user/login',
    method: 'post',
    data: form
  })
}

export function ajax_login_out() {
  return axiosInstance({
    url: '/api/user/logout',
    method: 'get',
  })
}
