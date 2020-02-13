export default {
  data: () => ({
    lazyQueryTimer: null,
    kw: '',
    filter_placeholder: '通过关键字查找',
    filter_icon: 'search',
  }),
  watch: {
    kw(v) {
      if (this.lazyQueryTimer)
        clearTimeout(this.lazyQueryTimer);

      this.lazyQueryTimer = setTimeout(() => {
        this.lazyQueryTimer = null;
        this.search(v)
      }, 300)
    }
  },
  methods: {
    render_list_top(h) {
      return h('q-input', {
        staticClass: 'font-12 q-pl-xs q-pr-xs q-ml-xs q-mr-xs q-mt-xs pp pp-border-4 pp-radius-3 bg-grey-1',
        props: {
          value: this.kw,
          placeholder: this.filter_placeholder,
          hideUnderline: true,
          before: [{icon: this.filter_icon}]
        },
        on: {input: kw => this.kw = kw}
      })
    },
    options() {
      return this.raw_options
    },
    __show() {
      this.kw = '';
      this.raw_options = [];
      this.show()
    },
    show() {

    }
  }
}
