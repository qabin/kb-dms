import CatalogBase from "../../components/catalog/MixinCatalogBase";
import {ajax_get_datasource_db_table_field} from "../../api/config/datasource_api";

import CompTableColumnTypeInput from './comp_table_column_type_input'
import {ajax_get_datasource_sql_options_permission} from "../../api/permission/sql_options_api";
import {ajax_get_datasource_table_content} from "../../api/utils/sql_exe_utils_api";
import {string_to_json} from "../../utils/data_format_utils";
import {data_options_type_enums} from "../../utils/sql_editor_dictionary";
import {get_dml_sql_build} from "./utils_dml_sql_command_builder";
import extend from "quasar-framework/src/utils/extend";
import TableDataMenu from './comp_table_data_menu'

export default {
  name: 'comp_table_content_catalog',
  props: {
    datasource_id: [String, Number],
    db: [String],
    table_name: [String],
  },
  mixins: [CatalogBase],
  data: () => ({
    table_columns: [],
    table_fields: [],
    query_switch: true,
    update_permission: false,
    selected_rows: [],
    pagination_ctl: {
      page: 1,
      rowsNumber: 0,
      rowsPerPage: 10
    },
    tab_id: null,
    tab_name: null,
    new_row: {},
    is_loading: false,
    order_by_field: null,
    order_by_desc: false,
    is_updating: false,
    temp_rows: [],
    copy_row: null,

  }),
  watch: {
    table_name: {
      handler() {
        this.assemble_column()
        this.request();
      },
      immediate: true
    }
  },
  methods: {
    render_scope_slot(h, scope) {
      scope['header'] = (props) => h('q-tr', {
        props,
      }, this.table_columns.map(c =>
        h('q-td', {
          style: {
            paddingRight: '10px !important'
          },
          staticClass: 'font-12 text-faded text-weight-medium', 'class': [c.label_bg, `text-${c.align || 'left'}`],
          props, key: c.name
        }, [
          h('div', {
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

            c.label ? h('q-icon', {
              staticClass: 'cursor-pointer',
              style: {
                marginLeft: '3px'
              },
              nativeOn: {
                click: () => {
                  if (this.order_by_field === c.label) {
                    this.order_by_desc = !this.order_by_desc
                  } else {
                    this.order_by_desc = true
                  }
                  this.order_by_field = c.label
                  this.request()
                }
              },
              props: {
                name: this.order_by_field === c.label && this.order_by_desc ? 'arrow_downward' : 'arrow_upward',
                color: 'primary',
                size: '14px'
              }
            }) : null
          ]),

        ])));

      scope['body'] = props => [
        (typeof props.row['options_type'] === 'undefined' || props.row['options_type'] !== data_options_type_enums.DELETE) ? h('q-tr', {
            // props,
            staticClass: "cursor-pointer",
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
    assemble_column() {
      ajax_get_datasource_db_table_field(this.datasource_id, this.db, this.table_name)
        .then(d => {
          let columns = d.data
          let arr = []
          this.table_fields = d.data
          this.table_columns = []

          this.update_permission && arr.push({
            name: 'remove', align: 'left',
            render: (h, props) => h('div', {
              staticClass: 'row items-center text-center full-height',
              style: {
                minWidth: '30px',
              },
              on: {
                click: () => {
                  this.selected_rows = []
                  this.selected_rows.push(props.row)

                }
              }
            }, [
              h('div', {}, [this.selected_rows.some(r => r === props.row) ? h('q-icon', {
                props: {
                  name: 'play_arrow',
                  size: '14px'
                }
              }) : null,]),
              this.update_permission ? h(TableDataMenu, {
                refs: 'TableDataMenu',
                props: {
                  row: props.row
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
                  }
                }
              }) : null,
            ])
          });

          columns.forEach((column, i) => arr.push({
            name: column.column_name, align: 'left', field: column.column_name,
            label: column.column_name,
            render: (h, props) => h(CompTableColumnTypeInput, {
              staticClass: 'font-12 text-tertiary',

              props: {
                value: props.row[column.column_name],
                field: column,
                disable: !this.update_permission,
              },
              on: {
                input: v => {
                  props.row[column.column_name] = v
                  if (typeof props.row['options_type'] === 'undefined')
                    props.row['options_type'] = data_options_type_enums.UPDATE
                  this.is_updating = true
                },
                focus: () => {
                  this.selected_rows = []
                  this.selected_rows.push(props.row)
                }
              }
            })
          }));

          this.table_columns = this.table_columns.concat(arr);
        })
        .catch(() => this.$q.err('获取数据异常'))
    },
    request() {
      this.is_updating = false
      this.new_row = {}
      let vm = this
      this.datasource_id && ajax_get_datasource_sql_options_permission(this.datasource_id).then(d => {
          if (d.status === 1) {
            let permission_options = d.data || []
            this.update_permission = permission_options.some(p => p.option_type === 2) || false
          }
        }
      ).then(() => {
        this.is_loading = true
        let order_by_sql = vm.order_by_field !== null ? "ORDER BY " + vm.order_by_field + (vm.order_by_desc ? " DESC" : "") : null
        ajax_get_datasource_table_content(vm.datasource_id, vm.db, vm.table_name, vm.page, order_by_sql)
          .then(d => {
            this.is_loading = false
            if (d.status === 1) {
              let result = (string_to_json(d.data.data))['data'] || []
              this.rows = []
              this.rows = result;
              this.temp_rows = extend(true, [], this.rows)
              this.rowsNumber = d.data.count || 0;
            }
          })
          .catch(() => {
            this.$q.err('获取数据异常')
            this.is_loading = false
          })
      })
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
        this.update_permission ? h('q-icon', {
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
        }, [h('q-tooltip', {props: {offset: [5, 5]}}, '新增数据行')]) : null,
        this.update_permission ? h('q-icon', {
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
        }, [h('q-tooltip', {props: {offset: [5, 5]}}, '删除选中行')]) : null,
        h('q-icon', {
          staticClass: 'cursor-pointer q-ml-sm pp-selectable-bg-cyan-5 pp-selectable-color-white',
          style: {
            padding: '2px'
          },
          props: {
            name: 'refresh',
            color: 'info',
            size: '24px'
          },
          nativeOn: {
            click: () => {
              this.pagination_ctl = {
                page: 1,
                rowsNumber: 0,
                rowsPerPage: 10
              }

              this.request()
            }
          }
        }, [h('q-tooltip', {props: {offset: [5, 5]}}, '刷新')]),

        this.update_permission ? h('q-icon', {
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
              let sql = get_dml_sql_build(this.temp_rows, this.rows, this.table_fields, this.table_name)
              this.$emit('sql_confirm', {
                datasource_id: this.datasource_id,
                db: this.db,
                sql: sql
              })
            }
          }
        }, [h('q-tooltip', {props: {offset: [5, 5]}}, '确认')]) : null,

        this.update_permission ? h('q-icon', {
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
              this.rows = extend(true, [], this.temp_rows)
              this.rowsNumber = this.rows.length > 0 ? 1 : 0

              this.is_updating = false
            }
          }
        }, [h('q-tooltip', {props: {offset: [5, 5]}}, '取消')]) : null,
      ])
    },
    render_tools_bar_right(h) {
      return h('div', {
        staticClass: 'row items-center full-height btn-hover'
      }, [])
    },
    get_field_remarks(column_name) {

      let remarks = null
      this.table_fields.map(f => {
        if (f.column_name === column_name) {
          remarks = f.remarks
        }
      })

      return remarks
    }
  },
  render(h) {
    return h('div', {
      staticClass: 'scroll',
      style: {
        borderLeft: '1px solid var(--q-color-grey-3)',
        height: '100%',
        maxHeight: '560px'
      }
    }, [
      this.render_tools_bar(h),
      this.is_loading ? h('div', {
          staticClass: 'items-center full-height',
        }, [
          h('q-spinner-ios', {
            style: {
              marginTop: '200px'
            },
            props: {
              color: 'primary',
              size: '50px'
            }
          })
        ]) :
        h('q-table', {
          staticClass: 'shadow-0 scroll column col-grow',
          props: {
            dense: true,
            separator: 'horizontal',
            color: 'primary',
            data: this.rows,
            //selection: "multiple",
            //selected: this.selected_rows,
            columns: this.table_columns,
            rowKey: 'id',
            pagination: this.pagination_ctl,
            rowsPerPageOptions: [10],
            noDataLabel: '无记录',
            rowsPerPageLabel: this.rowsPerPageLabel,
            hideBottom: !this.rowsNumber,
          },
          scopedSlots: this.__render_scope_slot(h),
          on: {request: this.__request}
        })
    ])
  }
}
