import CatalogBase from '../../components/catalog/MixinCatalogBase'
import {string_to_json, to_string} from "../../utils/data_format_utils";
import {ajax_get_datasource_db_table_field} from "../../api/config/datasource_api";
import {sql_exe_result_status_enum} from "../../utils/result_dictionary";
import CompTableColumnTypeInput from "./comp_table_column_type_input";
import {ajax_get_datasource_sql_options_permission} from "../../api/permission/sql_options_api";
import {get_dml_sql_build} from "./utils_dml_sql_command_builder";
import extend from "quasar-framework/src/utils/extend"
import {data_options_type_enums} from "../../utils/sql_editor_dictionary";
import {format_date_full, format_time, format_day, format_year} from "../../utils/date_format_utils";
import TableDataMenu from './comp_table_data_menu'
import {data_type_name_date_options} from "../../utils/sql_editor_dictionary";
import easyTable from "../../plugins/easy-table/kb-easytable";

export default {
  name: 'comp_exe_result_catalog',
  mixins: [CatalogBase],
  components: {
    easyTable
  },
  data: () => ({
    noDataLabel: '暂无执行结果',
    kw: null,
    pagination_ctl: {
      page: 1,
      rowsNumber: 0,
      rowsPerPage: 1000
    },
    table_columns: [],
    table_fields: [],
    activate_refresh: false,
    field_type: [],
    update_permission: false,
    selected_rows: [],
    show_edit_tool_bar: false,
    temp_rows: [],
    is_updating: false,
    copy_row: null,

  }),
  props: {
    exe_result: {
      type: [Object],
      require: true,
      default: {}
    },
    show_tools_bar: {
      type: [Boolean],
      default: true
    }
  },
  watch: {
    exe_result: {
      immediate: true,
      handler: function (nv, ov) {
        if (nv) {
          let exe_result_list = (string_to_json(nv.result))['data']
          if (typeof exe_result_list === 'undefined') {
            exe_result_list = []
          }

          this.field_type = []
          this.field_type = (string_to_json(this.exe_result.result))['field_type'] || []

          ajax_get_datasource_sql_options_permission(this.exe_result.datasource_id).then(d => {
              if (d.status === 1) {
                let permission_options = d.data || []
                this.update_permission = permission_options.some(p => p.option_type === 2) || false
              }
            }
          ).then(() => {
            if (exe_result_list && exe_result_list.length > 0) {
              this.deal_with_columns(exe_result_list[0])
            }

            if (this.exe_result && this.get_table_name_from_sql()) {
              ajax_get_datasource_db_table_field(this.exe_result.datasource_id, this.exe_result.db, this.get_table_name_from_sql()).then(d => {
                if (d.status === 1) {
                  this.table_fields = d.data
                  if (this.table_columns && this.table_columns.length > 0) {
                    let filter_table_columns
                    if (this.table_columns[0].field = 'remove') {
                      filter_table_columns = extend(true, [], this.table_columns)
                      filter_table_columns.splice(0, 1)
                    }

                    if (this.table_fields.length === filter_table_columns.length) {
                      let is_some = true

                      for (let i = 0; i < this.table_fields.length; i++) {
                        if (!this.table_columns.some(c => c.field === this.table_fields[i]['column_name'])) {
                          is_some = false
                          break
                        }
                      }
                      if (is_some) {
                        this.edit_columns()
                      }
                    }
                  }

                }

                this.rows = this.change_result_value(exe_result_list) || []
                this.rowsNumber = this.rows.length > 0 ? 1 : 0
                this.temp_rows = extend(true, [], this.rows)
              })
            } else {
              this.rows = this.change_result_value(exe_result_list) || []
              this.rowsNumber = this.rows.length > 0 ? 1 : 0
              this.temp_rows = extend(true, [], this.rows)
            }

          })
        }
      }
    },
  },
  methods: {
    render_scope_slot(h, scope) {
      scope['header'] = (props) => h('q-tr', {
        // props,
      }, this.table_columns.map(c =>
        h('q-td', {
          staticClass: 'font-12 text-faded text-weight-medium', 'class': [c.label_bg, `text-${c.align || 'left'}`],
          style: {
            paddingRight: '10px !important'
          },
          props, key: c.name
        }, [
          h('div',
            {
              staticClass: 'row no-wrap'
            }, [
              c.header_render ? c.header_render(h) : h('div', {
                staticClass: 'font-14 text-weight-bold text-primary'
              }, [
                c.label
              ]),
              this.get_field_remarks(c.label) !== null && this.get_field_remarks(c.label) ? h('q-icon', {
                style: {
                  marginLeft: '3px'
                },
                props: {
                  name: 'help_outline',
                  color: 'faded'
                }
              }, [
                h('q-tooltip', {props: {offset: [5, 5]}}, [this.get_field_remarks(c.label)])
              ]) : null,
            ]),

        ])
      ));

      scope['body'] = props => [
        (typeof props.row['options_type'] === 'undefined' || props.row['options_type'] !== data_options_type_enums.DELETE) ? h('q-tr', {
            // props,
            staticClass: "cursor-pointer ",
          }, this.table_columns.map(column => h('q-td', {
            style: {
              paddingRight: '10px !important'
            },
            key: column.name,
            ...column.renderData,
            props: {
              props,
            },

          }, [
            column.render
              ? (
                Array.isArray(column.render)
                  ? column.render.map(r => r.call(this, h, props))
                  : column.render.call(this, h, props)
              )
              : props.row[column.field] || '--'
          ]))
        ) : null
      ]
    },
    get_field_remarks(column_name) {

      let remarks = null
      this.table_fields.map(f => {
        if (f.column_name === column_name) {
          remarks = f.remarks
        }
      })

      return remarks
    },
    render_exe_sql_info(h) {
      return h('div',
        {
          ref: 'target',
          staticClass: 'font-12 q-pa-sm bg-grey-1 row'
        }, [
          h('div', {
            staticClass: 'row no-wrap col-grow ellipsis text-left'
          }, [
            h('span', {}, ['命令：']),
            h('span', {
              staticClass: ' ellipsis  text-weight-medium'
            }, [this.exe_result.sql_text])
          ]),
          // (!this.update_permission || this.exe_result.status === -1 || this.exe_result.sql_option_type !== 1 || this.get_table_name_from_sql() === null) ? null : this.render_editor_result(h),

          h('div', {
            staticClass: 'q-ml-sm'
          }, [
            h('span', {}, ['状态：']),
            h('span', {
              staticClass: 'text-weight-medium text-' + sql_exe_result_status_enum[this.exe_result.status].color
            }, [sql_exe_result_status_enum[this.exe_result.status].label]),
          ]),
          this.exe_result.status !== -1 && this.exe_result.sql_option_type === 1 ? h('div', {
            staticClass: 'q-ml-sm'
          }, [
            h('span', {}, ['数量：']),
            h('span', {
              staticClass: 'text-weight-bold'
            }, [(string_to_json(this.exe_result.result))['data'].length]),
          ]) : null,
          h('div', {
            staticClass: 'q-ml-sm'
          }, [
            h('span', {}, ['执行耗时：']),
            h('span', {
              staticClass: 'text-weight-bold'
            }, [
              (string_to_json(this.exe_result.result))['end_time'] - (string_to_json(this.exe_result.result))['start_time'] >= 1000 ? ((string_to_json(this.exe_result.result))['end_time'] - (string_to_json(this.exe_result.result))['start_time']) / 1000 + '秒' : (string_to_json(this.exe_result.result))['end_time'] - (string_to_json(this.exe_result.result))['start_time'] + '毫秒'
            ])
          ]),

        ])
    },
    render_exe_sql_error_info(h) {
      return h('div', {
        staticClass: 'font-12 text-weight-medium text-negative q-pa-sm text-left scroll',
        style: {
          height: '300px'
        }
      }, [
        h('span', {}, [(string_to_json(this.exe_result.result))['message']]),
      ])
    },
    get_table_name_from_sql() {
      if (this.exe_result) {
        if (this.exe_result.table_name_list) {
          let table_list = this.exe_result.table_name_list.split(",")
          if (table_list.length = 1) {
            return this.exe_result.table_name_list
          }
        }
      }
      return null
    },
    render_tools_bar(h) {
      return h('div', {
        staticClass: 'row no-wrap bg-grey-3 items-center',
        style: {
          height: '40px'

        }
      }, [
        this.render_tools_bar_left(h),
        this.render_tools_bar_right(h)
      ])
    },
    render_tools_bar_left(h) {
      return h('div', {
        staticClass: 'row items-center col-grow text-left full-height'
      }, [
        h('q-icon', {
          staticClass: 'cursor-pointer q-ml-sm pp-selectable-bg-blue-5 pp-selectable-color-white',
          style: {
            padding: '2px'
          },
          props: {
            name: 'add',
            color: 'primary',
            size: '24px'
          },
          nativeOn: {
            click: () => {
              this.add_row()
            }
          }
        }, [h('q-tooltip', {props: {offset: [5, 5]}}, '新增数据行')]),
        h('q-icon', {
          staticClass: 'cursor-pointer q-ml-sm pp-selectable-bg-red-5 pp-selectable-color-white',
          style: {
            padding: '2px'
          },
          props: {
            name: 'remove',
            color: 'negative',
            size: '24px'
          },
          nativeOn: {
            click: () => {
              this.selected_rows.map(r => this.delete_row(r))
            }
          }
        }, [h('q-tooltip', {props: {offset: [5, 5]}}, '删除选中行')]),

        h('q-icon', {
          staticClass: 'cursor-pointer q-ml-sm',
          'class': {
            'disabled': !this.is_updating,
            'pp-selectable-bg-blue-5 pp-selectable-color-white': this.is_updating
          },
          style: {
            padding: '2px'
          },
          props: {
            name: 'check',
            color: this.is_updating ? 'primary' : 'faded',
            size: '24px'
          },
          nativeOn: {
            click: () => {
              if (this.is_updating) {
                let sql = get_dml_sql_build(this.temp_rows, this.rows, this.table_fields, this.get_table_name_from_sql())
                this.$emit('sql_confirm', {
                  datasource_id: this.exe_result.datasource_id,
                  db: this.exe_result.db,
                  sql: sql
                })
              }
            }
          }
        }, [h('q-tooltip', {props: {offset: [5, 5]}}, '确认')]),

        h('q-icon', {
          staticClass: 'cursor-pointer q-ml-sm ',
          'class': {
            'disabled': !this.is_updating,
            'pp-selectable-bg-amber-5 pp-selectable-color-white': this.is_updating
          },
          style: {
            padding: '2px'
          },
          props: {
            name: 'cancel',
            color: this.is_updating ? 'warning' : 'faded',
            size: '24px'
          },
          nativeOn: {
            click: () => {
              if (this.is_updating) {
                this.rows = extend(true, [], this.temp_rows)
                this.rowsNumber = this.rows.length > 0 ? 1 : 0

                this.is_updating = false
              }
            }
          }
        }, [h('q-tooltip', {props: {offset: [5, 5]}}, '取消')]),

      ])
    },
    render_tools_bar_right(h) {
      return h('div', {
        staticClass: 'row items-center full-height'
      }, [])
    },
    add_row() {
      let new_row = {}

      for (let i = 0; i < this.table_fields.length; i++) {
        new_row[this.table_fields[i].column_name] = null
      }

      new_row['options_type'] = data_options_type_enums.ADD
      this.is_updating = true
      this.rows = this.rows.concat([new_row])
      this.selected_rows = [new_row]

    },
    delete_row(row) {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i] === row) {
          if (this.rows[i]['options_type'] !== data_options_type_enums.ADD) {
            this.rows[i]['options_type'] = data_options_type_enums.DELETE
          } else {
            this.rows.splice(i, 1)
          }
        }
      }
      for (let i = 0; i < this.selected_rows.length; i++) {
        if (this.selected_rows[i] === row) {
          this.selected_rows.splice(i, 1)
        }
      }
      this.is_updating = true
    },
    // auto_scroll_to_bottom() {
    //
    //   let ele = document.getElementById('exe_result_div');
    //   console.log(ele.scrollHeight)
    //   ele.scrollTop = ele.scrollHeight;
    //
    // },
    deal_with_columns(list) {
      this.table_columns = [{
        field: 'remove',
        titleAlign: 'left',
        columnAlign: 'left',
        width: 45,
        renderBody: (h, props) => h('div', {
          staticClass: 'row items-center text-center full-height',
          style: {
            minWidth: '30px'
          },
          on: {
            click: () => {
              this.selected_rows = []
              this.selected_rows.push(props.item)
            }
          }
        }, [
          h('div', {}, [
            this.selected_rows.some(r => r === props.item) ? h('q-icon', {
              props: {
                name: 'play_arrow',
                size: '14px'
              }
            }) : null,
          ]),
        ])
      }]

      Object.keys(list).map(k => {
        if (k !== '__index') {
          this.table_columns.push(
            {
              field: k,
              title: k,
              titleAlign: 'left',
              columnAlign: 'left',
              isResize: true,
              width: 150,
              renderBody: (h, props) => h('div', {
                staticClass: 'font-12 text-tertiary ellipsis',
                style: {
                  paddingRight: '10px !important'
                },
              }, [
                this.field_type && this.field_type[k] && data_type_name_date_options.some(d => this.field_type[k].toUpperCase().indexOf(d.toUpperCase()) !== -1) ? props.item[k] : to_string(props.item[k])
              ]),
              renderHeader: (h, props) => h('div', {
                staticClass: 'row no-wrap'
              }, [
                h('div', {
                  staticClass: 'font-14 text-weight-bold text-primary'
                }, [
                  props.col.title
                ]),
                this.get_field_remarks(props.col.title) !== null && this.get_field_remarks(props.col.title) ? h('q-icon', {
                  style: {
                    marginLeft: '3px'
                  },
                  props: {
                    name: 'help_outline',
                    color: 'faded'
                  }
                }, [
                  h('q-tooltip', {props: {offset: [5, 5]}}, [this.get_field_remarks(props.col.title)])
                ]) : null,
              ]),
            }
          )
        }
      })
    },
    default_columns() {
      let default_value = {}
      this.table_fields.map(f => {
        default_value[f.column_name] = ""
      })

      return default_value;
    },
    change_result_value(exe_result_list) {
      let timeType = {}
      this.table_fields && Object.keys(this.table_fields).forEach(key => {
        if (this.table_fields[key]['type_name'] === 'TIMESTAMP' || this.table_fields[key]['type_name'] === 'DATETIME'
          || this.table_fields[key]['type_name'] === 'TIME' || this.table_fields[key]['type_name'] === 'DATE'
          || this.table_fields[key]['type_name'] === 'YEAR') {
          timeType[this.table_fields[key]['column_name']] = this.table_fields[key]['type_name']
        }
      })
      let chagne_list = []
      if (exe_result_list && exe_result_list.length > 0) {
        Object.keys(exe_result_list).map(k => {
          if (k !== '__index') {
            let result = exe_result_list[k]
            Object.keys(timeType).forEach(type => {
              result[type] = this.change_value(result[type], timeType[type])
            })
            chagne_list.push(result)
          }
        })
      }

      return chagne_list
    },
    change_value(value, type) {
      switch (type) {
        case 'TIMESTAMP':
          return format_date_full(value)
        case 'DATETIME':
          return format_date_full(value)
        case 'TIME':
          return format_time(value)
        case 'DATE':
          return format_day(value)
        case 'YEAR':
          return format_year(value)
        default:
          return value
      }
    },
    edit_columns() {
      this.table_columns = []
      let arr = []

      arr.push({
        field: 'remove',
        titleAlign: 'left',
        columnAlign: 'left',
        width: 45,
        renderBody: (h, props) => h('div', {
          staticClass: 'row items-center text-center full-height',
          style: {
            minWidth: '30px'
          },
          on: {
            click: () => {
              this.selected_rows = []
              this.selected_rows.push(props.item)
            }
          }
        }, [
          h('div', {}, [
            this.selected_rows.some(r => r === props.item) ? h('q-icon', {
              props: {
                name: 'play_arrow',
                size: '14px'
              }
            }) : null,
          ]),
        ])
      });

      this.table_fields.forEach((column, i) => arr.push({
        field: column.column_name,
        title: column.column_name,
        bodyRowClass: 'pp-selected-bg-grey-4-hover',
        titleAlign: 'left',
        columnAlign: 'left',
        isResize: true,
        width: 150,
        renderBody: (h, props) => this.update_permission && this.selected_rows.length > 0 && this.selected_rows[0] === props.item ? h(CompTableColumnTypeInput, {
          props: {
            value: props.item[column.column_name],
            field: column,
            disable: !this.update_permission,
            no_enter_icon: props.col['kb-dms_add_row_by_tab'] || false
          },
          on: {
            input: v => {
              props.item[column.column_name] = v
              if (typeof props.item['options_type'] === 'undefined')
                props.item['options_type'] = data_options_type_enums.UPDATE
              this.is_updating = true
            },
            focus: () => {
              this.selected_rows = []
              this.selected_rows.push(props.item)
            }
          }
        }) : h("div", {
          staticClass: 'font-12 text-tertiary ellipsis',
          on: {
            click: () => {
              this.selected_rows = []
              this.selected_rows.push(props.item)
            }
          }
        }, [
          props.item[column.column_name],
        ]),
        renderHeader: (h, props) => h('div', {
          staticClass: 'row no-wrap'
        }, [
          h('div', {
            staticClass: 'font-14 text-weight-bold text-primary'
          }, [
            props.col.title
          ]),
          this.get_field_remarks(props.col.title) !== null && this.get_field_remarks(props.col.title) ? h('q-icon', {
            style: {
              marginLeft: '3px'
            },
            props: {
              name: 'help_outline',
              color: 'faded'
            }
          }, [
            h('q-tooltip', {props: {offset: [5, 5]}}, [this.get_field_remarks(props.col.title)])
          ]) : null,
        ]),
      }));
      this.table_columns = this.table_columns.concat(arr);
    },
    data_clear() {
      this.rows = []
      this.temp_rows = []
      this.table_columns = []
    }
  },
  render(h) {
    return h('div', {}, [
      this.exe_result ? this.render_exe_sql_info(h) : null,
      this.update_permission && this.show_tools_bar && this.get_table_name_from_sql() ? this.render_tools_bar(h) : null,
      this.exe_result && this.exe_result.status === -1 ? this.render_exe_sql_error_info(h) :
        h('div', {
          attrs: {
            id: 'exe_result_div'
          },
        }, [
          h('easyTable', {
            staticClass: 'col-grow',
            props: {
              columns: this.table_columns,
              tableData: this.rows,
              tableClass: 'shadow-0 font-13 pp-border-3 scroll' + this.table_class,
              tableStyle: {
                height: '300px'
              },
              tableOption: {
                'title-row-height': 23,
                'row-height': 23
              },
              bodyTrContext: this.update_permission ? (h, props) => h(TableDataMenu, {
                refs: 'TableDataMenu',
                props: {
                  row: props.item
                },
                on: {
                  add_new_row: () => {
                    this.add_row()
                  },
                  delete_cur_row: (v) => {
                    this.delete_row(v)
                  },
                  copy_cur_row: (v) => {
                    this.copy_row = extend(true, {}, v)
                  },
                  paste_cur_row: () => {
                    if (this.copy_row) {
                      this.copy_row['options_type'] = data_options_type_enums.ADD
                      this.rows.push(this.copy_row)
                      this.is_updating = true
                    }
                  },
                  show: (v) => {
                    this.selected_rows = []
                    this.selected_rows.push(v)
                  }
                }
              }) : null,
            },
            on: {
              'on-custom-comp': (v) => {
                console.log("params", v)
              },
            }
          }),
          h('div', {
            style: {
              height: '5px'
            }
          })
        ]),
    ])
  }
}
