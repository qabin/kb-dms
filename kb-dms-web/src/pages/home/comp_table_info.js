import Navigator from './pp_navigator_table_info'
import ColumnsCatalog from './comp_table_info_columns_catalog'
import TableDDL from './comp_table_info_ddl'

const setting_tabs = [
  {
    key: 'columns_view',
    label: '字段信息',
    component: (h, datasource_id, db, table_name, datasource_type, vm) => h('div', {staticClass: 'col-grow column no-wrap full-height scroll'}, [
      h(ColumnsCatalog, {
        staticClass: 'col-grow',
        ref: 'ColumnsCatalog',
        props: {
          datasource_id: datasource_id,
          db: db,
          table_name: table_name,
          datasource_type: datasource_type
        },
      })
    ])
  },
  {
    key: 'ddl_view',
    label: 'DDL语句',
    component: (h, datasource_id, db, table_name, datasource_type, vm) => h('div', {staticClass: 'col-grow column no-wrap full-height scroll'}, [
      h(TableDDL, {
        staticClass: 'col-grow',
        props: {
          datasource_id: datasource_id,
          db: db,
          table_name: table_name,
          datasource_type: datasource_type
        },
      })
    ])
  },
];

export default {
  name: 'comp_table_info',
  data: () => ({
    setting: setting_tabs[0],

  }),
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
  methods: {

    render_section_list(h) {
      return h('div', {staticClass: 'col-grow column no-wrap scroll'}, [
        h(Navigator, {
          props: {value: this.setting, distinct_key: 'key', options: setting_tabs},
          scopedSlots: {item: (props, selected) => this.render_tab(h, props)},
          on: {select: v => this.setting = v}
        }),
        this.render_view(h)
      ])
    },
    render_tab(h, tab) {
      return h('div', {
        staticClass: 'q-pl-md q-pr-md q-pt-sm q-pb-sm text-center',
        style: {minWidth: '100px'}
      }, tab.label)
    },
    render_view(h) {
      return h('transition', {
        props: {
          appear: false,
          mode: 'out-in',
          enterActiveClass: 'animated fadeIn'
        }
      }, [
        this.datasource_id ? this.setting.component(h, this.datasource_id, this.db, this.table_name, this.datasource_type, this) : h('div', {staticClass: 'q-ma-md text-light font-13'}, '无数据')
      ])
    },
  },
  render(h) {
    return h('div', {
      staticClass: 'col-grow font-13 row no-wrap',

    }, [
      this.render_section_list(h)
    ])
  }
}
