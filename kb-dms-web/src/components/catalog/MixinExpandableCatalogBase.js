import CatalogBase from './MixinCatalogBase'

export default {
  mixins: [CatalogBase],
  methods: {
    render_table_expand(h, props) {

    },
    __render_body_cel_scope_slot(h, scope) {
      scope['body'] = props => [
        h('q-tr', {props}, this.table_columns.map(column => h('q-td', {
            key: column.name,
            ...column.renderData,
            props: {props},
          }, [
            column.render
              ? (
                Array.isArray(column.render)
                  ? column.render.map(r => r.call(this, h, props.row[column.field], props))
                  : column.render.call(this, h, props.row[column.field], props)
              )
              : props.row[column.field] || '--'
          ]))
        ),
        props.expand
          ? h('q-tr', {props, staticClass:'bg-blue-1'}, [
            h('q-td', {attrs: {colspan: '100%'}}, [
              this.render_table_expand(h, props)
            ])
          ])
          : null
      ]
    }
  }
}
