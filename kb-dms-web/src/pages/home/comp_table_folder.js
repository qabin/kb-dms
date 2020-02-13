import {datasource_type_enum} from "../../utils/config_dictionary"
import FieldCatalog from './comp_field_catalog'
import TableFolderMenu from './comp_table_folder_menu'
import FavoriteBtn from '../../components/elements/favorite-btn'

export default {
  name: 'comp_table_folder',
  data: () => ({
    show: false,
  }),
  props: {
    table: {
      type: String,
      require: true,
    },
    datasource: {
      type: Object,
      require: true
    },
    active: {
      type: Boolean,
      require: false,
      default: false
    },
    db: {
      type: String,
      require: true
    },
    folder_mode: {
      type: Boolean,
      default: true
    },
    favorite: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    render_collapse_icon(h) {
      return h('i', {
        staticClass: 'material-icons text-faded',
        style: {
          fontSize: '20px',
        }
      }, [this.show ? 'arrow_drop_down' : 'arrow_right'])
    },
  },
  render(h) {
    return this.datasource && h('div', {}, [
      h('div', {
        staticClass: 'row no-wrap ellipsis items-center cursor-pointer pp-selected-bg-grey-2-hover' + (this.show ? ' bg-grey-1' : '') + (this.favorite ? null : ' hover-icon'),
        style: {
          width: '100%',
          height: '35px'
        },
        'class': {
          'bg-grey-3': this.active,
        },
        on: {
          click: () => this.folder_mode && (this.show = !this.show)
        }

      }, [
        h('div', {
          staticClass: 'row no-wrap col-grow ellipsis items-center cursor-pointer',
        }, [
          this.folder_mode ? this.render_collapse_icon(h) : null,

          h('i', {
            staticClass: 'mdi mdi-table text-' + datasource_type_enum[this.datasource.type].color,
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('span', {
            staticClass: 'col-grow ellipsis text-weight-medium',
            style: {
              userSelect: 'none',
            },
            attrs: {
              title: this.table
            }
          }, [this.table]),
        ]),

        h(TableFolderMenu, {
          staticClass: 'col-grow',
          props: {
            datasource: this.datasource,
            db: this.db,
            table: this.table
          },
          on: {
            select_100: (v) => {
              this.$emit("select_100", v)
            },
            refresh_table_list: () => {
              this.$emit('refresh_table_list')
            },
            view_table_content: (v) => {
              this.$emit('view_table_content', v)
            },
            view_table_info: (v) => {
              this.$emit('view_table_info', v)
            },
            edit_table: (v) => {
              this.$emit('edit_table', v)
            },
            create_table: (v) => {
              this.$emit('create_table', v)
            },
            new_table_search: (v) => {
              this.$emit('new_table_search', v)
            },
          }
        }),
        h(FavoriteBtn, {
            staticClass: 'text-orange cursor-pointer',
            style: {
              fontSize: '22px',
            },
            props: {value: this.favorite || false},
            on: {
              input: v => this.$emit('favorite', {
                table: this.table,
                favorite: v
              })
            }
          }
        )

      ]),
      this.show ? h('div', {}, [
        this.$slots.content,
        h(FieldCatalog, {
          props: {
            datasource: this.datasource,
            db: this.db,
            table: this.table,
          },
          on: {
            field_list: (v) => {
              this.$emit('filed_list', v)
            }
          }
        })
      ]) : null,

    ])
  }
}
