import SelectorMixin from './MixinSelectorBase'
import {datasource_type_enum, datasource_type_options} from "../../utils/config_dictionary";

export default {
  name: 'DatasourceTypeSelector',
  mixins: [SelectorMixin],
  props: {},
  data: () => ({
    filter_distinct_key: 'label',
    distinctKey: 'value',
    auto_close: true
  }),
  methods: {
    render_field_content(h, value) {
      return !value.label
        ? this.__render_placeholder(h)
        : this.render_field_item(h, value)
    },
    render_field_item(h, value) {
      return [
        h('i', {
          staticClass: 'mdi ' + datasource_type_enum[value.value].icon + ' text-' + datasource_type_enum[value.value].color,
          style: {
            fontSize: '22px'
          }
        }),
        h('span', {staticClass: 'q-mr-xs font-13'}, value.label),
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
        h('i', {
          staticClass: 'mdi ' + datasource_type_enum[value.value].icon + ' text-' + datasource_type_enum[value.value].color,
          style: {
            fontSize: '22px'
          }
        }),
        h('span', {staticClass: 'q-ml-xs q-mr-xs font-12  pp-sentence'}, value.label)
      ])

    },
    search() {
      this.raw_options = datasource_type_options
    }
  }
}
