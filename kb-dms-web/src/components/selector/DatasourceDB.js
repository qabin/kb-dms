import content from './DatasourceDbSelector'

export default {
  name: 'datasource_table_selector',
  data: () => ({
    db: null,
  }),
  props: {
    default_group: {},
    default_datasource: {},
    default_db: {},
    placeholder: {type: String, default: '请选择'}
  },
  watch:{
    default_db: {
      immediate: true,
      handler: function (nv, ov) {
        this.db = nv
      }
    },
  },
  render(h) {
    return h('div', {
      staticClass: 'pjm-selector relative-position flex no-wrap items-center',
      style: {height: '24px'},
    }, [
      this.db ? h('span', {}, this.db) : h('span', {style: {color: '#979797'}}, this.placeholder),
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
            props: {
              default_group: this.default_group,
              default_datasource: this.default_datasource,
              default_db: this.default_db
            },
            on: {
              click: (v) => {
                this.db = v
                this.$emit('select', v)
                this.$refs.pop.hide()
              }
            }
          })
        ])])
    ])
  }
}
