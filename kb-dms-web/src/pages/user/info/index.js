import {ajax_get_user_info, ajax_update_user_info} from "../../../api/user/user_info_api";
import {notify_err, notify_ok} from "../../../plugins/PpNotify";

export default {
  name: 'user_info_index',
  data: () => ({
    user_info: {},
    old_pwd: null,
    new_pwd: null,
    confirm_pwd: null,
    new_port: null,
    edit_name: false,
    edit_port: false,
    edit_pwd: false,
  }),
  methods: {
    render_name(h) {
      return h('div', {
        staticClass: 'text-left',
      }, [
        !this.edit_name ? h('div', {
          style: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'noWrap',
          },
        }, [this.user_info.name, h('q-btn', {
          props: {
            icon: 'edit',
            color: 'primary',
            flat: true,
          },
          on: {
            click: () => {
              this.edit_name = true
            }
          }
        })]) : h('div', {
          staticClass: 'row no-wrap items-center q-pt-sm q-pb-sm'
        }, [
          h('q-input', {
            staticClass: 'pp-search-input-sm',
            props: {
              placeholder: '请输入昵称',
              hideUnderline: true,
              value: this.user_info.name
            },
            style: {
              width: '60%',
            },
            on: {
              input: (v) => this.user_info.name = v
            }
          }),
          h('q-btn', {
            staticClass: 'pp-search-btn-sm',
            props: {
              label: '保存',
              flat: true,
              color: 'primary',
              disable: this.user_info.name == null || this.user_info.name.length <= 0 ? true : false
            },
            on: {
              click: () => this.update_user_info()
            }
          }),
          h('q-btn', {
            staticClass: 'pp-search-btn-sm',
            props: {
              label: '取消',
              flat: true,
              color: 'faded',
            },
            on: {
              click: () => this.edit_name = false
            }
          }),
        ]),
      ])
    },
    // render_port(h) {
    //   return h('div', {
    //     staticClass: 'text-left',
    //   }, [
    //     !this.edit_port ? h('div', {
    //       style: {
    //         overflow: 'hidden',
    //         textOverflow: 'ellipsis',
    //         whiteSpace: 'noWrap',
    //       },
    //     }, [this.user_info.port, h('q-btn', {
    //       props: {
    //         icon: 'edit',
    //         color: 'primary',
    //         flat: true,
    //       },
    //       on: {
    //         click: () => {
    //           this.edit_port = true
    //         }
    //       }
    //     })]) : h('div', {
    //       staticClass: 'row no-wrap items-center q-pt-sm q-pb-sm'
    //     }, [
    //       h('q-input', {
    //         staticClass: 'pp-search-input-sm',
    //         props: {
    //           placeholder: '请输入端口',
    //           hideUnderline: true,
    //           value: this.user_info.port,
    //           type: 'tel',
    //         },
    //         style: {
    //           width: '60%',
    //         },
    //         on: {
    //           input: (v) => this.new_port = v
    //         },
    //         attrs: {
    //           maxLength: 4
    //         }
    //       }),
    //       h('q-btn', {
    //         staticClass: 'pp-search-btn-sm',
    //         props: {
    //           label: '保存',
    //           flat: true,
    //           color: 'primary',
    //           disable: this.new_port == null || this.new_port.length != 4 ? true : false
    //         },
    //         on: {
    //           click: () => this.update_user_info()
    //         }
    //       }),
    //       h('q-btn', {
    //         staticClass: 'pp-search-btn-sm',
    //         props: {
    //           label: '取消',
    //           flat: true,
    //           color: 'faded',
    //         },
    //         on: {
    //           click: () => this.edit_port = false
    //         }
    //       }),
    //     ]),
    //   ])
    // },
    render_edit_pwd(h) {
      return h('div', {
        staticClass: 'text-left',
      }, [
        !this.edit_pwd ? h('div', {
          style: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'noWrap',
          },
        }, [h('q-btn', {
          props: {
            icon: 'edit',
            color: 'primary',
            flat: true,
          },
          on: {
            click: () => {
              this.edit_pwd = true
            }
          }
        })]) : h('div', {}, [
          h('div', {
            staticClass: 'row no-wrap items-center q-pt-sm q-pb-sm'
          }, [
            h('q-input', {
              staticClass: 'pp-search-input-sm',
              props: {
                placeholder: '请输入旧密码',
                hideUnderline: true,
                value: this.old_pwd,
                type: 'password'
              },
              style: {
                width: '60%',
              },
              on: {
                input: (v) => this.old_pwd = v
              }
            }),
          ]),
          h('div', {
            staticClass: 'row no-wrap items-center q-pt-sm q-pb-sm'
          }, [
            h('q-input', {
              staticClass: 'pp-search-input-sm',
              props: {
                placeholder: '请输入新密码',
                hideUnderline: true,
                value: this.new_pwd,
                type: 'password'
              },
              style: {
                width: '60%',
              },
              on: {
                input: (v) => this.new_pwd = v
              }
            }),
          ]),
          h('div', {
            staticClass: 'row no-wrap items-center q-pt-sm q-pb-sm'
          }, [
            h('q-input', {
              staticClass: 'pp-search-input-sm',
              props: {
                placeholder: '请确认新密码',
                hideUnderline: true,
                value: this.confirm_pwd,
                type: 'password'
              },
              style: {
                width: '60%',
              },
              on: {
                input: (v) => this.confirm_pwd = v
              }
            }),
            h('q-btn', {
              staticClass: 'pp-search-btn-sm',
              props: {
                label: '保存',
                flat: true,
                color: 'primary',
                disable: this.new_pwd == null || this.new_pwd.length <= 0 || this.old_pwd == null || this.old_pwd.length <= 0 || this.new_pwd !== this.confirm_pwd ? true : false
              },
              on: {
                click: () => this.update_user_info()
              }
            }),
            h('q-btn', {
              staticClass: 'pp-search-btn-sm',
              props: {
                label: '取消',
                flat: true,
                color: 'faded',
              },
              on: {
                click: () => this.edit_pwd = false
              }
            }),
          ]),
        ])
      ])
    },

    render_detail(h) {
      return h('div', {
        staticClass: 'row no-wrap',
      }, [
        h('div', {staticClass: 'col-12'}, [
          this.render_tr(h, '昵称', this.render_name(h), 'font-14 text-weight-bold', 'q-pa-xs text-tertiary font-14 text-weight-bold'),
          this.render_tr(h, '端口', this.user_info.id, 'font-14 text-weight-bold', 'q-pa-xs text-tertiary font-14 text-weight-bold'),
          this.render_tr(h, '账号', this.user_info.account),
          this.render_tr(h, '创建时间', this.user_info.create_time),
          this.render_tr(h, '更新时间', this.user_info.update_time),
          this.render_tr(h, '密码', this.render_edit_pwd(h)),
        ]),
      ])
    },
    render_tr(h, key, value, key_cls, value_cls = 'q-pa-xs text-tertiary') {
      return h('tr', {}, [
        h('td', {
          staticClass: 'q-pa-xs ' + key_cls,
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
          }
        }, key),
        h('td', {
          staticClass: value_cls + ' q-pl-md'
        }, [value || '--'])
      ])
    },
    update_user_info() {
      let model = {
        port: this.new_port,
        name: this.user_info.name,
        new_pwd: this.new_pwd,
        old_pwd: this.old_pwd
      }
      ajax_update_user_info(model).then(d => {
        if (d.status === 1) {
          this.edit_name = false
          this.edit_port = false
          this.edit_pwd = false
          this.refresh_user_info()
          notify_ok("更新成功！")
        } else {
          notify_err(d.message)
        }
      }).catch(e => {

      })
    },
    refresh_user_info() {
      let vm = this;
      ajax_get_user_info().then(d => {
        if (d.status === 1) {
          vm.user_info = d.data
        }
      }).catch(e => {
      })
    }
  },
  render(h) {
    return h('div', {
      staticClass: 'q-pa-md font-13',
      style: {
        minWidth: '280px'
      }
    }, [this.render_detail(h)])
  },
}
