import content from './DatasourceSelector'

export default {
  name: 'datasource_table_selector',
  data: () => ({
    datasource: null,
  }),
  props: {
    default_group: {},
    default_datasource: {},
    default_db: {},
    default_table: {},
    placeholder: {type: String, default: '请选择'}
  },
  render(h) {
    return h('div', {
      staticClass: 'pjm-selector relative-position flex no-wrap items-center',
      style: {height: '24px'},
    }, [
      this.datasource ? h('span', {}, this.datasource.name) : h('span', {style: {color: '#979797'}}, this.placeholder),
      h('q-popover', {
        style: {
          maxHeight: '600px',
          maxWidth: '1000px'
        },
        ref: 'pop'
      }, [
        h('div', {
          staticClass: 'font-12 column',
          style: {
            minHeight: '300px',
            height: '300px',
          }
        }, [
          h(content, {
            on: {
              select: (v) => {
                this.datasource = v
                this.$emit('select', v)
                this.$refs.pop.hide()
              }
            }
          })
        ])])
    ])
  }
}
