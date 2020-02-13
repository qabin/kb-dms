import CompAdminCatalog from './comp_admin_catalog'

export default {
  name: 'admin_index',
  data: () => ({}),
  methods: {
    render_admin_options(h) {
      return h('div', {
        staticClass: 'scroll',
        style: {
          paddingLeft: '5px',
          paddingTop: '3px'
        }
      }, [
        h(CompAdminCatalog,{
          ref:'CompAdminCatalog',
        })
      ])
    }
  },
  render(h) {
    return h('div', {
      staticClass: 'col-grow font-13 column no-wrap',

    }, [this.render_admin_options(h)])
  },
  mounted(){
    this.$refs.CompAdminCatalog.refresh()
  }
}
