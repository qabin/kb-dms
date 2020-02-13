import ExeResultCatalog from './comp_exe_result_catalog'
import {ajax_get_sql_exe_result} from "../../api/result/sql_exe_result_api";
import {sql_exe_result_status_enum} from "../../utils/result_dictionary";

export default {
  name: 'comp_exe_result',
  data: () => ({
    exe_result_list: [],
    exe_result: null,
    sql_exe_record_id: null,
    timeInterval: null,
  }),
  watch: {
    sql_exe_record_id: {
      immediate: true,
      handler: function (nv, ov) {
        if (nv != null) {
          if (this.timeInterval != null) {
            clearInterval(this.timeInterval)
          }
          setTimeout(() => {
            this.query_sql_exe_result()
            this.timeInterval = setInterval(this.query_sql_exe_result, 1000)
          }, 0)

        }
      }
    }
  },
  methods: {
    render_exe_result_header(h) {
      return h('div', {
        staticClass: 'bg-grey-2 row items-center full-height'
      }, [
        h('span', {
          staticClass: 'text-tertiary q-pa-sm font-13 text-weight-bold'
        }, ['执行结果']),
        h('span', {
          staticClass: 'text-tertiary font-12 text-weight-bold'
        }, ['(最多返回100行)']),
        //this.render_tools_bar_left(h),
        //this.render_tools_bar_right(h)
      ])
    },
    render_tools_bar_left(h) {
      return h('div', {
        staticClass: 'row items-center col-grow text-left full-height'
      }, [
        h('q-icon', {
          staticClass: 'cursor-pointer q-ml-sm',
          props: {
            name: 'delete',
            color: 'negative',
            size: '20px'
          },
          nativeOn: {
            click: () => this.exe_selected_sql()
          }
        }, [h('q-tooltip', {props: {offset: [5, 5]}}, '清空历史')]),
      ])
    },
    render_tools_bar_right(h) {
      return h('div', {
        staticClass: 'row items-center full-height btn-hover'
      }, [])
    },
    render_exe_result_catalog_item(h, result, count) {
      return h('div', {
        staticClass: 'flex no-wrap cursor-pointer text-left items-center q-pa-sm',
        'class': {
          'bg-grey-3': this.exe_result.id === result.id
        },
        key: result.id,
        on: {
          click: () => {
            this.exe_result = result
          }
        }
      }, [
        h('span', {
          staticClass: 'font-13 text-weight-medium',
          style: {
            marginRight: '3px',
            width: '12px'
          },
        }, [count]),
        h('q-icon', {
          style: {
            marginRight: '3px'
          },
          props: {
            name: sql_exe_result_status_enum[result.status].icon,
            color: sql_exe_result_status_enum[result.status].color,
            size: '18px'
          }
        }),
        h('div', {
          staticClass: ' col-grow ellipsis',
        }, result.sql_text),
      ])
    },
    render_exe_result_catalog(h) {
      let count = 1;
      return h('transition', {props: {appear: true, mode: 'out-in', enterActiveClass: 'animate-popup-down'}}, [
        h('div', {
          staticClass: 'font-12 text-left scroll',
          style: {
            borderBottom: '1px solid var(--q-color-grey-3)',
            width: '240px',
            minWidth: '240px',
            maxHeight: '300px'
          }
        }, [this.exe_result_list != null && this.exe_result_list && this.exe_result_list.map(r => [
          this.render_exe_result_catalog_item(h, r, count++),
          h('q-item-separator', {staticClass: 'q-ma-none'})
        ])])
      ])
    },
    query_sql_exe_result() {
      this.exe_result_list = []
      this.sql_exe_record_id && ajax_get_sql_exe_result(this.sql_exe_record_id).then(d => {
        if (d.status === 1) {
          this.exe_result_list = d.data || []
          if (this.exe_result_list.length > 0) {
            if (!this.exe_result_list.some(re => re.status !== 2)) {
              this.$store.state.home.exe_success = true
            }
            this.timeInterval && clearInterval(this.timeInterval)
            this.timeInterval = null
            this.sql_exe_record_id = null
            this.exe_result = this.exe_result_list[0]
          }
        } else {
          this.timeInterval && clearInterval(this.timeInterval)
          this.sql_exe_record_id = null
          this.timeInterval = null
        }
      })
    },
    refresh_sql_exe_record_id(id) {
      this.sql_exe_record_id = id
    },
    data_clear() {
      this.exe_result_list = []
      this.exe_result = null
      this.sql_exe_record_id = null
      this.timeInterval = null
      this.$refs.ExeResultCatalog.data_clear()
    }
  },
  render(h) {
    return h('div', {}, [
      this.render_exe_result_header(h),
      this.timeInterval && this.timeInterval != null ?
        h('div', {
          staticClass: 'items-center full-height',
        }, [
          h('q-spinner-ios', {
            style: {
              marginTop: '50px'
            },
            props: {
              color: 'primary',
              size: '50px'
            }
          })
        ])
        : h('div', {
          staticClass: 'row no-wrap'
        }, [
          this.exe_result_list && this.exe_result_list.length > 1 ? this.render_exe_result_catalog(h) : null,
          h('div', {
            staticClass: 'col-grow column scroll'
          }, [
            h(ExeResultCatalog, {
              ref: 'ExeResultCatalog',
              style: {
                width: '100%'
              },
              props: {
                exe_result: this.exe_result,
              },
              on: {
                sql_confirm: (v) => {
                  this.$emit('sql_confirm', v)
                }
              }
            }),
          ])
        ])
    ])
  },
  mounted() {

  }
}
