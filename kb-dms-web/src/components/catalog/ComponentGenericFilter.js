import SelectorMixin from '../../../components/public/selector/MixinSelectorBase'

export default {
  name: 'genericFilter',
  mixins: [SelectorMixin],
  props: {
    label: String,
    optionList: [Array, Function],
    padding: {type: String, default: '3px'}
  },
  data: () => ({
    distinctKey: 'value'
  }),
  computed: {
    isAsync() {
      return typeof this.optionList === 'function'
    }
  },
  methods: {
    /* abstract methods start */
    __render_field(h, value) {
      return this.render_field_content(h, value)
    },
    render_field_content(h, value) {
      return h('div', {
        staticClass: 'flex no-wrap items-center justify-between pp-border-5 pp-radius-4 ',
        style: {padding: this.padding, minWidth: '100px', lineHeight: '26px', transition: 'width 2s'},
      }, [
        h('div', {staticClass: 'text-faded q-mr-sm'}, this.label),
        this.value
          ? [
            h('div', {staticClass: 'text-primary text-weight-bold col-grow'}, value ? value.label : ''),
            this.render_clear_btn(h)
          ]
          : h('q-icon', {
            staticClass: 'text-light font-18 q-mr-xs',
            style: {width: '18px'},
            props: {name: 'keyboard_arrow_down'}
          })
      ]);
    },
    render_clear_btn(h) {
      return h('pp-clear', {
        staticClass:'q-ml-xs q-mr-xs',
        on: {
          click: (e) => {
            e.stopPropagation();
            this.$emit('input', null)
          }
        }
      })
    },
    render_list_content(h, value) {
      return h('div', {staticClass: 'q-pl-xs q-pr-xs font-13 text-dark'}, value.label)
    },
    search() {
      this.isAsync
        ? this.optionList((data = []) => this.raw_options = data.map(s => ({value: s.id, label: s.value})))
        : this.raw_options = this.optionList || []
    }
  }
}
