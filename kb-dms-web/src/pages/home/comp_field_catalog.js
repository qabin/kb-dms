import {datasource_type_enum} from "../../utils/config_dictionary";
import {ajax_get_datasource_db_table_field} from '../../api/config/datasource_api'

export default {
  name: 'comp_field_catalog',
  data: () => ({
    field_list: []
  }),
  props: {
    datasource: null,
    db: null,
    table: null,
  },
  watch: {
    field_list: {
      immediate: true,
      handler: function (nv, ov) {
        nv && this.$emit('field_list', nv)
      }
    }
  },
  methods: {
    render_field_catalog_item(h, field) {
      return h('div', {
        staticClass: 'pp-selected-bg-grey-2-hover q-pl-sm q-pr-sm flex no-wrap cursor-pointer text-left overflow-hidden',
        key: field.column_name,
        style:{
          userSelect:'none',
        }
      }, [
        h('div', {
          staticClass: 'row no-wrap items-center col-grow ellipsis'
        }, [
          h('i', {
            staticClass: 'mdi mdi-table-column text-' + datasource_type_enum[this.datasource.type].color,
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('div', {
            staticClass: 'ellipsis',
          }, field.column_name),]),
        h('div', {
          staticClass: 'font-10 text-right text-faded'
        }, [
          field.is_primary_key ? h('i', {
            staticClass: 'mdi mdi-key-variant text-warning',
            style: {
              fontSize: '12px',
              //marginRight: '3px'
            }
          }) : null,
          h('span', [field.type_name])
        ])
      ])
    },
    render_field_catalog(h) {
      return h('div', {
        staticClass: 'font-12 text-left scroll',
        style: {
          borderLeft: '1px solid var(--q-color-grey-3)',
        }
      }, [this.field_list != null && this.field_list && this.field_list.map(p => [
        this.render_field_catalog_item(h, p),
        h('q-item-separator', {staticClass: 'q-ma-none'})
      ])])
    },
    refresh_catalog() {
      this.field_list = []
      this.table && this.table != null && ajax_get_datasource_db_table_field(this.datasource.id, this.db, this.table).then(d => {
        if (d.status === 1) {
          this.field_list = d.data || []
        }
      })
    },
  },
  render(h) {
    return h('transition', {props: {appear: true, mode: 'out-in', enterActiveClass: 'animate-popup-down'}}, [
      h('div', {
        staticClass: 'items-center text-left q-ml-md',
      }, [
        this.render_field_catalog(h)
      ])
    ])
  },
  mounted() {
    this.refresh_catalog()
  }
}
