import LazyInput from "../../components/catalog/ComponentLazyInput";
import {datasource_type_enum} from "../../utils/config_dictionary";
import DatasourceDbSelector from '../../components/selector/DatasourceDbSelector'
import {ajax_get_datasource, ajax_get_datasource_db_table} from '../../api/config/datasource_api'
import TableFolder from './comp_table_folder'
import {ajax_add_sql_editor_tab, ajax_sql_editor_tab_active} from "../../api/user/sql_editor_tab_api";
import {ajax_add_table_favorite, ajax_delete_table_favorite} from "../../api/user/user_favorite_api";

export default {
  name: 'comp_table_catalog',
  data: () => ({
    kw: null,
    table_list: [],
    table: null,
    datasource: null,
    group: null,
    db: null,
    no_more_table: false,
    table_kw: null,
    show_create_button: false
  }),
  watch: {
    table_list: {
      immediate: true,
      handler: function (nv, ov) {
        this.$emit('table_list', nv)
      }
    },
    datasource: {
      immediate: true,
      handler: function (nv, ov) {
        this.$emit('datasource', nv)
      }
    },
    db: {
      immediate: true,
      handler: function (nv, ov) {
        this.$emit('db', nv)
      }
    }
  },
  methods: {
    render_table_catalog_item(h, t) {
      return h(TableFolder, {
        props: {
          datasource: this.datasource,
          table: t.name,
          db: this.db,
          active: this.table === t.name,
          favorite: t.favorite || false
        },
        nativeOn: {
          click: () => {
            this.table = t.name
          }
        },
        on: {
          filed_list: (v) => {
            this.$emit('field_list', v)
          },
          select_100: (v) => {
            this.$emit("select_100", v)
          },
          refresh_table_list: () => {
            this.refresh_select_db(this.datasource.id, this.db)
          },
          view_table_content: (v) => {
            this.$emit("view_table_content", v)
          },
          view_table_info: (v) => {
            this.$emit("view_table_info", v)
          },
          edit_table: (v) => {
            this.$emit("edit_table", v)
          },
          create_table: (v) => {
            this.$emit("create_table", v)
          },
          new_table_search: (v) => {
            this.$emit("new_table_search", v)
          },
          favorite: (v) => {
            this.table_favorite(v.table, v.favorite)
          }
        },
      })
    },
    render_table_catalog(h) {
      let filter_list = this.table_kw && this.table_kw != null ? this.table_list.filter(d => d.name.toLowerCase().indexOf(this.table_kw.toLowerCase()) !== -1) : this.table_list

      return h('transition', {props: {appear: true, mode: 'out-in', enterActiveClass: 'animate-popup-down'}}, [
        h('div', {
          staticClass: 'font-12 text-left hide_scroll_bar',
          // style: {
          //   height: '480px'
          // }
        }, [
          this.table_list != null && this.table_list && this.table_list.length > 0 ? h('div', {}, [
            h(LazyInput, {
              staticClass: 'pp-search-input',
              style: {
                margin: '3px'
              },
              props: {value: this.table_kw, placeholder: '按名称查找', width: '100%'},
              on: {
                input: v => {
                  this.table_kw = v;
                }
              }
            })
          ]) : null,
          this.render_new_table(h),
          h('div', {
            staticClass: 'scroll',
            style: {
              height: '440px'
            }
          }, [
            filter_list.map(p => [
              this.render_table_catalog_item(h, p),
              h('q-item-separator', {staticClass: 'q-ma-none'})
            ]),
          ]),
        ])
      ])

    },
    refresh_select_db(datasource_id, db) {
      this.db = db
      this.table = null
      this.table_list = []
      this.show_create_button = false
      db && db != null && ajax_get_datasource_db_table(datasource_id, db).then(d => {
        if (d.status === 1) {
          this.table_list = d.data || []
          if (this.table_list.length <= 0) {
            this.show_create_button = true
          }
        }
      })
    },
    refresh_db_tab_from_index(datasource_id, db) {
      ajax_get_datasource(datasource_id).then(d => {
        if (d.status === 1) {
          this.datasource = d.data
        }
      }).then(() => {
        this.refresh_select_db(datasource_id, db)
      })
    },
    render_title(h) {
      return h('div', {
          staticClass: 'flex no-wrap items-center full-height font-14 cursor-pointer pp-border-3 ' + this.db && this.db != null ? ' bg-' + datasource_type_enum[this.datasource.type].color + ' text-white' : ' bg-deep-orange-5 text-white',
          style: {
            height: '42px'
          },
          on: {
            click: () => this.show = true
          }
        }, [
          h('div', {
            staticClass: 'row no-wrap items-center full-height',
          }, [
            this.datasource && this.db ? h('i', {
              staticClass: 'mdi ' + datasource_type_enum[this.datasource.type].icon,
              style: {
                fontSize: '22px',
              }
            }) : null,
            h('i', {
              staticClass: 'mdi mdi-database',
              style: {
                fontSize: '22px',
              }
            }),
            h('div', {
              staticClass: 'col-grow ellipsis text-left text-weight-bold',
              style: {
                width: '100px',
                fontSize: '16px'
              },
              attrs: {
                title: this.db
              }
            }, [
              this.db ? this.db : '请选择数据库',
            ]),
            h('q-icon', {
              props: {
                name: 'keyboard_arrow_down',
                size: '26px'
              }
            })]),
          h('q-popover', {
            ref: 'QPopover',
            style: {
              maxHeight: '800px',
              maxWidth: '800px'
            }
          }, [
            h(DatasourceDbSelector, {
              ref: 'DatasourceSelector',
              props: {
                default_db: this.db,
                default_group: this.group,
                default_datasource: this.datasource,
              },
              on: {
                // select_group: (v) => {
                //   this.group = v
                // },
                // select_datasource: (v) => {
                //   this.datasource = v
                // },
                select_db_click: (v) => {
                  v && ajax_add_sql_editor_tab({
                    sql_text: null,
                    name: null,
                    datasource_id: v.datasource.id,
                    db: v.db,
                  }).then(d => {
                    if (d.status === 1) {
                      d.data && ajax_sql_editor_tab_active(d.data).then(d => {
                        this.$emit("new_table_search")
                      })
                    } else {
                    }
                  })
                },
                click: () => {
                  this.$refs.QPopover && this.$refs.QPopover.hide()

                }
              }
            })
          ])
        ]
      )
    },
    render_new_table(h) {
      return this.show_create_button ? h('div', {}, [
        h('q-btn', {
          staticClass: 'no-ripple shadow-0 font-13 q-ma-sm',
          style: {
            height: '20px'
          },
          props: {
            flat: false,
            label: '新增表',
            color: 'primary',
          },
          on: {
            click: (v) => {
              this.$emit("create_table", {
                db: this.db,
                datasource: this.datasource,
              })
            },
          }
        }),
      ]) : null
    },
    table_favorite(table, v) {
      if (v) {
        ajax_add_table_favorite(this.datasource.id, this.db, table).then(d => {
          if (d.status === 1) {
            this.table_list = []
            ajax_get_datasource_db_table(this.datasource.id, this.db).then(d => {
              this.table_list = d.data
            })
          }
        })
      } else {
        ajax_delete_table_favorite(this.datasource.id, this.db, table).then(d => {
          if (d.status === 1) {
            this.table_list = []
            ajax_get_datasource_db_table(this.datasource.id, this.db).then(d => {
              this.table_list = d.data
            })
          }
        })
      }
    },
  },
  render(h) {
    return h('div', {}, [
      h('div', {
        staticClass: 'items-center text-left',
        style: {
          userSelect: 'none',
        }
      }, [
        this.render_title(h),
        this.render_table_catalog(h),
      ])
    ])
  },
}
