import SelectorMixin from './MixinSelectorBase'

import {index_type_options, index_type_options_enum} from "../../utils/edit_ddl_dictionary";

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
          staticClass: 'mdi ' + index_type_options_enum[value.value].icon + ' text-' + index_type_options_enum[value.value].color,
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
    __select(v) {
      if (v.label !== index_type_options[0].label) {
        this.$emit('input', v);
      }
      this.auto_close && this.$refs.popup && this.$refs.popup.hide()
    },
    render_list_content(h, value) {
      return h('div', {}, [
        h('i', {
          staticClass: 'mdi ' + index_type_options_enum[value.value].icon + ' text-' + index_type_options_enum[value.value].color,
          style: {
            fontSize: '22px'
          }
        }),
        h('span', {
          staticClass: 'q-ml-xs q-mr-xs font-12  pp-sentence',
          'class': {
            'disabled': value.label == index_type_options[0].label
          }
        }, value.label)
      ])

    },
    search() {
      this.raw_options = index_type_options
    }
  }
}
