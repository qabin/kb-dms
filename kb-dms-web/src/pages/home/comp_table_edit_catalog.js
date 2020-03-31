import CatalogBase from "../../components/catalog/MixinCatalogBase";
import CompTableEditFieldTypeInput from "./comp_table_edit_field_type_input";
import CompTableIndexFieldTypeInput from './comp_table_index_field_type_input'
import {get_ddl_sql_builder} from "./utils_edit_ddl_sql_command_builder";
import {data_options_type_enums} from "../../utils/sql_editor_dictionary";
import {table_name_check, table_remarks_check} from "./utils_ddl_sql_check";
import MysqlCharsetSelector from '../../components/selector/MysqlCharsetSelector'
import {charset_type_enum} from "../../utils/mysql_charset_dictionary";
import extend from "quasar-framework/src/utils/extend";
import TableDdlRowMenu from './comp_table_edit_row_menu'
import TableIndexRowMenu from './comp_table_index_row_menu'
import {ajax_get_datasource_db_table_info} from "../../api/config/datasource_api";
import SideNavigator from '../../components/elements/side_navigator'
import {get_index_of_arr, remove_item_from_arr, replace_item_for_arr} from "../../utils/data_utils";
import LazyInput from "../../components/catalog/ComponentLazyInput";
import {DDLType} from "../../utils/edit_ddl_dictionary";
import {ajax_get_datasource_sql_options_permission} from "../../api/permission/sql_options_api";

const setting_tabs = [
  {
    key: 'columns',
    label: '编辑字段',
    component_name: 'table_columns'
  },
  {
    key: 'index',
    label: '编辑索引',
    component_name: 'table_index'
  },
]

const default_row = {
  column_name: null,
  column_def: null,
  is_autoincrement: false,
  is_nullable: true,
  is_primary_key: false,
  is_unsigned: false,
  options_type: data_options_type_enums.ADD,
  remarks: null,
  type_name: null,
  readonly: false,
}

const default_index_row = {
  index_name: null,
  online_index_name: null,
  index_columns: [],
  index_type: 'INDEX',
  options_type: data_options_type_enums.ADD,
}
const new_table_rows = [
  {
    column_name: 'id',
    column_def: null,
    is_autoincrement: true,
    is_nullable: false,
    is_primary_key: true,
    is_unsigned: true,
    options_type: data_options_type_enums.ADD,
    remarks: '主键',
    type_name: 'BIGINT(22)',
    readonly: true,
  },
  {
    column_name: 'insert_time',
    column_def: 'CURRENT_TIMESTAMP',
    is_autoincrement: false,
    is_nullable: false,
    is_primary_key: false,
    is_unsigned: false,
    options_type: data_options_type_enums.ADD,
    remarks: '插入时间',
    type_name: 'DATETIME',
    readonly: true,
  },
  {
    column_name: 'update_time',
    column_def: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    is_autoincrement: false,
    is_nullable: false,
    is_primary_key: false,
    is_unsigned: false,
    options_type: data_options_type_enums.ADD,
    remarks: '更新时间',
    type_name: 'DATETIME',
    readonly: true,
  },
  {
    ...default_row
  }
]

const new_table_index_rows = [
  {
    index_name: 'PRIMARY',
    online_index_name: null,
    readonly: true,
    index_columns: ['id'],
    index_type: 'PRIMARY',
    options_type: data_options_type_enums.ADD,
  },
  {
    index_name: 'idx_insert_time',
    online_index_name: null,
    readonly: true,
    index_columns: ['insert_time'],
    index_type: 'INDEX',
    options_type: data_options_type_enums.ADD,
  },
  {
    index_name: 'idx_update_time',
    online_index_name: null,
    readonly: true,
    index_columns: ['update_time'],
    index_type: 'INDEX',
    options_type: data_options_type_enums.ADD,
  },
  {
    ...default_index_row
  }
]

const default_table_columns = ['insert_time', 'update_time', 'id']

