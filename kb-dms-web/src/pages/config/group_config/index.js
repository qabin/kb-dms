import BusGroupCatalog from './comp_group_catalog'
import BusGroupDetail from './comp_group_detail'
import {ajax_add_bus_group} from "../../../api/config/bus_group_api";

export default {
  name: 'group_config_index',
  data: () => ({
    kw: '',
    status: null,
    group_name: null
  }),
  computed: {
    is_admin() {
      return this.$store.state.user.is_admin || false
    }
  },
  methods: {
    render_header(h) {
      return h('div', {
        staticClass: 'row items-center',
        style: {
          height: '36px', minHeight: '36px',
          borderBottom: '1px solid var(--q-color-grey-5)',
        }
      }, [
        h('q-btn', {
          staticClass: 'no-ripple shadow-0 q-ml-sm font-13',
          style: {
            height: '20px'
          },
          props: {
            flat: false,
            label: '新增',
            color: 'primary',
            disable: !this.is_admin
          },
        }, [this.is_admin ? h('q-popover', {
          staticClass: 'font-13 bg-grey-2',
        }, [
          h('div', {
            staticClass: 'q-pa-sm text-weight-bold'
          }, '创建团队'),
          h('q-input', {
            staticClass: 'q-ml-sm q-mr-sm',
            props: {
              placeholder: '请输入团队名称',
              hideUnderline: true,
              value: this.group_name
            },
            on: {
              input: (v) => this.group_name = v
            }
          }, []),
          h('div', {
            staticClass: 'q-pa-sm no-wrap font-12 float-right'
          }, [
            h('q-btn', {
              props: {
                label: '创建',
                color: 'primary',
                flat: true
              },
              directives: [{name: 'close-overlay'}],
              on: {
                click: () => {
                  ajax_add_bus_group(this.group_name).then(d => {
                    if (d.status === 1) {
                      this.$q.ok('创建成功!');

                      this.$refs.group_catalog.refresh_catalog(this.kw);
                    } else {
                      this.$q.err(d.message);
                    }
                  })
                }
              }
            }),
            h('q-btn', {
              props: {
                label: '取消',
                flat: true
              },
              directives: [{name: 'close-overlay'}],
            })])
        ]) : null]),
      ])
    },
    render_body(h) {
      return h('div', {
        staticClass: 'col-grow flex no-wrap'
      }, [
        h(BusGroupCatalog, {
          ref: 'group_catalog',
          props: {kw: this.kw, status: this.status},
          on: {input: this.select_group}
        }),
        h('div', {staticClass: 'bg-grey-5', style: {width: '1px', minWidth: '1px'}}),
        h(BusGroupDetail, {
          staticClass: 'col-grow',
          ref: 'group_detail',
          on: {update: this.refresh_catalog}
        })
      ])
    },
    refresh_catalog() {
      this.$refs.group_catalog.refresh_catalog(this.kw, this.status);
    },
    select_group(v) {
      this.$refs.group_detail.select_group(v)
    }
  },
  render(h) {
    return h('div', {
      staticClass: 'col-grow font-13 column no-wrap',
    }, [
      this.render_header(h),
      this.render_body(h)
    ])
  }
}
