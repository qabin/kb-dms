import pop from './PpPopover'

export default {
  props: {
    value: [String, Object, Number, Array],
    fontSize: {type: String, default: '13px'},
    disable: Boolean,
    placeholder: {default: '--'},
  },
  data: () => ({
    distinctKey: null,
    raw_options: [],
    popup_fit: true,
    auto_close: true,
    no_border: false
  }),
  methods: {
    /* abstract methods start */
    render_field_prefix(h, value) {
    },
    render_field_content(h, value) {
    },
    render_field_extend(h, value) {
    },
    render_list_top(h) {
    },
    render_list_content(h, value) {
    },
    options() {
      return this.raw_options
    },
    show() {
      this.search()
    },
    hide() {
      this.raw_options = []
    },
    search() {
      this.raw_options = []
    },
    /* abstract methods end */
    __select(v) {
      this.$emit('input', v);
      this.auto_close && this.$refs.popup && this.$refs.popup.hide()
    },
    __is_same(left, right) {
      if (left && right) {
        if (this.distinctKey) {
          left = left[this.distinctKey];
          right = right[this.distinctKey];
        }
        left = typeof left === 'string' ? left : JSON.stringify(left);
        right = typeof right === 'string' ? right : JSON.stringify(right);
        return left === right
      }
    },
    __render_field(h, value) {
      return value ? this.render_field_content(h, value) : this.__render_placeholder(h)
    },
    __render_placeholder(h) {
      return typeof this.placeholder === 'function'
        ? this.placeholder(h)
        : h('span', {
          style: {color: '#979797', fontSize: this.fontSize, padding: '0 4px'}
        }, this.placeholder);
    },
    __render_list(h) {
      return h('q-list', {
          staticClass: 'q-pt-xs q-pb-xs no-border',
          props: {link: true, dense: true}
        }, [this.__render_list_content(h)]
      )
    },
    __render_list_content(h, opts = this.options(), value, close_overlay = true) {
      value = value || this.value;
      if (opts && opts.length > 0) {
        return opts.map(i => {
          if (this.__is_same(i, value))
            return h(
              'q-item', {
                staticClass: 'bg-blue-2 flex',
                style: {fontSize: this.fontSize, padding: 0, minHeight: '22px'},
              }, [
                this.render_list_content(h, i)
              ]
            );
          else
            return h(
              'q-item', {
                staticClass: 'flex',
                style: {fontSize: this.fontSize, padding: 0, minHeight: '22px'},
                directives: [close_overlay ? {name: 'close-overlay'} : {}],
                nativeOn: {click: () => this.__select(i)}
              }, [
                this.render_list_content(h, i)
              ]
            )
        })
      } else {
        return this.__render_no_options(h)
      }
    },
    __render_no_options(h) {
      return h('span', {
        staticClass: 'text-faded q-ml-xs q-mr-xs',
        style: {fontSize: this.fontSize}
      }, '无数据');
    },
    __show() {
      this.show()
    },
    __hide() {
      this.hide()
    }
  },
  render(h) {
    return h('div', {
        staticClass: 'pjm-selector relative-position flex no-wrap items-center cursor-pointer ' + (this.no_border ? 'no-border' : ''),
        'class': {'cursor-not-allowed': this.disable}
      }, [
        this.render_field_prefix(h, this.value),
        this.__render_field(h, this.value),
        this.render_field_extend(h, this.value),
        this.disable
          ? null
          : h(pop, {
            staticClass: 'pjm-selector-popover pp-border-4 pp-radius-3',
            ref: 'popup',
            props: {fit: this.popup_fit},
            on: {
              show: this.__show,
              hide: this.__hide
            }
          }, [
            this.render_list_top(h),
            this.__render_list(h)
          ]),
      ]
    )
  }
}
