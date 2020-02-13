import SelectorMixin from '../../components/selector/MixinSelectorBase'
import {sql_exe_result_query_by_options, sql_exe_result_query_by_enum} from "../../utils/result_dictionary";

export default {
  name: 'sql_exe_result_search_by_selector',
  mixins: [SelectorMixin],
  data: () => ({
    filter_distinct_key: 'label',
    distinctKey: 'value',
    auto_close: true,
    no_border: true,
  }),
  methods: {
    render_field_content(h, value) {
      return !value.label
        ? this.__render_placeholder(h)
        : this.render_field_item(h, value)
    },
    render_field_item(h, value) {
      return [
        h('span', {}, value.label),
        h('q-icon', {
          props: {
            name: 'keyboard_arrow_right',
            size: '20px',
            color: sql_exe_result_query_by_enum[value.value].color
          }
        })
      ]
    },
    __render_list(h) {
      return h('q-list', {
          staticClass: 'q-pt-xs q-pb-xs column no-border',
          props: {link: true, dense: true}
        }, [this.__render_list_content(h)]
      )
    },

    render_list_content(h, value) {
      return h('div', {}, [
        h('span', {staticClass: 'q-ml-xs q-mr-xs pp-sentence'}, value.label),
      ])

    },
    search() {
      this.raw_options = sql_exe_result_query_by_options
    }
  }
}
