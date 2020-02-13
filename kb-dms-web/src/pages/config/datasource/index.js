import DatasourceCatalog from './comp_datasource_catalog'
import DatasourceDetail from './comp_datasource_detail'
import DatasourceCreateModal from './modal_datasource_create'
import SectionDatasourcePermission from './section_datasource_permission'
import Navigator from '../../../components/elements/pp_navigator'

const setting_tabs = [
  {
    key: 'base',
    label: '基本配置',
    component: (h, datasource_id, vm) => h('div', {staticClass: 'col-grow column no-wrap scroll q-pa-sm'}, [
      h(DatasourceDetail, {
        staticClass: 'col-grow',
        ref: 'DatasourceDetail',
        props: {
          datasource_id: datasource_id
        },
        on: {
          update: () => {
            vm.$refs.DatasourceCatalog.refresh_catalog()
          }
        }
      })
    ])
  },
  {
    key: 'member',
    label: '人员/权限配置',
    component: (h, datasource_id, vm) => h('div', {staticClass: 'col-grow column no-wrap scroll q-pa-sm bg-grey-1'}, [
      h(SectionDatasourcePermission, {
        staticClass: 'q-ma-sm',
        props: {datasource_id: datasource_id}
      })
    ])
  },
];


export default {
  name: 'datasource_index',
  data: () => ({
    kw: '',
    status: null,
    setting: setting_tabs[0],
    datasource: {}
  }),
  computed: {
    datasource_id() {
      return this.datasource ? this.datasource.id : null
    },
  },
  methods: {
    render_header(h) {
      return h('div', {
        staticClass: 'row items-center',
        style: {
          height: '36px', minHeight: '36px',
          borderBottom: '1px solid var(--q-color-grey-5)',
          borderRight: '1px solid var(--q-color-grey-5)',

        }
      }, [
        h('q-btn', {
          staticClass: 'no-ripple shadow-0 font-13 q-ml-sm',
          style: {
            height: '20px'
          },
          props: {
            flat: false,
            label: '新增',
            color: 'primary',
          },
          on: {click: this.show_create_modal}
        }),
        h(DatasourceCreateModal, {
          ref: 'DatasourceCreateModal',
          on: {
            submit: (v) => {
              this.refresh_catalog(v)
            }
          }
        })
      ])
    },
    render_body(h) {
      return h('div', {
        staticClass: 'col-grow flex no-wrap'
      }, [
        h(DatasourceCatalog, {
          ref: 'DatasourceCatalog',
          props: {kw: this.kw, status: this.status},
          on: {select: this.select_trouble}
        }),
        h('div', {staticClass: 'bg-grey-5', style: {width: '1px', minWidth: '1px'}}),

      ])
    },
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
        this.datasource_id ? this.setting.component(h, this.datasource_id, this) : h('div', {staticClass: 'q-ma-md text-light font-13'}, '无数据')
      ])
    },
    show_create_modal() {
      this.$refs.DatasourceCreateModal.show();
    },
    refresh_catalog(v) {
      this.$refs.DatasourceCatalog.refresh_catalog(v);
    },
    select_trouble(v) {
      this.datasource = v
    }
  },
  render(h) {
    return h('div', {
      staticClass: 'col-grow font-13 row no-wrap',

    }, [
      h('div', {}, [
        this.render_header(h),
        this.render_body(h),
      ]),
      this.render_section_list(h)
    ])
  }
}
