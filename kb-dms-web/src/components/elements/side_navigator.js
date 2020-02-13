function offset(el) {
  if (el === window) {
    return {top: 0, left: 0}
  }
  let {top, left} = el.getBoundingClientRect();

  return {top, left}
}

function style(el, property) {
  return window.getComputedStyle(el).getPropertyValue(property)
}

export default {
  name: 'pp-side-navigator',
  props: {
    options: Array,
    value: [Object, String, Number],
    distinct_key: String,
    route_mode: Boolean,
    disable: Boolean,
  },
  data: () => ({pointer_pos: 0}),
  activated() {
    this.$nextTick(() => this.select(this.value))
  },
  mounted() {
    this.$nextTick(() => this.select(this.value))
  },
  render(h) {
    return h('div', {
      staticClass: 'column no-wrap relative-position items-center',
      style: {borderRight: '1px solid var(--q-color-grey-4)'}
    }, [
      this.$slots.start,
      (this.options || []).map(op => this.render_item(h, op)),
      this.$slots.after,
      h('div', {staticClass: 'col-grow'}),
      this.$slots.end,
      this.disable ? null : this.render_triangle(h)
    ])
  },
  methods: {
    render_item(h, item) {
      let same = this.same(item);
      let data = this.disable || item.disable ? {'class': 'cursor-not-allowed', style: {opacity: 0.4}} :
        same
          ? {'class': 'text-primary '}
          : {'class': 'text-grey-5 pp-selectable-color-blue-4 cursor-pointer', on: {click: () => this.select(item)}};
      return h('div', {
        staticClass: 'font-13 text-weight-bold q-pa-sm non-selectable',
        ...data,
        ref: item[this.distinct_key]
      }, [
        this.$scopedSlots.item ? this.$scopedSlots.item(item, same) : item.label,
      ])
    },
    render_triangle(h) {
      return this.pointer_pos ? h('div', {
        staticClass: 'pp-arrow-left absolute',
        style: {top: this.pointer_pos + 'px', right: 0, transition: 'top 0.2s'}
      }) : null
    },
    same(item) {
      if (this.distinct_key)
        return this.value[this.distinct_key] === item[this.distinct_key];
      else if (this.route_mode)
        return this.$route.path === item.to;
      else
        return this.value === item
    },
    select(item) {
      if (item) {
        if (this.route_mode) {
          this.$router.push({path: item.to})
        } else if (item[this.distinct_key]) {

          let el = this.$refs[item[this.distinct_key]];
          this.pointer_pos = offset(el).top - offset(this.$el).top + parseInt(style(el, 'height')) / 2 - 7;
          this.$emit('select', item);
          this.$emit('input', item)
        }
      }
    }
  }
}
