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
  name: 'pp_navigator_table_info',
  props: {
    options: Array,
    value: [Object, String, Number],
    distinct_key: String,
    disable: Boolean
  },
  data: () => ({pointer_pos: 0}),
  mounted() {
    this.value && this.$nextTick(() => this.select(this.value))
  },
  render(h) {
    return h('div', {
      staticClass: 'bg-grey-3 flex no-wrap relative-position items-center',
      style: {maxHeight: '40px',minHeight:'40px', borderBottom: '1px solid var(--q-color-grey-5)'}
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
      let data = this.disable ? {'class': 'cursor-not-allowed', style: {opacity: 0.4}}
        : same ? {'class': 'text-primary '}
          : {
            'class': 'text-grey-7 pp-selectable-color-blue-4 cursor-pointer',
            on: {click: () => this.select(item)}
          };
      return h('div', {
        staticClass: 'font-13 text-weight-bold q-ml-sm q-mr-sm non-selectable',
        style:{
          height:'100%',
        },
        ...data,
        ref: this.get_key(item)
      }, [
        this.$scopedSlots.item ? this.$scopedSlots.item(item, same) : item,
      ])
    },
    render_triangle(h) {
      return this.pointer_pos ? h('div', {
        staticClass: 'pp-arrow-up absolute',
        style: {left: this.pointer_pos + 'px', bottom: 0, transition: 'left 0.2s'}
      }) : null
    },
    get_key(item) {
      return this.distinct_key ? item[this.distinct_key] : JSON.stringify(item)
    },
    same(item) {
      return this.value && this.get_key(this.value) === this.get_key(item)
    },
    select(item) {
      let el = this.$refs[this.get_key(item)];
      this.pointer_pos = offset(el).left - offset(this.$el).left + parseInt(style(el, 'width')) / 2 - 7;
      this.$emit('select', item)
    }
  }
}
