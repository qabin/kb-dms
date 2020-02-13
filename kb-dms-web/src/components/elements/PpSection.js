export default {
  name: 'pp-separator',
  props: {
    label: String,
    collapse: {type: Boolean, default: false},
    hide: {type: Boolean, default: false}
  },
  // data: () => ({
  //   show_content: false,
  // }),
  // activated() {
  //   this.show_content = !this.hide;
  // },
  // deactivated() {
  //   this.show_content = !this.hide;
  // },
  // mounted() {
  //   this.show_content = !this.hide;
  // },
  render(h) {
    let content = [this.render_head(h)];
    !this.hide && content.push(this.render_content(h));
    return h('div', {}, content)
  },
  methods: {
    render_head(h) {
      return h('div',
        {
          staticClass: 'flex items-center',
          'class': {'cursor-pointer': this.collapse},
          style: 'margin-left: 0px',
          on: {click: () => this.toggle_collapse()}
        },
        [
          h('span', {staticClass: 'text-weight-bold q-pr-sm'}, this.label),
          this.$slots.before,
          h('div', {staticClass: 'q-card-separator col-grow'}),
          this.collapse_btn(h)
        ])
    },
    render_content(h) {
      return h('div', {staticClass: 'q-mt-sm'}, this.$slots.default)
    },
    collapse_btn(h) {
      if (this.collapse) {
        return h('q-icon', {
          staticClass: 'text-grey-5',
          style: {fontSize: '18px'},
          props: {name: !this.hide ? 'indeterminate_check_box' : 'add_box'},
        })
      }
    },
    toggle_collapse() {
      if (this.collapse)
        this.hide = !this.hide
    }
  },
}
