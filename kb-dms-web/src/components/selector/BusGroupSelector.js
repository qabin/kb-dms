import SelectorMixin from './MixinSelectorBase'
import {ajax_bus_group_search} from "../../api/config/bus_group_api"

export default {
  name: 'BusGroupSelector',
  mixins: [SelectorMixin],
  props: {},
  data: () => ({
    filter_distinct_key: 'label',
    distinctKey: 'value',
  }),
  methods: {
    render_field_content(h, value) {
      return !value.label
        ? this.__render_placeholder(h)
        : this.render_field_item(h, value)
    },
    render_field_item(h, value) {
      return [
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
      return h('span', {staticClass: 'q-ml-xs q-mr-xs font-12 pp-sentence'}, value.label)
    },

    search() {
      ajax_bus_group_search(null, 1)
        .then(d => {
          this.raw_options = d.data.map(f => ({value: f.id, label: f.name}))
        })
        .catch(e => this.$q.err('获取团队列表异常'))
    }
  }
}