export default {
  name: 'comp_table_edit_catalog',
  props: {
    datasource_id: [String, Number],
    db: [String],
    table_name: {
      type: [String],
      default: ""
    },
    datasource_type: {
      type: [Number],
    },
    type: {
      type: [Number]
    }
  },
  mixins: [CatalogBase],
  computed: {
    input_table_name() {
      return this.new_table ? this.new_table : this.old_table
    },
    ddl_save_check() {
      return this.$store.state.home.ddl_save_check || false
    },
    ddl_check_error() {
      return this.table_columns_check_error.error || this.table_name_check_error.error || this.table_remarks_check_error.error
    },
    disabled() {
      return !this.update_permission
    },
    index_relation_rows() {
      let filter_rows = []

      if (this.search_column_kw) {
        filter_rows = extend(true, [], this.rows.filter(d => d.column_name && d.column_name.indexOf(this.search_column_kw) !== -1))
      } else {
        filter_rows = extend(true, [], this.rows)
      }
      if (this.selected_index_rows && this.selected_index_rows.length > 0) {
        let index_columns = this.selected_index_rows[0].index_columns
        let order_rows = []
        let no_order_rows = filter_rows.filter(d => d.column_name && !index_columns.some(c => c === d.column_name))

        let start_order_num = 1
        index_columns.forEach(d => {
          for (let filterRow of filter_rows) {
            if (d === filterRow.column_name) {
              order_rows.push({
                ...filterRow,
                order_num: start_order_num
              })
              start_order_num++
            }
          }
        })

        filter_rows = order_rows.concat(no_order_rows)
      }

      return filter_rows
    },
    exe_success() {
      return this.$store.state.home.exe_success;
    }
  },
  watch: {
    ddl_save_check: {
      immediate: true,
      handler: function (nv, ov) {
        if (nv) {
          this.table_remarks_check_error = table_remarks_check(this.new_table_remarks ? this.new_table_remarks : this.table_remarks)
        }
      }
    },
    table_name: {
      immediate: true,
      handler: function () {
        this.get_ddl_info()
      }
    },
    exe_success: {
      immediate: true,
      handler: function () {
        this.is_updating = false
        this.get_ddl_info()
        this.$store.state.home.exe_success = false
      }
    }
  },
  data: () => ({
    table_columns: [],
    selected_rows: [],
    selected_index_rows: [],
    pagination_ctl: {
      page: 1,
      rowsNumber: 0,
      rowsPerPage: 10000
    },
    new_row: {},
    is_updating: false,
    old_table: null,
    new_table: null,
    table_remarks: null,
    new_table_remarks: null,
    table_charset: null,
    new_table_charset: null,
    table_name_check_error: {
      error: false,
      msg: null
    },
    table_remarks_check_error: {
      error: false,
      msg: null
    },
    table_columns_check_error: {
      error: false,
      msg: null
    },
    table_index_check_error: {
      error: false,
      msg: null
    },
    rows: [...new_table_rows],
    copy_row: null,
    online_rows: [],
    curr_editor_user: null,
    setting: setting_tabs[0],
    index_table_columns: [],
    index_relations_column_columns: [],
    index_rows: [],
    online_index_rows: [],
    search_column_kw: null,
    update_permission: false
  }),
  methods: {
    render_scope_slot(h, scope) {
      scope['header'] = (props) => h('q-tr', {
        props,
      }, this.table_columns.map(c =>
        h('q-td', {
          staticClass: 'font-13 text-faded text-weight-medium',
          'class': [c.label_bg, `text-${c.align || 'center'}`],
          props,
          ...c.renderData,
          key: c.name,
        }, [
          c.header_render ? c.header_render(h) : c.label,

        ])));

      scope['body'] = props => [
        (typeof props.row['options_type'] === 'undefined' || props.row['options_type'] !== data_options_type_enums.DELETE) ? h('q-tr', {
            // props,
            staticClass: "cursor-pointer pp-selected-bg-grey-4-hover",
            'class': {
              'pp-selected-bg-grey-4-selected': this.selected_rows && this.selected_rows.length > 0 && this.selected_rows[0]['column_name'] === props.row['column_name']
            },
            nativeOn: {
              click: () => {
                this.selected_rows = []
                this.selected_rows.push(props.row)
              }
            },
          }, [this.table_columns.map(column => h('q-td', {
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
          ])),
            h(TableDdlRowMenu, {
              refs: 'TableDdlRowMenu',
              props: {
                row: props.row,
                readonly: props.row['readonly'] || false || (default_table_columns.some(col => col === props.row.column_name) && (props.row.online_column_name ? true : false)),
                disable: this.disabled,
                past: this.copy_row ? true : false
              },
              on: {
                add_new_row: () => {
                  this.add_table_column_row()
                },
                insert_new_row: (v) => {
                  this.add_table_column_row(v)
                },
                delete_cur_row: (v) => {
                  this.delete_table_column(v)
                },
                copy_cur_row: (v) => {
                  this.copy_row = extend(true, {}, v)
                },
                paste_cur_row: () => {
                  if (this.copy_row) {
                    this.copy_row['options_type'] = data_options_type_enums.ADD
                    let index = 0;
                    for (let i = 0; i < this.rows.length; i++) {
                      if (this.rows[i].column_name === this.selected_rows[0].column_name) {
                        index = i;
                        break;
                      }
                    }
                    if (index == this.rows.length - 1 && !this.rows[index].type_name) {
                      this.rows.splice(index, 0, {...this.copy_row})
                    } else {
                      this.rows.splice(index + 1, 0, {...this.copy_row})
                    }

                    this.is_updating = true
                    this.get_ddl_sql()
                  }
                },
                move_up: (v) => {
                  this.move_select_row(true, v)
                },
                move_down: (v) => {
                  this.move_select_row(false, v)
                },
                click: (v) => {
                  this.selected_rows = []
                  this.selected_rows.push(props.row)
                }
              },
            }),
          ]
        ) : null
      ]
    },

    render_index_scope_slot(h) {
      let scope = {};
      scope['header'] = (props) => h('q-tr', {
        props,
      }, this.index_table_columns.map(c =>
        h('q-td', {
          staticClass: 'font-13 text-faded text-weight-medium',
          'class': [c.label_bg, `text-${c.align || 'center'}`],
          props,
          ...c.renderData,
          key: c.name,
        }, [
          c.header_render ? c.header_render(h) : c.label,

        ])));

      scope['body'] = props => [
        (typeof props.row['options_type'] === 'undefined' || props.row['options_type'] !== data_options_type_enums.DELETE) ? h('q-tr', {
            // props,
            staticClass: "cursor-pointer pp-selected-bg-grey-4-hover",
            'class': {
              'pp-selected-bg-grey-4-selected': this.selected_index_rows && this.selected_index_rows.length > 0 && this.selected_index_rows[0]['index_name'] === props.row['index_name']
            },
            nativeOn: {
              click: () => {
                this.selected_index_rows = []
                this.selected_index_rows.push(props.row)
              }
            },
          }, [this.index_table_columns.map(column => h('q-td', {
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
          ])),
            h(TableIndexRowMenu, {
              refs: 'TableIndexRowMenu',
              props: {
                row: props.row,
                readonly: props.row['readonly'] || props.row.index_type === 'PRIMARY' || false,
                disable: this.disabled,
                past: this.copy_row ? true : false
              },
              on: {
                delete_cur_row: (v) => {
                  this.delete_index_row(v)
                },
                click: (v) => {
                  this.selected_index_rows = []
                  this.selected_index_rows.push(props.row)
                }
              },
            }),
          ]
        ) : null
      ]
      return scope
    },
    render_index_relation_columns_scope_slot(h) {
      let scope = {};
      scope['header'] = (props) => h('q-tr', {
        props,
      }, this.index_relations_column_columns.map(c =>
        h('q-td', {
          staticClass: 'font-13 text-faded text-weight-medium',
          'class': [c.label_bg, `text-${c.align || 'center'}`],
          props,
          ...c.renderData,
          key: c.name,
        }, [
          c.header_render ? c.header_render(h) : c.label,

        ])));

      scope['body'] = props => [
        (typeof props.row['options_type'] === 'undefined' || props.row['options_type'] !== data_options_type_enums.DELETE) && props.row.column_name ? h('q-tr', {
            // props,
            staticClass: "cursor-pointer pp-selected-bg-grey-4-hover",
          }, [this.index_relations_column_columns.map(column => h('q-td', {
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
          ])),
          ]
        ) : null
      ]
      return scope
    },
    __render_bottom_row_scope_slot(h, scope) {
    },
    render_tools_bar(h) {
      return h('div', {
        staticClass: 'bg-grey-3 items-center',
      }, [
        this.render_tools_bar_top(h),
        this.render_tools_bar_bottom(h),
      ])
    },
    render_tools_bar_bottom(h) {
      return h('div', {
        staticClass: 'row no-wrap bg-grey-3 col-grow q-pa-sm',
        style: {
          width: '100%',
          height: '40px'
        }
      }, [
        h('div', {
          staticClass: 'col-grow'
        }, []),
        h('div', {
          staticClass: 'row no-wrap items-center',
        }, [
          h('q-btn', {
            staticClass: 'no-ripple shadow-0 font-13 q-ml-sm',
            style: {
              // height: '20px'
            }, props: {
              flat: false,
              label: '保存',
              disable: (!this.is_updating && !this.input_table_name || this.input_table_name === null || this.disabled),
              color: (this.is_updating && !(!this.input_table_name || this.input_table_name === null) && !this.disabled) ? 'primary' : 'faded',
            },
            on: {
              click: () => {
                if (this.is_updating) {
                  this.table_columns_check_error = {
                    error: false,
                    msg: null
                  }
                  let ddl = this.get_ddl_sql()
                  this.$store.state.home.ddl_save_check = true
                  let vm = this
                  setTimeout(() => {
                    vm.$store.state.home.ddl_save_check = false

                    if (!this.ddl_check_error) {
                      //检查dll语法没有问题，提交
                      this.$emit('sql_confirm', {
                        datasource_id: this.datasource_id,
                        db: this.db,
                        sql: ddl
                      })
                    }
                  }, 100)
                }
              }
            }
          }),
          h('q-btn', {
            staticClass: 'no-ripple shadow-0 font-13 q-ml-sm',
            style: {
              // height: '20px'
            }, props: {
              flat: false,
              label: '撤销',
              disable: (!this.is_updating && !this.input_table_name || this.input_table_name === null || this.disabled),
              color: (this.is_updating && !(!this.input_table_name || this.input_table_name === null) && !this.disabled) ? 'orange-7' : 'faded',

            },
            on: {
              click: () => {
                this.selected_index_rows = []
                this.get_ddl_info()
              }
            }
          }),
        ])
      ])
    },
    render_tools_bar_top(h) {
      return h('div', {
        staticClass: 'row items-center text-left full-height bg-grey-3',
        style: {
          minHeight: '40px',
          // border: 'solid 3px var(--q-color-grey-4)',

        }
      }, [
        h('div', {
          staticClass: 'row no-wrap col-grow items-center'
        }, [
          h('div', {
            staticClass: 'q-mr-sm font-13 text-weight-medium'
          }, ["表名:"]),

          h('q-input', {
            'class': {
              'pp-input-error-border': this.table_name_check_error.error
            },
            style: {
              minWidth: '300px'
            },
            attrs: {
              maxLength: 64
            },
            on: {
              input: (v) => {
                this.is_updating = true
                this.new_table = v
                this.table_name_check_error = table_name_check(this.input_table_name)
                setTimeout(() => {
                  this.$refs.table_name_tooltip && this.$refs.table_name_tooltip.show()
                }, 100)
                this.get_ddl_sql()
              }
            },
            props: {
              value: this.input_table_name,
              hideUnderline: true,
              placeholder: '请输入表名',
              disable: this.disabled,
            },
          }, [
            this.table_name_check_error.error ? h('q-tooltip', {
              ref: 'table_name_tooltip',
              props: {offset: [5, 5]}
            }, this.table_name_check_error.msg) : null
          ]),
          h('div', {
            staticClass: 'font-13 text-weight-medium q-ml-md'
          }, ["执行引擎:", h('span', {
            staticClass: 'text-faded q-ml-sm'
          }, ['InnoDB']),]),
          h('div', {
            staticClass: 'q-ml-md font-13 text-weight-medium q-mr-sm',
          }, ["字符集:"]),
          h(MysqlCharsetSelector, {
            style: {
              width: '100px',
              height: '30px'
            },
            props: {
              value: charset_type_enum[this.new_table_charset ? this.new_table_charset : this.table_charset],
              disable: this.disabled || this.type === DDLType.AlterTable
            },
            on: {
              input: (v) => {
                this.new_table_charset = v.value
                this.is_updating = true
                this.get_ddl_sql()
              }
            }
          }),
          h('div', {
            staticClass: 'q-mr-sm font-13 text-weight-medium q-ml-md',
          }, ["备注:"]),
          h('q-input', {
            staticClass: 'col-grow q-mr-md',
            'class': {
              'pp-input-error-border': this.table_remarks_check_error.error
            },
            attrs: {
              maxLength: 256
            },
            on: {
              input: (v) => {
                this.is_updating = true
                this.new_table_remarks = v
                this.table_remarks_check_error = table_remarks_check(v)
                this.get_ddl_sql()
              }
            },
            props: {
              value: this.new_table_remarks ? this.new_table_remarks : this.table_remarks,
              hideUnderline: true,
              placeholder: '请输入备注信息',
              disable: this.disabled,
            },
          }, [
            this.table_remarks_check_error.error ? h('q-tooltip', {
              ref: 'table_remarks_tooltip',
              props: {offset: [5, 5]}
            }, this.table_remarks_check_error.msg) : null
          ]),
        ]),
      ])
    },
    table_ddl_column(is_edit_table) {
      this.table_columns = [
        {
          name: 'column_name', align: 'left', field: 'column_name',
          label: '字段名称', label_bg: '',
          renderData: {},
          render: (h, props) => h(CompTableEditFieldTypeInput, {
            staticClass: ' ',
            props: {
              value: props.row['column_name'],
              field: props.row,
              field_name: 'column_name',
              field_desc: '字段名称',
              disable: this.disabled || (props.row['readonly'] || false) || (default_table_columns.some(col => col === props.row.column_name) && (props.row.online_column_name ? true : false)),
              datasource_type: this.datasource_type
            },
            on: {
              input: v => {
                this.input_event(props, 'column_name', data_options_type_enums.UPDATE, v)
              },
              table_column_check_error: (v) => {
                this.table_columns_check_error = v
              }
            }
          })
        },
        {
          name: 'type_name', align: 'left', field: 'type_name',
          label: '字段类型', label_bg: '',
          renderData: {
            'class': {
              'pp-background-grey-2': true,
              'text-left': true,
            }
          },
          render: (h, props) => h(CompTableEditFieldTypeInput, {
            staticClass: ' ',

            props: {
              value: props.row['type_name'],
              field: props.row,
              field_name: 'type_name',
              field_desc: '字段类型',
              disable: this.disabled || (props.row['readonly'] || false) || (default_table_columns.some(col => col === props.row.column_name) && (props.row.online_column_name ? true : false)),
              datasource_type: this.datasource_type,

            },
            on: {
              input: v => {
                this.input_event(props, 'type_name', data_options_type_enums.UPDATE, v)
              },
              table_column_check_error: (v) => {
                this.table_columns_check_error = v
              }
            }
          })
        },
        {
          name: 'is_primary_key', align: 'left', field: 'is_primary_key',
          label: '主键', label_bg: '',
          renderData: {},
          render: (h, props) => h(CompTableEditFieldTypeInput, {
            staticClass: ' ',

            props: {
              value: props.row['is_primary_key'],
              field: props.row,
              field_name: 'is_primary_key',
              disable: true,
              datasource_type: this.datasource_type,

            },
            on: {
              input: v => {
                this.input_event(props, 'is_primary_key', data_options_type_enums.UPDATE, v)
                this.update_index_rows_for_primary(props.row.column_name, v)
              },
              table_column_check_error: (v) => {
                this.table_columns_check_error = v
              }
            }
          })
        },
        {
          name: 'is_nullable', align: 'left', field: 'is_nullable',
          label: '非空', label_bg: 'bg-grey-2',
          renderData: {
            'class': {
              'bg-grey-2': true,
              'text-left': true,
            }
          },
          render: (h, props) => h(CompTableEditFieldTypeInput, {
            staticClass: ' ',

            props: {
              value: !props.row['is_nullable'],
              field: props.row,
              field_name: 'is_nullable',
              disable: this.disabled || (props.row['readonly'] || false) || (default_table_columns.some(col => col === props.row.column_name) && (props.row.online_column_name ? true : false)),
              datasource_type: this.datasource_type,

            },
            on: {
              input: v => {
                this.input_event(props, 'is_nullable', data_options_type_enums.UPDATE, !v)
              },
              table_column_check_error: (v) => {
                this.table_columns_check_error = v
              }
            }
          })
        },
        {
          name: 'is_autoincrement', align: 'left', field: 'is_autoincrement',
          label: '自增', label_bg: '',
          renderData: {
            'class': {
              'text-left': true,
            }
          },
          render: (h, props) => h(CompTableEditFieldTypeInput, {
            staticClass: ' ',

            props: {
              value: props.row['is_autoincrement'],
              field: props.row,
              field_name: 'is_autoincrement',
              disable: this.disabled || (props.row['readonly'] || false) || (default_table_columns.some(col => col === props.row.column_name) && (props.row.online_column_name ? true : false)),
              datasource_type: this.datasource_type,

            },
            on: {
              input: v => {
                this.input_event(props, 'is_autoincrement', data_options_type_enums.UPDATE, v)
              },
              table_column_check_error: (v) => {
                this.table_columns_check_error = v
              }
            }
          })
        },
        {
          name: 'is_unsigned', align: 'left', field: 'is_unsigned',
          label: '无符号', label_bg: 'bg-grey-2',
          renderData: {
            'class': {
              'bg-grey-2': true,
              'text-left': true,
            }
          },
          render: (h, props) => h(CompTableEditFieldTypeInput, {
            staticClass: ' ',
            props: {
              value: props.row['is_unsigned'] || false,
              field: props.row,
              field_name: 'is_unsigned',
              disable: this.disabled || (props.row['readonly'] || false) || (default_table_columns.some(col => col === props.row.column_name) && (props.row.online_column_name ? true : false)),
              datasource_type: this.datasource_type,

            },
            on: {
              input: v => {
                this.input_event(props, 'is_unsigned', data_options_type_enums.UPDATE, v)
              },
              table_column_check_error: (v) => {
                this.table_columns_check_error = v
              }
            }
          })
        },
        {
          name: 'column_def', align: 'left', field: 'column_def',
          label: '默认值', label_bg: '',
          renderData: {
            'class': {
              'text-left': true,
            },
            'style': {
              width: '400px'
            }
          },
          render: (h, props) => h(CompTableEditFieldTypeInput, {
            staticClass: ' ',

            props: {
              value: props.row['column_def'],
              field: props.row,
              field_name: 'column_def',
              field_desc: '默认值',
              disable: this.disabled || (props.row['readonly'] || false) || (default_table_columns.some(col => col === props.row.column_name) && (props.row.online_column_name ? true : false)),
              datasource_type: this.datasource_type,

            },
            on: {
              input: v => {
                this.input_event(props, 'column_def', data_options_type_enums.UPDATE, v)
              },
              table_column_check_error: (v) => {
                this.table_columns_check_error = v
              }
            }
          })
        },
        {
          name: 'remarks', align: 'left', field: 'remarks',
          label: '备注', label_bg: '',
          renderData: {
            'class': {
              'pp-background-grey-2': true,
              'text-left': true,
            }
          },
          render: (h, props) => h(CompTableEditFieldTypeInput, {
            staticClass: ' ',

            props: {
              value: props.row['remarks'],
              field: props.row,
              field_name: 'remarks',
              field_desc: '备注',
              disable: this.disabled || (props.row['readonly'] || false) || (default_table_columns.some(col => col === props.row.column_name) && (props.row.online_column_name ? true : false)),
              datasource_type: this.datasource_type,
            },
            on: {
              input: v => {
                this.input_event(props, 'remarks', data_options_type_enums.UPDATE, v)
              },
              table_column_check_error: (v) => {
                this.table_columns_check_error = v
              }
            }
          })
        },
      ]

      if (is_edit_table) {
        this.table_columns.push(
          {
            name: 'is_online', align: 'left', field: 'is_online',
            label: '已上线',
            renderData: {
              'class': {
                'text-left': true,
              }
            },
            render: (h, props) => h('q-checkbox', {
              staticClass: ' ',
              props: {
                value: props.row['is_online'] || false,
                trueValue: true,
                falseValue: false,
                readonly: true,
                disable: true,
              },
            })
          })
      }

      let check_column = [{
        name: 'select_btn', align: 'left',
        renderData: {
          'style': {
            minWidth: '30px',
            width: '30px'
          },
          'class': {
            'text-left': true,
          }
        }
        ,
        render: (h, props) => h('div', {
          staticClass: 'row items-center text-center full-height',
          on: {
            click: () => {
              this.selected_rows = []
              this.selected_rows.push(props.row)
            }
          }
        }, [
          h('div', {}, [this.selected_rows.some(r => r['column_name'] === props.row['column_name']) ? h('q-icon', {
            props: {
              name: 'play_arrow',
              size: '14px'
            }
          }) : null,]),
        ])
      }]
      this.table_columns = check_column.concat(this.table_columns)

    },
    table_index_column(is_edit_table) {
      this.index_table_columns = [
        {
          name: 'index_select_btn', align: 'left',
          renderData: {
            'style': {
              minWidth: '30px',
              width: '30px'
            },
            'class': {
              'text-left': true,
            }
          },
          render: (h, props) => h('div', {
            staticClass: 'row items-center text-center full-height',
            on: {
              click: () => {
                this.selected_index_rows = []
                this.selected_index_rows.push(props.row)
              }
            }
          }, [
            h('div', {}, [this.selected_index_rows.some(r => r['index_name'] === props.row['index_name']) ? h('q-icon', {
              props: {
                name: 'play_arrow',
                size: '14px'
              }
            }) : null,]),
          ])
        },
        {
          name: 'index_name', align: 'left', field: 'index_name',
          label: '索引名称', label_bg: '',
          renderData: {
            'class': {
              'text-left': true,
            }
          },
          render: (h, props) => h(CompTableIndexFieldTypeInput, {
            props: {
              field_name: 'index_name',
              value: props.row.index_name,
              field_desc: '请选择索引字段',
              field: props.row,
              disable: true
            },
            on: {
              input: v => {
                this.is_updating = true
                this.input_index_event(props, 'index_name', data_options_type_enums.UPDATE, v)
              },
              table_index_check_error: (v) => {
                this.table_index_check_error = v
              }
            }
          })
        },
        {
          name: 'index_type', align: 'left', field: 'index_type',
          label: '索引类型', label_bg: '',
          renderData: {
            'class': {
              'pp-background-grey-2': true,
              'text-left': true,
            }
          },
          render: (h, props) => h(CompTableIndexFieldTypeInput, {
            props: {
              field_name: 'index_type',
              value: props.row.index_type,
              field: props.row,
              disable: this.disabled || props.row.index_name === 'PRIMARY' || props.row.readonly || (props.row.online_index_name ? true : false)
            },
            on: {
              input: v => {
                this.is_updating = true
                this.input_index_event(props, 'index_type', data_options_type_enums.UPDATE, v)
              },
              table_index_check_error: (v) => {
                this.table_index_check_error = v
              }
            }
          })
        },
      ]


      if (is_edit_table) {
        this.index_table_columns.push(
          {
            name: 'is_online', align: 'left', field: 'is_online',
            label: '已上线',
            renderData: {
              'class': {
                'text-left': true,
              }
            },
            render: (h, props) => h('q-checkbox', {
              staticClass: ' ',
              props: {
                value: props.row.online_index_name ? true : false,
                trueValue: true,
                falseValue: false,
                readonly: true,
                disable: true,
              },
            })
          })
      }

      this.index_table_columns.push({
        name: 'auth_space',
        header_render: h => h('div', {staticClass: 'text-right font-14 text-light'}, '关联字段'),
        render: (h) => ''
      })
    },
    add_table_column_row(v) {
      let new_row = {}
      for (let i = 0; i < this.table_columns.length; i++) {
        new_row[this.table_columns[i].field] = null
      }

      new_row['is_primary_key'] = false
      new_row['is_nullable'] = true
      new_row['is_autoincrement'] = false
      new_row['is_unsigned'] = false
      new_row['column_name'] = null
      new_row['options_type'] = data_options_type_enums.ADD

      this.is_updating = true
      if (v) {
        let index = 0;
        for (let i = 0; i < this.rows.length; i++) {
          if (this.rows[i]['column_name'] === v['column_name']) {
            index = i
          }
        }
        this.rows.splice(index + 1, 0, new_row)
      } else {
        this.rows.push(
          new_row
        )
      }

      this.selected_rows = [new_row]
    },

    delete_table_column(row) {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i] === row) {
          if (!this.rows[i]['options_type'] || this.rows[i]['options_type'].value !== data_options_type_enums.ADD.value) {
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
      this.add_default_row()

      this.get_ddl_sql()
    },
    delete_index_row(row) {
      for (let i = 0; i < this.index_rows.length; i++) {
        if (this.index_rows[i] === row) {
          if (!this.index_rows[i]['options_type'] || this.index_rows[i]['options_type'].value !== data_options_type_enums.ADD.value) {
            this.index_rows[i]['options_type'] = data_options_type_enums.DELETE
          } else {
            this.index_rows.splice(i, 1)
          }
        }
      }
      for (let i = 0; i < this.selected_index_rows.length; i++) {
        if (this.selected_index_rows[i] === row) {
          this.selected_index_rows.splice(i, 1)
        }
      }
      this.is_updating = true
      this.add_default_index_row()
      this.get_ddl_sql()
    },
    input_event(props, column_name, options_type, v) {

      if (typeof props.row['options_type'] === 'undefined' || props.row['options_type'] === null) {
        props.row['options_type'] = options_type
      }
      //处理当字段类型变更时，column_def、is_primary、is_unsigned等值初始化
      if (column_name === 'type_name') {
        props.row.column_def = null
        props.row.is_primary_key = false
        props.row.is_unsigned = false
      }

      if (column_name === 'column_def' && v === '' && props.row.type_name.toUpperCase().indexOf("VARCHAR") === -1) {
        v = null
      }

      //非线上字段\非readonly字段 当字段名变化时，如果索引中使用到旧字段，自动改变索引中关联的字段
      if (column_name === 'column_name' && !props.row.is_online && !props.row.readonly) {
        if (v !== props.row[column_name]) {
          let filter_index_rows = this.index_rows.filter(d => !d.online_index_name && !d.readonly && d.index_columns.some(col => col === props.row.column_name))
          for (let index_row of filter_index_rows) {
            replace_item_for_arr(props.row[column_name], v, index_row.index_columns)
          }
        }
      }

      props.row[column_name] = v

      this.is_updating = true
      this.add_default_row()
      this.get_ddl_sql()
    },
    input_index_event(props, column_name, options_type, v) {
      this.selected_index_rows = []
      this.selected_index_rows.push(props.row)

      props.row[column_name] = v
      if (typeof props.row['options_type'] === 'undefined' || props.row['options_type'] === null) {
        props.row['options_type'] = options_type
      }

      this.selected_index_rows[0].index_name = this.get_auto_index_name()

      this.is_updating = true
      this.add_default_index_row()
      this.get_ddl_sql()
    },
    deal_column_order() {
      //重新排列after信息
      let filter_updating_rows = this.rows.filter(d => d.options_type !== data_options_type_enums.DELETE)

      for (let i = 0; i < filter_updating_rows.length; i++) {
        if (i > 0) {
          filter_updating_rows[i]['after'] = filter_updating_rows[i - 1].column_name
        } else {
          filter_updating_rows[i].after = null
          filter_updating_rows[i].before = null
          if (filter_updating_rows.length > 1) {
            filter_updating_rows[i].before = filter_updating_rows[1].column_name
          }
        }
      }
    },
    add_default_row() {
      if (this.rows && this.rows.length > 0) {
        let filter_rows = this.rows.filter(r => r.options_type !== data_options_type_enums.DELETE)
        if (filter_rows.length <= 0) {
          this.rows.push(extend(true, {}, default_row))
        } else if (filter_rows[filter_rows.length - 1].column_name != null) {
          this.rows.push(extend(true, {}, default_row))
        }
      } else {
        this.rows.push(extend(true, {}, default_row))
      }
    },
    add_default_index_row() {
      if (this.index_rows.length < 8) {
        if (this.index_rows && this.index_rows.length > 0) {
          let filter_rows = this.index_rows.filter(r => r.options_type !== data_options_type_enums.DELETE)
          if (filter_rows.length <= 0) {

            this.index_rows.push(extend(true, {}, default_index_row))
          } else if (filter_rows[filter_rows.length - 1].index_name != null) {
            this.index_rows.push(extend(true, {}, default_index_row))
          }
        } else {
          this.index_rows.push(extend(true, {}, default_index_row))
        }
      }

    },
    get_ddl_sql() {
      this.deal_column_order()
      let sql = get_ddl_sql_builder(this.table_name && this.table_name.length > 0 ? DDLType.AlterTable : DDLType.CreateTable, this.online_rows, this.rows, this.old_table, this.new_table, this.new_table_charset, this.new_table_remarks, this.online_index_rows, this.index_rows)
      this.$emit("ddl_sql", sql)
      return sql
    },
    move_select_row(is_up, row) {
      let index = 0
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i]['column_name'] === row['column_name']) {
          index = i
        }
      }
      if (!row.options_type || row.options_type.value !== data_options_type_enums.ADD.value) {
        row.options_type = data_options_type_enums.UPDATE
      }

      if (is_up) {
        if (index > 0) {
          if (index > 1) {
            this.rows.splice(index - 1, 0, {
              ...row,
              after: this.rows[index - 2]['column_name'],
              before: null,
            })
          } else if (index === 1) {
            this.rows.splice(index - 1, 0, {
              ...row,
              before: this.rows[index - 1]['column_name'],
              after: null
            })
          }
          this.rows.splice(index + 1, 1)
        }

      } else {
        if (index < this.rows.length - 1) {
          this.rows.splice(index + 2, 0, {
            ...row,
            after: this.rows[index + 1]['column_name'],
            before: null,
          })

          this.rows.splice(index, 1)

        }
      }
      this.is_updating = true
      this.get_ddl_sql()
    },

    get_ddl_info() {
      this.is_updating = false
      this.new_row = {}
      this.rows = []
      let vm = this
      this.datasource_id && ajax_get_datasource_sql_options_permission(this.datasource_id).then(d => {
          if (d.status === 1) {
            let permission_options = d.data || []
            this.update_permission = permission_options.some(p => p.option_type === 3) || false
          }
        }
      ).then(() => {
        if (this.table_name && this.table_name.length > 0) {
          ajax_get_datasource_db_table_info(this.datasource_id, this.db, this.table_name).then(d => {
            if (d.status === 1) {
              this.is_updating = false
              this.new_table_remarks = null
              this.new_table_charset = null
              this.new_table = null
              this.old_table = this.table_name
              this.table_remarks = d.data.info.commit
              this.table_charset = d.data.info.character_set
              this.online_rows = d.data.columns
              this.online_index_rows = d.data.index

              this.table_ddl_column(true)
              this.table_index_column(true)
              this.rows = extend(true, [], this.online_rows)
              this.index_rows = extend(true, [], this.online_index_rows)
              this.add_default_row()
              this.add_default_index_row()
              //默认选中索引的最后一行
              if (this.selected_index_rows.length <= 0 && this.index_rows.length > 0) {
                this.selected_index_rows = []
                this.selected_index_rows.push(this.index_rows[this.index_rows.length - 1])
              }
              this.get_ddl_sql()
            }

          })
        } else {
          this.old_table = null
          this.table_charset = null
          this.table_remarks = null
          this.new_table_charset = 'utf8mb4'
          this.table_ddl_column(false)
          this.table_index_column(false)
          this.rows = extend(true, [], new_table_rows)
          this.index_rows = extend(true, [], new_table_index_rows)
          this.add_default_row()
          this.add_default_index_row()
          //默认选中索引的最后一行
          if (this.selected_index_rows.length <= 0 && this.index_rows.length > 0) {
            this.selected_index_rows = []
            this.selected_index_rows.push(this.index_rows[this.index_rows.length - 1])
          }
          this.get_ddl_sql()
        }
      })
    },
    render_section_list(h) {
      return h('div', {staticClass: 'row no-wrap scroll'}, [
        h(SideNavigator, {
          props: {value: this.setting, distinct_key: 'key', options: setting_tabs},
          style: {width: '40px', flexShrink: 0},
          scopedSlots: {item: (props, selected) => this.render_tab(h, props)},
          on: {select: v => this.setting = v}
        }),
      ])
    },
    render_tab(h, tab) {
      return h('div', {
        staticClass: 'q-mr-sm text-center',
      }, tab.label)
    },
    render_edit_index(h) {
      return h('div', {
        staticClass: 'col-grow row no-wrap'

      }, [
        h('q-table', {
          staticClass: 'col-grow shadow-0 no_scroll_bar',
          style: {
            overflow: 'none'
          },
          props: {
            dense: true,
            separator: 'horizontal',
            color: 'primary',
            data: this.index_rows,
            //selection: "multiple",
            //selected: this.selected_rows,
            columns: this.index_table_columns,
            rowKey: 'id',
            pagination: this.pagination_ctl,
            rowsPerPageOptions: [],
            noDataLabel: '无记录',
            rowsPerPageLabel: this.rowsPerPageLabel,
            hideBottom: true
          },
          scopedSlots: this.render_index_scope_slot(h),
          on: {request: this.__request}
        }),
        h('div', {
          style: {
            borderLeft: 'solid 1px var(--q-color-grey-3)',
            minWidth: '250px'
          }
        }, [
          h(LazyInput, {
            style: {
              margin: '3px',
            },
            props: {value: this.search_column_kw, placeholder: '按名称查找', width: '100%'},
            on: {
              input: v => {
                this.search_column_kw = v;
                this.$nextTick(this.refresh_catalog)
              }
            }
          }),
          h('q-table', {
            ref: 'Q_TABLE_INDEX_COLUMNS',
            staticClass: 'col-grow shadow-0 no_scroll_bar scroll',
            style: {
              overflow: 'none',
              borderTop: 'solid 1px var(--q-color-grey-3)',
              maxHeight: '400px'
            },
            props: {
              dense: true,
              separator: 'horizontal',
              color: 'primary',
              data: this.index_relation_rows,
              columns: this.index_relations_column_columns,
              rowKey: 'id',
              pagination: this.pagination_ctl,
              rowsPerPageOptions: [],
              noDataLabel: '无记录',
              rowsPerPageLabel: this.rowsPerPageLabel,
              hideBottom: true
            },
            scopedSlots: this.render_index_relation_columns_scope_slot(h),
            on: {request: this.__request}
          }),
        ])
      ])
    },
    get_index_column_order(value, rows) {
      let index = get_index_of_arr(value, rows)
      if (index !== -1) {
        return index + 1;
      }
      return null
    },
    update_index_column_order(order, column_name) {
      if (this.selected_index_rows && this.selected_index_rows.length > 0) {
        let index_columns = this.selected_index_rows[0].index_columns

        if (!index_columns.some(d => d === column_name)) {
          return
        }

        let index_of_column = get_index_of_arr(column_name, index_columns)

        if (order < 1) {
          index_columns.splice(index_of_column, 1)
          index_columns = [column_name].concat(index_columns)
        } else if (order > index_columns.length) {
          index_columns.splice(index_of_column, 1)
          index_columns.push(column_name)
        } else {
          index_columns.splice(index_of_column, 1)
          if (order > index_columns.length) {
            index_columns.push(column_name)
          } else {
            index_columns.splice(order - 1, 0, column_name)
          }
        }
      }
    },
    update_index_rows_for_primary(column_name, v) {
      if (column_name) {
        for (let i = 0; i < this.index_rows.length; i++) {
          if (this.index_rows[i].index_name === 'PRIMARY') {
            if (v) {
              this.index_rows[i].index_columns.push(column_name)
            } else {
              remove_item_from_arr(column_name, this.index_rows[i].index_columns)
            }
          }
        }
      }
    },
    update_ddl_rows_for_primary(column_name, v) {
      if (column_name) {
        for (let i = 0; i < this.rows.length; i++) {
          if (this.rows[i].column_name === column_name) {
            if (v) {
              this.rows[i].is_primary_key = true
            } else {
              this.rows[i].is_primary_key = false
            }
          }
        }
      }
    },
    get_auto_index_name() {
      //自动生成索引名称
      if (this.selected_index_rows[0].index_type === 'PRIMARY') {
        return 'PRIMARY'
      }

      let index_name = this.selected_index_rows[0].index_columns.length > 0 ? ((this.selected_index_rows[0].index_type === 'UNIQUE' ? "uniq_" : "idx_") + this.selected_index_rows[0].index_columns.join("_")) : ""

      if (index_name.length > 50) {
        index_name = index_name.substring(0, 50)
        index_name += ("_" + (new Date()).getTime())
      }

      return index_name
    }
  },
  mounted() {
    this.table_ddl_column(true)
    this.table_index_column(true)
    this.index_relations_column_columns = [
      {
        name: 'selected_check_box', align: 'left',
        renderData: {
          'style': {
            minWidth: '30px',
            width: '30px'
          },
          'class': {
            'text-left': true,
          }
        },
        render: (h, props) => h('q-checkbox', {
          staticClass: 'no-ripple',
          props: {
            value: this.selected_index_rows && this.selected_index_rows.length > 0 && this.selected_index_rows[0].index_columns.some(d => d === props.row.column_name) ? true : false,
            trueValue: true,
            falseValue: false,
            readonly: this.disabled || this.selected_index_rows.length <= 0 || (this.selected_index_rows[0].index_columns.length >= 5 && !this.selected_index_rows[0].index_columns.some(d => d === props.row.column_name)),
            disable: this.disabled || this.selected_index_rows.length <= 0 || (this.selected_index_rows[0].index_columns.length >= 5 && !this.selected_index_rows[0].index_columns.some(d => d === props.row.column_name)),
          },
          on: {
            input: v => {
              this.is_updating = true
              if (this.selected_index_rows[0].online_index_name) {
                this.selected_index_rows[0].options_type = data_options_type_enums.UPDATE
              }

              if (v) {
                this.selected_index_rows[0].index_columns.push(props.row.column_name)
              } else {
                remove_item_from_arr(props.row.column_name, this.selected_index_rows[0].index_columns)
              }
              if (this.selected_index_rows[0].index_type === 'PRIMARY') {
                this.update_ddl_rows_for_primary(props.row.column_name, v)
              }
              this.selected_index_rows[0].index_name = this.get_auto_index_name()
              this.add_default_index_row()
              this.get_ddl_sql()

            }
          }
        })
      },
      {
        name: 'column_name', align: 'left', field: 'column_name',
        label: '字段名', label_bg: '',
      },
      {
        name: 'order_num', align: 'left', field: 'order_num',
        label: '顺序', label_bg: '',
        renderData: {
          'class': {
            'pp-background-grey-2': true,
            'text-left': true,
          },
          'style': {
            width: '30px'
          }
        },
        render: (h, props) => h('span', {}, [
          props.row.order_num || null
        ])
      },
    ]
    this.get_ddl_info()
  },
  activated() {
    this.rows = []
  },
  render(h) {
    return h('div', {}, [
      this.render_tools_bar_top(h),
      h('div', {
        staticClass: 'row no-wrap'
      }, [
        this.render_section_list(h),
        this.setting.label === setting_tabs[0].label ?
          h('div', {
            staticClass: 'col-grow'
          }, [
            h('q-table', {
              staticClass: 'shadow-0 no_scroll_bar',
              style: {
                overflow: 'none'
              },
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
                rowsPerPageOptions: [],
                noDataLabel: '无记录',
                rowsPerPageLabel: this.rowsPerPageLabel,
                hideBottom: true
              },
              scopedSlots: this.__render_scope_slot(h),
              on: {request: this.__request}
            }),
          ]) : this.render_edit_index(h),

      ]),
      this.render_tools_bar_bottom(h),
    ])
  }
}
