import {ajax_login_in, ajax_login_out} from "../../api/user/user_login_api";
import {ajax_get_user_info} from '../../api/user/user_info_api'
import {notify_err, notify_ok} from '../../plugins/PpNotify'
import router from '../../router/index'
import localStorage from '../../utils/local_storage_utils'

const getHello = (name) => {
  let hour = new Date().getHours();
  if (hour < 9)
    return '劳模你好早！';
  else if (hour < 11)
    return '早上好！' + name;
  else if (hour < 12)
    return '你好 ' + name;
  else if (hour < 19)
    return '下午好！' + name;
  else if (hour < 22)
    return '晚上好！';
  else
    return '劳模注意身体啊！'
};

export const getUserInfo = ({state}) => {
  return new Promise((resolve, reject) => {
    state.is_login
      ? resolve()
      : ajax_get_user_info()
        .then(d => {
          if (d.status === 1) {
            state.account = d.data.account;
            state.name = d.data.name;
            state.is_login = true
            state.is_admin = d.data.is_admin
            resolve()
          } else {
            localStorage.set('isLogin', false);
            router.push({path: '/login'})
          }
        })
        .catch((e) => {
          localStorage.set('isLogin', false);
          router.push({path: '/login'})
        })
  })
};

export const refreshUserInfo = ({state}) => {
  return new Promise((resolve, reject) => {
    ajax_get_user_info()
      .then(d => {
        if (d.status === 1) {
          state.account = d.data.account;
          state.name = d.data.name;
          state.is_login = true
          state.is_admin = d.data.is_admin
          resolve()
        } else {
          localStorage.set('isLogin', false);
        }
      })
      .catch((e) => {
        localStorage.set('isLogin', false);
        router.push({path: '/login'})
      })
  })
};


export const clearLoginState = ({state}) => {
  return new Promise((r, j) => {
    state.is_login = false;
    r();
    router.push({name: "Login"})
  });
};

export const login = (context, form) => {
  return new Promise((r, j) => {
    ajax_login_in(form)
      .then((d) => {
        if (d.status === 1) {
          localStorage.set('isLogin', true);
          getUserInfo(context)
            .then(() => {
              r();
              notify_ok(getHello(context.state.name));
              router.push({path: "/"});
            })
            .catch(j)
        } else {
          localStorage.set('isLogin', false);
          notify_err(d.message)
        }

      })
      .catch(j);
  });
};

export const logout = (context) => {
  return new Promise((r, j) => {
    ajax_login_out()
      .then(() => {
        notify_ok('已登出系统');
        localStorage.set('isLogin', false);
        clearLoginState(context).then(r).catch(j)
        router.push({path: '/login'})
      })
      .catch(j)

  })
};
