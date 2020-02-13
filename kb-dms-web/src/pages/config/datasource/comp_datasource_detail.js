import PpSection from '../../../components/elements/pp_section'
import {formatDate} from "quasar-framework/src/utils/date";
import {replaceURLWithHTMLLinks} from "../../../utils/regExp";
import Editor from '../../../components/editor/Editor'
import PersonSelector from "../../../components/selector/ComponentMultiPersonSelector";
import GroupSelector from "../../../components/selector/BusGroupSelector";
import {ajax_get_datasource, ajax_update_datasource, ajax_active_datasource} from "../../../api/config/datasource_api";
import {ajax_update_datasource_owners, ajax_datasource_owners_search} from "../../../api/config/datasource_owners_api";
import {datasource_type_enum} from "../../../utils/config_dictionary";
import DatasourceTypeSelector from '../../../components/selector/DatasourceTypeSelector'
import {ajax_get_datasource_update_permission} from "../../../api/permission/sql_options_api";

export default {
  name: 'comp_datasource_detail',
  data: () => ({
    datasource: {},
    owners: [],
    connection_error: null,
    update_permission: false
  }),
  props: {
    datasource_id: {
      required: true,
      type: [Number, String]
    }
  },
  watch: {
    datasource_id: {
      immediate: true,
      handler: function (nv, ov) {
        nv && this.query_datasource(nv)
      }
    }

  },
  computed: {
    disable() {
      return !(this.datasource)
    },
    group() {
      if (this.datasource && this.datasource.group_id) {
        return {value: this.datasource.group_id, label: this.datasource.group_name}
      }
      return null
    },
    datasource_type() {
      if (this.datasource && this.datasource.type) {
        return {value: this.datasource.type, label: datasource_type_enum[this.datasource.type].label}
      }
      return null
    }
  },
  methods: {
    render_base_info(h) {
      return h(PpSection, {
        staticClass: 'q-mb-md',
      }, [
        h('div', {slot: 'label', staticClass: 'q-mr-xs text-weight-bold'}, ['基础信息']),
        h('div', {staticClass: 'row no-wrap'}, [
          h('div', {staticClass: 'col-12'}, [
            this.render_tr(h, '名称：',
              h('q-input', {
                style: {
                  minWidth: '200px',
                  maxWidth: '200px'
                },
                props: {
                  placeholder: '请输入数据源名称',
                  value: this.datasource.name,
                  hideUnderline: true,
                  disable:!this.update_permission,
                  after: [
                    {
                      icon: 'keyboard_return', handler: () => {
                        ajax_update_datasource(this.datasource.id, {name: this.datasource.name}).then(d => {
                          if (d.status === 1) {
                            this.$emit('update')
                            this.$q.ok('修改成功!');
                          } else {
                            this.$q.err(d.message);
                          }
                        })
                      }
                    }
                  ],
                },
                on: {
                  input: (v) => this.datasource.name = v
                }
              })
            ),
            this.render_tr(h, '类型：', h(DatasourceTypeSelector, {
              props: {
                value: this.datasource_type,
                placeholder: '请选择类型',
                disable:!this.update_permission,
              },
              on: {
                input: (v) => {
                  this.datasource.type = v.value
                  ajax_update_datasource(this.datasource.id, {type: this.datasource.type})
                }
              }
            })),
            this.render_tr(h, '所属团队：', h(GroupSelector, {
              props: {
                value: this.group,
                placeholder: '请选择所属团队',
                disable:!this.update_permission,
              },
              on: {
                input: (v) => {
                  this.datasource.group_id = v.value
                  this.datasource.group_name = v.label
                  ajax_update_datasource(this.datasource.id, {group_id: this.datasource.group_id})
                }
              }
            })),
            this.render_tr(h, '负责人：', h(PersonSelector, {
              props: {
                value: this.owners,
                placeholder: '请选择负责人',
                disable:!this.update_permission,
              },
              on: {
                input: (v) => {
                  this.owners = v
                  ajax_update_datasource_owners(this.datasource.id, this.owners).then().catch()
                }
              }
            })),
            this.render_tr(h, '创建人：', this.datasource.creator_name),
            this.render_tr(h, '创建时间：', formatDate(this.datasource.create_time, 'YYYY-MM-DD HH:mm:ss')),
          ]),
        ])
      ])
    },
    render_tr(h, key, value, value_cls = 'q-pa-xs text-tertiary text-left') {
      return h('tr', null, [
        h('td', {
          staticClass: 'q-pa-xs',
          style: {
            textAlign: 'left',
            whiteSpace: 'nowrap',
          }
        }, key),
        value
          ? h('td', {
            staticClass: value_cls,
          }, [value])
          : h('td', {
            staticClass: value_cls,
          }, '--')
      ])
    },
    render_description(h) {
      return h(PpSection, {
        staticClass: 'q-mb-md',
        props: {label: '描述', collapse: false}
      }, [
        h(Editor, {
          staticClass: 'no-border text-tertiary',
          style: {
            whiteSpace: 'pre-warp',
            overflow: 'auto',
            textAlign: 'left'
          },
          props: {
            contentStyle: {minHeight: 0, fontSize: '13px', backgroundColor: 'transparent', whiteSpace: 'pre-wrap'},
            desText: this.datasource.description ? replaceURLWithHTMLLinks(this.datasource.description) : '',
            readonly:!this.update_permission,

          },
          on: {
            save: () => {
              ajax_update_datasource(this.datasource.id, {description: this.datasource.description}).then(d => {
                if (d.status === 1) {
                  this.$q.ok("保存成功！")
                }
              })
            },
            input: (v) => {
              this.datasource.description = v
            }
          }
        })
      ])
    },
    render_connection_info(h) {
      return h(PpSection, {
        staticClass: 'q-mb-md',
      }, [
        h('div', {slot: 'label', staticClass: 'q-mr-xs text-weight-bold'}, ['连接配置']),
        h('div', {staticClass: 'row no-wrap'}, [
          h('div', {staticClass: 'col-12'}, [
            this.render_tr(h, '连接地址：',
              h('q-input', {
                style: {
                  minWidth: '200px',
                  maxWidth: '200px'
                },
                props: {
                  placeholder: '请输入服务器IP',
                  value: this.datasource.ip,
                  hideUnderline: true,
                  disable:!this.update_permission,
                  after: [
                    {
                      icon: 'keyboard_return', handler: () => {
                        ajax_update_datasource(this.datasource.id, {
                          ip: this.datasource.ip,
                          port: this.datasource.port,
                          username: this.datasource.username,
                          password: this.datasource.password,
                          db: this.datasource.db
                        }).then(d => {
                          if (d.status === 1) {
                            this.$q.ok('修改成功!');
                          } else {
                            this.$q.err(d.message);
                          }
                        })
                      }
                    }
                  ],
                },
                on: {
                  input: (v) => this.datasource.ip = v
                }
              })
            ),
            this.render_tr(h, '端口：',
              h('q-input', {
                style: {
                  minWidth: '200px',
                  maxWidth: '200px'
                },
                props: {
                  placeholder: '请输入服务器端口',
                  value: this.datasource.port,
                  hideUnderline: true,
                  disable:!this.update_permission,
                  after: [
                    {
                      icon: 'keyboard_return', handler: () => {
                        ajax_update_datasource(this.datasource.id, {
                          ip: this.datasource.ip,
                          port: this.datasource.port,
                          username: this.datasource.username,
                          password: this.datasource.password,
                          db: this.datasource.db
                        }).then(d => {
                          if (d.status === 1) {
                            this.$q.ok('修改成功!');
                          } else {
                            this.$q.err(d.message);
                          }
                        })
                      }
                    }
                  ],
                },
                on: {
                  input: (v) => this.datasource.port = v
                }
              })
            ),
            this.render_tr(h, '用户名：',
              h('q-input', {
                style: {
                  minWidth: '200px',
                  maxWidth: '200px'
                },
                props: {
                  placeholder: '请输入登录用户名',
                  value: this.datasource.username,
                  hideUnderline: true,
                  disable:!this.update_permission,
                  after: [
                    {
                      icon: 'keyboard_return', handler: () => {
                        ajax_update_datasource(this.datasource.id, {
                          ip: this.datasource.ip,
                          port: this.datasource.port,
                          username: this.datasource.username,
                          password: this.datasource.password,
                          db: this.datasource.db
                        }).then(d => {
                          if (d.status === 1) {
                            this.$q.ok('修改成功!');
                          } else {
                            this.$q.err(d.message);
                          }
                        })
                      }
                    }
                  ],
                },
                on: {
                  input: (v) => this.datasource.username = v
                }
              })
            ),
            this.render_tr(h, '密码：',
              h('q-input', {
                style: {
                  minWidth: '200px',
                  maxWidth: '200px'
                },
                props: {
                  placeholder: '请输入登录密码',
                  value: this.datasource.password,
                  type: 'password',
                  hideUnderline: true,
                  clearable: true,
                  disable:!this.update_permission,
                  after: [
                    {
                      icon: 'keyboard_return', handler: () => {
                        ajax_update_datasource(this.datasource.id, {
                          ip: this.datasource.ip,
                          port: this.datasource.port,
                          username: this.datasource.username,
                          password: this.datasource.password,
                          db: this.datasource.db
                        }).then(d => {
                          if (d.status === 1) {
                            this.$q.ok('修改成功!');
                          } else {
                            this.$q.err(d.message);
                          }
                        })
                      }
                    }
                  ],
                },
                on: {
                  input: (v) => this.datasource.password = v
                }
              })
            ),
            this.render_tr(h, '激活：', h('q-toggle', {
              staticClass: 'text-left',
              props: {
                leftLabel: true,
                value: this.datasource.status === 1 ? true : false,
                color: 'deep-orange',
                disable:!this.update_permission,
              },
              on: {
                input: (v) => {
                  this.connection_error = null
                  ajax_update_datasource(this.datasource.id, {
                    ip: this.datasource.ip,
                    port: this.datasource.port,
                    username: this.datasource.username,
                    password: this.datasource.password,
                    db: this.datasource.db
                  }).then(
                    () => ajax_active_datasource(
                      this.datasource.id,
                    ).then(d => {
                      if (d.status === 1) {
                        this.datasource.status = v === true ? 1 : -1
                        if (v === true) {
                          this.$q.ok("已激活！")

                        } else {
                          this.$q.ok("已失效！")
                        }
                        this.$emit('update')

                      } else {
                        this.connection_error = d.message
                        this.$q.err('数据库连接失败！')
                      }
                    })
                  )
                }
              }
            })),

            this.connection_error ? this.render_tr(h, '连接异常：', h('div', {
              staticClass: 'text-left text-negative text-weight-bold pp-border-3 q-pa-sm',
            }, [this.connection_error])) : null
          ]),
        ])
      ])
    },

    select_datasource(datasource) {
      if (datasource && datasource.id) {
        this.query_datasource(datasource.id);
      }
    },

    query_datasource(id) {
      ajax_get_datasource_update_permission(id).then(d => {
        if (d.status === 1) {
          this.update_permission = d.data
        }
      }).then(() => {
        ajax_get_datasource(id)
          .then(date => this.datasource = date.data || {})
          .catch(() => this.$q.err('获取数据源配置异常'));
        ajax_datasource_owners_search(id).then(d => {
          this.owners = d.data || []
        }).catch()
      })
    },

  },
  render(h) {
    return h('transition', {props: {appear: true, mode: 'out-in', enterActiveClass: 'animate-popup-down'}}, [
      h('div', {
        staticClass: 'scroll',
        style: {
          paddingLeft: '10px',
          paddingTop: '3px'
        }
      }, [
        this.render_base_info(h),
        this.update_permission ? this.render_connection_info(h) : null,
        this.render_description(h),
      ])
    ])
  },
}
