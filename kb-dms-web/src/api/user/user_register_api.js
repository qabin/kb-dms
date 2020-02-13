import {axiosInstance} from '../../plugins/axios'

export function ajax_add_user_info(form) {
  return axiosInstance({
    url: '/api/user/register',
    method: 'post',
    data: form
  })
}
