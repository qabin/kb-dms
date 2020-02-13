import CatalogBase from "../../components/catalog/MixinCatalogBase";
import CompTableEditFieldTypeInput from "./comp_table_edit_field_type_input";
import {ajax_get_datasource_db_table_field} from "../../api/config/datasource_api";
import {data_options_type_enums} from "../../utils/sql_editor_dictionary";

export default {
  name: 'comp_table_info_columns_catalog',
  props: {
    datasource_id: [String, Number],
    db: [String],
    table_name: {
      type: [String],
      default: ""
    },
    datasource_type: {
      type: [Number],
    }
  },
  mixins: [CatalogBase],
  data: () => ({
    table_columns: [
      {
        name: 'select_btn', align: 'left', field: 'select_btn',
        label: '', label_bg: '',
        renderData: {
          style: {
            width: '40px',
          }
        },
        render: (h, props) => h('span', {}, [])
      },
      {
        name: 'column_name', align: 'left', field: 'column_name',
        label: '字段名称', label_bg: '',
        renderData: {},
        render: (h, props) => h('span', {
          staticClass: ' ',
        }, [props.row['column_name']])
      },
      {
        name: 'type_name', align: 'left', field: 'type_name',
        label: '字段类型',
        renderData: {
          'class': {
            'bg-grey-2': true,
            'text-left': true,
          }
        },
        render: (h, props) => h('span', {
          staticClass: ' ',
        }, [props.row['type_name']])
      },
      {
        name: 'is_primary_key', align: 'left', field: 'is_primary_key',
        label: '主键', label_bg: '',
        renderData: {
          'class': {},
          'style': {
            width: '30px'
          }
        },
        render: (h, props) => h(CompTableEditFieldTypeInput, {
          staticClass: ' ',
          props: {
            value: props.row['is_primary_key'],
            field: props.row,
            field_name: 'is_primary_key',
            disable: true,
            no_enter_icon: props.row['kb-dms_add_row_by_tab'] || false,
            datasource_type: this.datasource_type,

          },
        })
      },
      {
        name: 'is_nullable', align: 'left', field: 'is_nullable',
        label: '非空',
        renderData: {
          'class': {
            'bg-grey-2': true,
            'text-left': true,
          },
          'style': {
            width: '30px'
          }
        },
        render: (h, props) => h(CompTableEditFieldTypeInput, {
          staticClass: ' ',
          props: {
            value: !props.row['is_nullable'],
            field: props.row,
            field_name: 'is_nullable',
            disable: true,
            no_enter_icon: props.row['kb-dms_add_row_by_tab'] || false,
            datasource_type: this.datasource_type,

          },
        })
      },
      {
        name: 'is_autoincrement', align: 'left', field: 'is_autoincrement',
        label: '自增',
        renderData: {
          'class': {},
          'style': {
            width: '30px'
          }
        },
        render: (h, props) => h(CompTableEditFieldTypeInput, {
          staticClass: ' ',
          props: {
            value: props.row['is_autoincrement'],
            field: props.row,
            field_name: 'is_autoincrement',
            disable: true,
            no_enter_icon: props.row['kb-dms_add_row_by_tab'] || false,
            datasource_type: this.datasource_type,

          },
        })
      },
      {
        name: 'is_unsigned', align: 'left', field: 'is_unsigned',
        label: '无符号', label_bg: 'bg-grey-2',
        renderData: {
          'class': {
            'bg-grey-2': true,
            'text-left': true,
          },
          'style': {
            width: '30px'
          }
        },
        render: (h, props) => h(CompTableEditFieldTypeInput, {
          staticClass: ' ',
          props: {
            value: props.row['is_unsigned'] || false,
            field: props.row,
            field_name: 'is_unsigned',
            disable: true,
            datasource_type: this.datasource_type,

          },
        })
      },
      {
        name: 'column_def', align: 'left', field: 'column_def',
        label: '默认值', label_bg: '',
        render: (h, props) => h('span', {
          staticClass: ' ',
        }, [props.row['column_def']])
      },
      {
        name: 'remarks', align: 'left', field: 'remarks',
        label: '备注',
        renderData: {
          'class': {
            'bg-grey-2': true,
            'text-left': true,
          }
        },
        render: (h, props) => h('span', {
          staticClass: ' ',
        }, [props.row['remarks']])
      },
    ],
    query_switch: true,
    update_permission: false,
    selected_rows: [],
    pagination_ctl: {
      page: 1,
      rowsNumber: 0,
      rowsPerPage: 10000
    },
    tab_id: null,
    tab_name: null,
    is_edit: false,
    new_row: {},
    is_loading: false,
    order_by_field: null,
    order_by_desc: false,
    new_table_name: null
  }),
  watch: {
    table_name: {
      handler() {
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
          staticClass: 'font-14 text-faded text-weight-bold', 'class': [c.label_bg, `text-${c.align || 'center'}`],
          props, key: c.name
        }, [
          c.header_render ? c.header_render(h) : c.label,

        ])));

      scope['body'] = props => [
        h('q-tr', {
            // props,
            staticClass: "cursor-pointer pp-selected-bg-grey-4-hover"
          }, this.table_columns.map(column => h('q-td', {
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
        ),
      ]
    },
    request() {
      this.rows = []
      let vm = this
      vm.table_name && vm.table_name !== null && vm.table_name.length > 0 && ajax_get_datasource_db_table_field(vm.datasource_id, vm.db, vm.table_name)
        .then(d => {
          if (d.status === 1) {
            this.rows = d.data
            this.rowsNumber = d.data.length || 0;
          }
        })
        .catch(() => {
          this.$q.err('获取数据异常')
        })
    },

  }
  ,
  render(h) {
    return h('div', {
      staticClass: 'scroll',
      style: {
        borderLeft: '1px solid var(--q-color-grey-3)',
        minHeight: '452px',
      }
    }, [
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
          style: {
            maxHeight: '520px'
          },
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
            rowsPerPageOptions: [],
            noDataLabel: '无记录',
            rowsPerPageLabel: this.rowsPerPageLabel,
            hideBottom: true
          },
          scopedSlots: this.__render_scope_slot(h),
          on: {request: this.__request}
        })
    ])
  }
}
