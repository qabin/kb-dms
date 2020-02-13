import LazyInput from "../../components/catalog/ComponentLazyInput";
import {sql_exe_result_query_type_enum, sql_exe_result_query_by_enum} from '../../utils/result_dictionary'
import SearchBySelector from './sql_exe_result_search_by_selector'

export default {
  name: 'comp_sql_exe_result_tool_bar',
  data: () => ({
    query_type: 'all',
    query_by: {
      value: 'all',
      label: '所有记录'
    },
    kw: null,
    new_kw: null
  }),
  watch: {
    query_type: {
      immediate: true,
      handler: function (nv, ov) {
        nv && this.$emit('query_type', nv)
      }
    },
    query_by: {
      immediate: true,
      handler: function (nv, ov) {
        nv && this.$emit('query_by', nv.value)
      }
    },
    kw: {
      immediate: true,
      handler: function (nv, ov) {
        this.$emit('kw', nv)
      }
    }
  },
  methods: {
    render_search(h) {
      return h('div', {
        on: {
          keyup: (e) => {
            if (e && e.key === 'Enter') {
              this.$emit('kw', this.new_kw)
            }
          }
        }
      }, [
        h(LazyInput, {
          staticClass: 'pp-search-input items-center',
          style: {
            margin: '3px',
          },
          props: {
            value: this.kw,
            placeholder: '按数据库名称查找',
            width: '100%',
            clearable: false
          },
          on: {
            input: v => {
              this.new_kw = v;
              if (v === null || v.length === 0) {
                this.kw = v
              }
            },
          }

        }, [
          h('q-icon', {
            //slot: 'default',
            staticClass: 'text-faded cursor-pointer pp-selectable-color-primary',
            style: {fontSize: '14px'},
            props: {name: 'keyboard_return'},
            nativeOn: {
              click: () => {
                this.kw = this.new_kw
              }
            }
          })
        ])
      ])
    },

    render_query_type_list_item(h, k) {
      return h('div', {
        staticClass: 'q-pl-sm q-pr-sm items-center row no-wrap font-14 cursor-pointer pp-selectable-color-blue-7 ' + (this.query_type === k ? (' text-weight-bold text-' + sql_exe_result_query_type_enum[k].color) : ''),

        on: {
          click: () => {
            this.query_type = k
          }
        }
      }, [
        h('div', {
          style: {
            borderBottom: this.query_type === k ? '2px solid var(--q-color-' + sql_exe_result_query_type_enum[k].color + ')' : '',
          },
        }, [
          h('span', {}, [sql_exe_result_query_type_enum[k].label])
        ]),
      ])
    },
  },


  render(h) {

    return h('transition', {props: {appear: true, mode: 'out-in', enterActiveClass: 'animate-popup-down'}}, [
      h('div', {}, [
        h('div', {
          staticClass: 'row no-wrap items-center',
        }, [
          h()
        ]),
        h('div', {
          staticClass: 'row no-wrap items-center',
        }, [
          h(SearchBySelector, {
            staticClass: 'font-16 text-weight-bold text-' + sql_exe_result_query_by_enum[this.query_by.value].color,
            props: {
              value: this.query_by,
            },
            on: {
              input: (v) => {
                this.query_by = v
              }
            }
          }),
          Object.keys(sql_exe_result_query_type_enum).map(k => [
            this.render_query_type_list_item(h, k)
          ]),
          this.render_search(h),
        ])
      ])
    ])
  }
}
