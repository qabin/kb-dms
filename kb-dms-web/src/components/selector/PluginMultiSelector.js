export default {
  props:{
    value: [Array],
  },
  computed: {
    empty() {
      return !this.value || this.value.length === 0
    }
  },
  methods:{
    __select(v, item) {
      let res = v ? this.value.concat(item) : this.value.filter(i => !this.__is_same(i, item));
      this.$emit('input', res);
    },
    __render_list_content(h, opts = this.options()) {
      if (opts && opts.length > 0) {
        return opts.map(item => {
          return h('q-checkbox', {
            staticClass: 'no-ripple ',
            props: {
              value: this.value && this.value.some(i => this.__is_same(i, item)),
              falseValue: false,
              trueValue: true,
            },
            on: {
              input: v => this.__select(v, item)
            }
          }, [
            this.render_list_content(h, item)
          ])
        })
      } else {
        return this.__render_no_options(h)
      }
    },
  }
}
