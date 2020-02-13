import './pp_section.css'

export default {
  name: 'ppSection',
  props: {
    value: {type: Boolean, default: null},
    label: String,
    collapse: {type: Boolean, default: false},
    fakeValue:{type: Boolean, default: true},
  },
  data: () => ({
    // fakeValue: true,
  }),
  methods: {
    render_head(h) {
      return h('div', {
        staticClass: 'flex items-center no-wrap',
      }, [
        this.label ? h('span', {staticClass: 'text-weight-bold q-pr-sm'}, this.label) : null,
        this.$slots.label,
        this.$slots.before,
        h('div', {
          staticClass: 'col-grow',
          style: {
            background: this.collapse ? 'linear-gradient(to right, var(--q-color-grey-4), var(--q-color-blue-2))' : 'var(--q-color-grey-4)',
            minHeight: '1px',
            height: '1px'
          }
        }),
        this.$slots.after,
        this.collapse ? this.render_collapse_btn(h) : null
      ])
    },
    render_collapse_btn(h) {
      return h('div', {staticClass: 'relative-position', style: {width: '20px', height: '18px'}}, [
        h('q-icon', {
          staticClass: 'text-primary pp-selectable-color-blue-4 cursor-pointer absolute-right icon-toggle',
          'class': {'active-toggle': this.fakeValue, 'inactive-toggle': !this.fakeValue},
          style: {fontSize: '18px'},
          props: {name: 'indeterminate_check_box'},
          nativeOn: {click: this.click}
        }),
        h('q-icon', {
          staticClass: 'text-primary pp-selectable-color-blue-4 cursor-pointer absolute-right icon-toggle',
          'class': {'active-toggle': !this.fakeValue, 'inactive-toggle': this.fakeValue},
          style: {fontSize: '18px'},
          props: {name: 'add_box'},
          nativeOn: {click: this.click}
        })
      ]);
    },
    render_content(h) {
      return h('div', {staticClass: 'q-mt-sm'}, [this.$slots.default])
    },
    click() {
      this.fakeValue = !this.fakeValue;
      this.$emit('input', this.fakeValue)
    }
  },
  render(h) {
    this.value !== null && (this.fakeValue = this.value);
    return h('div', {}, [
      this.render_head(h),
      this.fakeValue ? this.render_content(h) : null
    ])
  }
}
