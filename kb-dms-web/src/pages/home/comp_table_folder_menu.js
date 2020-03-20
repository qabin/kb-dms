import {ajax_get_datasource_sql_options_permission} from "../../api/permission/sql_options_api";
import {sql_editor_select_100} from "../../utils/sql_editor_dictionary";
import {string_format, to_string} from "../../utils/data_format_utils";
import {ajax_get_table_create_sql} from "../../api/utils/sql_editor_utils_api";
import {ajax_add_sql_editor_tab, ajax_sql_editor_tab_active} from "../../api/user/sql_editor_tab_api";
import {ajax_drop_table, ajax_truncate_table} from "../../api/utils/sql_exe_utils_api";
import {datasource_type_enum} from "../../utils/config_dictionary";
import {sql_editor_tab_type_enum} from "../../utils/user_dictionary";

export default {
  name: 'comp_table_menu',
  data: () => ({
    sql_options_list: [],
    show_ddl_tools: false
  }),
  props: {
    datasource: {
      type: [Object],
      required: true,
    },
    db: {
      type: [String],
      required: true
    },
    table: {
      type: [String],
      required: true
    }
  },
  methods: {
    render_dql_tools(h) {
      return h('div', {}, [
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          on: {
            click: () => {
              this.$refs.QContextMenu.hide()
              this.$emit("select_100", string_format(sql_editor_select_100[this.datasource.type].command, [this.table]))
            }
          }
        }, [
          h('i', {
            staticClass: 'mdi mdi-table-search text-primary',
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('span', ['查询前100行数据'])
        ]),
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          on: {
            click: () => {
              this.$refs.QContextMenu.hide()
              this.$emit("view_table_content", {datasource: this.datasource, db: this.db, table: this.table})

            }
          }
        }, [
          h('i', {
            staticClass: 'mdi mdi-table-eye text-primary',
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('span', ['查看表数据'])
        ]),
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          on: {
            click: () => {
              this.$refs.QContextMenu.hide()
              this.$emit("view_table_info", {datasource: this.datasource, db: this.db, table: this.table})

            }
          }
        }, [
          h('i', {
            staticClass: 'mdi mdi-table-settings text-primary',
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('span', ['查看表结构'])
        ]),
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          on: {
            click: () => {
              this.$refs.QContextMenu.hide()
              ajax_add_sql_editor_tab({
                sql_text: null,
                name: null,
                datasource_id: this.datasource.id,
                db: this.db,
                type: sql_editor_tab_type_enum.cmd_console.value
              }).then(d => {
                if (d.status === 1) {
                  d.data && ajax_sql_editor_tab_active(d.data).then(d => {
                    this.$emit("new_table_search")
                  })
                } else {
                }
              })

            }
          }
        }, [
          h('i', {
            staticClass: 'mdi mdi-table-search text-primary',
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('span', ['新建查询窗口'])
        ]),
      ])
    },
    render_ddl_tools(h) {
      return h('div', {}, [
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          on: {
            click: () => {
              this.$refs.QContextMenu.hide()
              this.$emit("create_table", {datasource: this.datasource, db: this.db, table: null})
            }
          }
        }, [
          h('i', {
            staticClass: 'mdi mdi-table-plus text-secondary',
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('span', ['创建表'])

        ]),
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover row items-center q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          on: {
            click: () => {
              this.$refs.QContextMenu.hide()
              this.$emit("edit_table", {datasource: this.datasource, db: this.db, table: this.table})

            }
          }
        }, [
          h('i', {
            staticClass: 'mdi mdi-table-edit text-secondary',
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('span', ['编辑表'])
        ]),
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          on: {
            click: () => {
              this.$refs.QContextMenu.hide()
              this.drop_table()

            }
          }
        }, [
          h('i', {
            staticClass: 'mdi mdi-table-remove text-secondary',
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('span', ['删除表'])
        ]),
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          on: {
            click: () => {
              this.$refs.QContextMenu.hide()
              this.truncate_table()

            }
          }
        }, [
          h('i', {
            staticClass: 'mdi mdi-table-large-remove text-secondary',
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('span', ['清空表'])
        ]),
      ])
    },
    render_copy_tools(h) {
      return h('div', {}, [
        h('div', {
            staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
            on: {
              click: () => {
                this.$refs.QContextMenu.hide()
                this.copy_value(string_format(sql_editor_select_100[this.datasource.type].command, [this.table]))

              }
            }
          }, [
            h('i', {
              staticClass: 'mdi mdi-content-copy text-positive',
              style: {
                fontSize: '16px',
                marginRight: '3px'
              }
            }),
            h('span', ['复制查询语句'])
          ]
        ),
        h('div', {
            staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
            on: {
              click: () => {
                let vm = this
                ajax_get_table_create_sql(this.datasource.id, this.db, this.table).then(d => {
                  if (d.status === 1) {
                    vm.$refs.QContextMenu.hide()
                    vm.copy_value(to_string(d.data))
                  }
                })
              }
            }
          }, [
            h('i', {
              staticClass: 'mdi mdi-content-copy text-positive',
              style: {
                fontSize: '16px',
                marginRight: '3px'
              }
            }),
            h('span', ['复制建表语句'])
          ]
        ),
      ])
    },
    render_refresh_tools(h) {
      return h('div', {}, [
        h('div', {
            staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
            on: {
              click: () => {
                this.$refs.QContextMenu.hide()
                this.$emit('refresh_table_list')

              }
            }
          }, [
            h('i', {
              staticClass: 'mdi mdi-refresh text-info',
              style: {
                fontSize: '16px',
                marginRight: '3px'
              }
            }),
            h('span', ['刷新'])
          ]
        ),
      ])
    },
    get_permission_sql_options() {
      this.datasource && ajax_get_datasource_sql_options_permission(this.datasource.id).then(d => {
        if (d.status === 1) {
          this.sql_options_list = d.data || []
          if (this.sql_options_list.length > 0) {
            for (let sqlOptionsListKey of this.sql_options_list) {
              if (sqlOptionsListKey.option_type === 3) {
                this.show_ddl_tools = true
                break
              }
            }
          }
        }
      })
    },

    copy_value(v) {
      this.$copyText(v).then(() => {
        this.$q.ok('已经复制到粘贴板！')
      }, () => {
        this.$q.err('复制失败！')
      })
    },
    drop_table() {
      this.$refs.QContextMenu.hide()
      this.$q.ppDialog(
        h => [
          h('div', {
            staticClass: 'font-14'
          }, ['删除表'])
        ],
        h => [
          h('div', {
            staticClass: 'q-ml-md q-mt-md items-center text-tertiary'
          }, [
            h('span', ['确认删除表：']),
            h('span', {
              staticClass: 'text-weight-bold'
            }, [this.table]),
            h('span', [' 吗？']),

          ]),
        ],
        (close) => {
          ajax_drop_table(this.datasource.id, this.db, this.table).then(d => {
            if (d.status === 1) {
              this.$q.ok("删除成功！")
              this.$emit("refresh_table_list")
            } else {
              this.$q.err("删除异常！")
            }
          })

          close && close()
        },
        (close) => {
          close && close()
        }
      )

    },
    truncate_table() {
      this.$refs.QContextMenu.hide()
      this.$q.ppDialog(
        h => [
          h('div', {
            staticClass: 'font-14 items-center'
          }, ['清空表'])
        ],
        h => [
          h('div', {
            staticClass: 'q-ml-md q-ml-md q-mt-md items-center text-tertiary'
          }, [
            h('span', ['确认清空表：']),
            h('span', {
              staticClass: 'text-weight-bold'
            }, [this.table]),
            h('span', [' 吗？']),

          ]),

        ],
        (close) => {
          ajax_truncate_table(this.datasource.id, this.db, this.table).then(d => {
            if (d.status === 1) {
              this.$q.ok("清空成功！")
              this.$emit("refresh_table_list")
            } else {
              this.$q.err("清空异常！")
            }
          })

          close && close()
        },
        (close) => {
          close && close()
        }
      )

    }
  },
  render(h) {
    return h('q-context-menu', {
      ref: 'QContextMenu',
      style: {
        userSelect: 'none',
      },
      on: {
        show: () => {
          this.get_permission_sql_options()
        },
      }
    }, [
      h('div', {
        staticClass: 'font-13 items-center text-left scroll text-weight-medium',
        style: {
          width: '200px',
          borderTop: '10px solid var(--q-color-' + datasource_type_enum[this.datasource.type].color + ')',
        },
        on: {
          contextmenu: (e) => {
            e.preventDefault()
          }
        }
      }, [
        this.render_dql_tools(h),
        h('q-item-separator', {staticClass: 'q-ma-none'}),

        this.show_ddl_tools ? this.render_ddl_tools(h) : null,
        this.show_ddl_tools ? h('q-item-separator', {staticClass: 'q-ma-none'}) : null,

        this.render_copy_tools(h),
        h('q-item-separator', {staticClass: 'q-ma-none'}),
        this.render_refresh_tools(h),

      ])
    ])
  }
}
