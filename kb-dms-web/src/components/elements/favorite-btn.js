export default {
  name: 'favoriteButton',
  props: {value: Boolean},
  methods: {
    render_star(h) {
      return h('i', {
        staticClass: 'material-icons q-icon',
        on: {
          click: (e) => {
            e.stopPropagation();
            this.$emit('input', !this.value)
          },
        }
      }, this.value ? 'star' : 'star_border')
    }
  },
  render(h) {
    return this.render_star(h)
  }
}
