export default {
  name: 'ppSectionCard',
  props: {label: String, animate_key: [String, Number]},
  data: () => ({
    fakeValue: true,
  }),
  watch: {
    animate_key() {
      this.animate_show()
    }
  },
  methods: {
    render_head(h) {
      return h('div', {staticClass: 'flex items-center no-wrap', style: {minHeight: '24px'}}, [
        this.$slots.label || h('div', {staticClass: 'text-weight-bold q-px-xs font-13'}, this.label),
        this.$slots.before,
        h('div', {staticClass: 'col-grow'}),
        this.$slots.after
      ])
    },
    render_content(h) {
      return this.$slots.content
        ? this.$slots.content
        : h('div', {
          staticClass: 'q-pa-sm pp-radius bg-white',
          style: {border: '1px solid #d0d0d0'}
        }, this.$slots.default)
    },

    animate_show() {
      this.$el && this.$el.classList.add('card-animate-pop-down')
    },
    remove_animate() {
      this.$el && this.$el.classList.remove('card-animate-pop-down')
    },
  },
  render(h) {
    return h('transition', {props: {appear: true, mode: 'out-in', enterActiveClass: 'card-animate-pop-down'}}, [
      h('div', {staticClass: ''}, [
        this.render_head(h),
        this.render_content(h)
      ])
    ])

  },
  mounted() {
    this.$nextTick(() => this.$el.addEventListener('animationend', this.remove_animate, false))
  }
}
