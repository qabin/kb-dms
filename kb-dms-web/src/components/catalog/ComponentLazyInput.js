export default {
  props: {
    value: String,
    placeholder: {type: String, default: '按标题筛选...'},
    delay: {type: Number, default: 300},
    width: {type: [String, Number], default: 300},
    border: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: [Boolean],
      default: true
    }
  },
  data: () => ({
    timer: null,
    fakeValue: ''
  }),
  watch: {
    value(v) {
      this.fakeValue = v;
    }
  },
  methods: {
    input(v) {
      this.fakeValue = v;
      if (this.timer)
        clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.$emit('input', this.fakeValue);
      }, this.delay)

    }
  },
  render(h) {
    return h('q-input', {
      staticClass: 'shadow-0',
      'class': {
        ' pp-border-4 pp-radius-2': this.border ? true : false,
        'pp-no-border pp-no-radius': this.border ? false : true
      },
      style: {padding: '4px', width: this.width + 'px'},
      props: {
        value: this.fakeValue,
        placeholder: this.placeholder,
        hideUnderline: true,
        color: 'primary',
        before: [{icon: 'search'}],
      },
      on: {input: this.input}
    }, [
      this.fakeValue && this.clearable
        ? h('q-icon', {
          slot: 'after',
          staticClass: 'text-faded cursor-pointer pp-selectable-color-primary',
          style: {fontSize: '14px'},
          props: {name: 'cancel'},
          nativeOn: {
            click: () => {
              this.fakeValue = '';
              this.$emit('input', '')
            }
          }
        })
        : null,
      this.$slots.default || null,
    ])
  }
}
