import CatalogBase from '../../components/catalog/MixinCatalogBase'
import {ajax_search_sql_exe_result} from "../../api/result/sql_exe_result_api";
import {
  sql_option_type_enum,
  sql_exe_result_status_enum,
  sql_syntax_check_error_enum
} from "../../utils/result_dictionary";
import {datasource_type_enum} from "../../utils/config_dictionary";
import {show_chat_info_detail_modal} from './modal_sql_exe_result_detail'

export default {
  name: 'comp_sql_exe_result_catalog',
  mixins: [CatalogBase],
  data: () => ({
    kw: null,
    query_type: null,
    query_by: null,
    table_columns: [
      {
        name: 'datasource_name', align: 'left', field: 'datasource_name', label: '数据源',
        renderData: {style: {maxWidth: '150px', width: '150px'}, staticClass: 'text-tertiary ellipsis'},
        render: (h, props) => h('div', {
          staticClass: 'ellipsis',
          attrs: {
            title: props.value || '--'
          }
        }, [

          h('i', {
            staticClass: 'mdi ' + datasource_type_enum[props.row.datasource_type].icon + ' text-' + datasource_type_enum[props.row.datasource_type].color,
            style: {
              fontSize: '20px',
              marginRight: '3px'
            }
          }),
          h('span', {
            staticClass: 'text-weight-medium'
          }, [
            props.value
          ])
        ])
      },
      {
        name: 'group_name', align: 'left', field: 'group_name', label: '所属团队',
        renderData: {style: {maxWidth: '100px', width: '100px'}, staticClass: 'text-tertiary ellipsis'},
        render: (h, props) => h('div', {
          staticClass: 'text-weight-medium ellipsis',
          attrs: {
            title: props.value || '--'
          }
        }, [props.value || '--'])
      },
      {
        name: 'db', align: 'left', field: 'db', label: '数据库',
        renderData: {style: {maxWidth: '150px', width: '150px'}, staticClass: 'text-tertiary ellipsis'},
        render: (h, props) => h('div', {
          staticClass: 'text-weight-medium ellipsis',
          attrs: {
            title: props.value || '--'
          }
        }, [props.value || '--'])
      },
      {
        name: 'sql_option_type', align: 'left', field: 'sql_option_type', label: '操作类型',
        renderData: {style: {maxWidth: '50px', width: '50px'}, staticClass: 'text-tertiary'},
        render: (h, props) => h('span', {
          staticClass: 'text-weight-medium text-' + sql_option_type_enum[props.value].color
        }, [props.value && props.value !== null ? sql_option_type_enum[props.value].label : '--'])
      },
      {
        name: 'sql_text', align: 'left', field: 'sql_text', label: 'SQL',
        renderData: {style: {maxWidth: '300px', width: '300px'}, staticClass: 'text-tertiary ellipsis'},
        render: (h, props) => h('div', {
          staticClass: 'ellipsis',
          attrs: {
            title: props.value || '--'
          }
        }, [props.value || '--'])
      },
      {
        name: 'status', align: 'left', field: 'status', label: '执行状态',
        renderData: {style: {maxWidth: '50px', width: '50px'}, staticClass: 'text-tertiary ellipsis'},
        render: (h, props) => h('div', {
          staticClass: 'text-weight-medium text-' + sql_exe_result_status_enum[props.value].color
        }, [sql_exe_result_status_enum[props.value].label || '--'
        ])
      },
      {
        name: 'id', align: 'left', field: 'id', label: '执行结果',
        renderData: {style: {maxWidth: '50px', width: '50px'}, staticClass: 'text-tertiary ellipsis'},
        render: (h, props) => h('div', {
          on: {
            click: () => {
              show_chat_info_detail_modal(props.row)
            }
          }
        }, [
          props && props.row.status !== 1 ? h('span', {
            staticClass: 'text-primary text-weight-medium cursor-pointer'
          }, ['详情']) : null])
      },
      {
        name: 'syntax_error_type', align: 'left', field: 'syntax_error_type', label: '误操作信息',
        renderData: {style: {maxWidth: '100px', width: '100px'}, staticClass: 'text-tertiary ellipsis'},
        render: (h, props) => h('div', {
          staticClass: 'text-' + (props.value && props.value !== null ? sql_syntax_check_error_enum[props.value].color : 'tertiary')
        }, [props.value && props.value !== null ? sql_syntax_check_error_enum[props.value].label : ''])
      },
      {
        name: 'creator_name', align: 'left', field: 'creator_name', label: '操作人',
        renderData: {style: {maxWidth: '50px', width: '50px'}, staticClass: 'text-tertiary ellipsis'},
        render: (h, props) => props.value || '--'
      },
      {
        name: 'create_time', align: 'left', field: 'create_time', label: '执行时间',
        renderData: {style: {maxWidth: '100px', width: '100px'}, staticClass: 'text-tertiary ellipsis'},
        render: (h, props) => props.value || '--'
      },
    ]
  }),
  methods: {
    refresh_kw(v) {
      this.kw = v
      this.request()
    },
    refresh_query_type(v) {
      this.query_type = v
      this.request()

    },
    refresh_query_by(v) {
      this.query_by = v
      this.request()

    },
    request() {
      ajax_search_sql_exe_result(this.kw, this.page, this.size, this.query_by, this.query_type)
        .then(d => {
          if (d.status === 1) {
            this.rows = d.data.data || [];
            this.rowsNumber = d.data.count;
          }
        })
        .catch(() => this.$q.err('获取记录异常'));
    },
  },
  render(h) {
    return h('transition', {props: {appear: true, mode: 'out-in', enterActiveClass: 'animate-popup-down'}}, [
      h('q-table', {
        staticClass: 'shadow-0 pp-border-3 overflow-hidden ' + this.table_class,
        props: {
          dense: false,
          separator: 'horizontal',
          color: 'primary',
          data: this.rows,
          columns: this.table_columns,
          rowKey: 'id',
          pagination: this.pagination_ctl,
          rowsPerPageOptions: [10, 20, 30],
          noDataLabel: '无记录',
          rowsPerPageLabel: this.rowsPerPageLabel,
          hideBottom: !this.rowsNumber,
          hideHeader: !this.rowsNumber
        },
        scopedSlots: this.__render_scope_slot(h),
        on: {request: this.__request}
      })
    ])
  }
}
