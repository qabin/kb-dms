import store from '../../../store'

export default {
  name: 'login_index',
  data: () => ({
    model: {
      account: null,
      login_pwd: null,
    },
    remember_me: true,
  }),
  methods: {
    remember_user() {
      this.$q.localStorage.set('login_form', this.model)
    },
  },
  render(h) {
    return h('div', {
      staticClass: 'pp-login-bg',
      style: {
        marginTop: '-60px',
      },
      on:{
        keyup:
          e => e.key === 'Enter' && store.dispatch('user/login', this.model),
      }
    }, [
      h('div', {
        staticClass: 'pp-login-wrap animated flipInY shadow-3 pp-radius-3',

      }, [
        h('div', {
            staticClass: 'cursor-pointer',
            style: {
              position: 'absolute',
              top: '0px',
              right: '0px',
              width: '60px',
              height: '60px',
              border: 'solid',
              borderWidth: '0px 60px 60px 0px',
              borderColor: 'transparent #027be3 transparent transparent',
            },
            on: {
              click: () => this.$router.push({path: '/register'})
            }
          },
          [h('q-icon', {
            style: {
              marginTop: '8px',
              marginLeft: '26px'
            },
            props: {
              name: 'person_add',
              size: '30px',
              color: 'white'
            }
          }, [h('q-tooltip', {
            staticClass: 'font-md q-pa-sm',
            props: {
              self: 'bottom left',
              anchor: 'top right',
              offset: [0, 0],
            },
          }, ['注册'])])]
        ),
        h('div', {
          staticClass: 'text-tertiary text-center',
          style: {
            fontSize: '24px',
            fontWeight: '700',
            margin: '20px 0 80px'
          }
        }, ['DMS · 数据库管理平台']),
        h('q-input', {
          staticClass: 'bg-white pp-radius-3 font-13 q-pl-xs q-pr-sm pp shadow-1 q-mb-md login-input',
          style: {
            height: '33px',
            fontWeight: '400',
            border: '1px solid white',

          },
          props: {
            color: 'dark',
            type: 'text',
            hideUnderline: true,
            value: this.model.account,
            placeholder: '请输入账号',
            before: [{
              icon: 'person'
            }]
          },
          on: {
            input: (v) => this.model.account = v
          }
        }),
        h('q-input', {
          staticClass: 'bg-white pp-radius-3 font-13 q-pl-xs q-pr-sm pp shadow-1 login-input',
          style: {
            height: '33px',
            fontWeight: '400',
          },
          props: {
            color: 'dark',
            type: 'password',
            hideUnderline: true,
            value: this.model.login_pwd,
            placeholder: '请输入密码',
            clearable: true,
            before: [{
              icon: 'lock',
            }]
          },
          on: {
            input: (v) => this.model.login_pwd = v
          }
        }),
        h('div', {
          staticClass: 'flex items-center font-12 text-dark',
          style: {
            marginTop: '20px'
          }
        }, [
          h('q-checkbox', {
            class: 'no-ripple',
            props: {
              color: 'tertiary',
              value: this.remember_me,
            },
            on: {
              input: (v) => this.remember_me = v
            }
          }, [
            h('span', {
              staticClass: 'q-ml-sm'
            }, '记住我')
          ]),
        ]),
        h('q-btn', {
          staticClass: 'login-btn font-13 full-width shadow-1 pp-radius-2',
          style: {
            marginTop: '10px',
            height: '33px',
            minHeight: '33px',
            fontWeight: '400'
          },
          props: {
            color: 'primary',
            disable: this.model.account != null && this.model.account.length > 0 && this.model.login_pwd != null && this.model.login_pwd.length > 0 ? false : true,
          },
          on: {
            click: () => {
              if (this.remember_me) {
                this.remember_user()
              }
              store.dispatch('user/login', this.model)
            },

          }

        }, '登 录'),
      ])
    ])
  }
}
