import {
  ajax_search_active_sql_editor_tab,
  ajax_search_all_sql_editor_tab,
  ajax_open_sql_editor_tab, ajax_delete_sql_editor_tab
} from "../../api/user/sql_editor_tab_api";
import {datasource_type_enum} from "../../utils/config_dictionary";
import {sql_editor_tab_type_enum_optoins} from "../../utils/user_dictionary";

export default {
  name: 'my_sql_editor_selector',
  data: () => ({
    active: null,
    tabs: [],
  }),
  methods: {
    render_tabs_item(h, t) {
      return h('div', {
        staticClass: 'row no-wrap pp-selectable-bg q-pl-sm q-pr-sm flex no-wrap justify-between cursor-pointer text-left ellipsis text-left font-13',
        style: {
          lineHeight: '36px',
        },
        on: {
          click: () => {
            ajax_search_active_sql_editor_tab(t.id).then(d => {

            })

            ajax_open_sql_editor_tab(t.id).then(d => {

            }).then(() => {
              this.$emit('select', t)
              this.active.sql_tab_id = t.id
            })

          }
        }
      }, [
        h('div', {
          style: {
            width: '20px',
            minWidth: '20px',
            marginRight: '3px'
          },
        }, [
          this.active && this.active.sql_tab_id === t.id ? h('q-icon', {
            props: {
              name: 'label_important',
              size: '24px',
              color: 'info'
            }
          }) : null,]),
        t.datasource_type ? h('i', {
          staticClass: 'mdi ' + datasource_type_enum[t.datasource_type].icon + ' text-' + datasource_type_enum[t.datasource_type].color,
          style: {
            fontSize: '20px',
            marginRight: '3px'
          }
        }) : null,
        h('i', {
          staticClass: sql_editor_tab_type_enum_optoins[t.type].icon + " " + sql_editor_tab_type_enum_optoins[t.type].color,
          style: {
            fontSize: '20px',
            marginRight: '3px'
          }
        }),
        h('span', {
          staticClass: 'col-grow ellipsis'
        }, [t.name ? t.name : this.is_online ? (t.db + '@' + t.datasource_url + ":" + t.datasource_port) : (t.db ? t.db + '@' + t.datasource_name : '请选择数据库')]),
        h('q-icon', {
          staticClass: 'cursor-pointer q-ml-sm pp-selectable-bg-red-5 pp-selectable-color-white',
          'class': {
            disabled: this.disable
          },
          style: {
            padding: '4px'
          },
          props: {
            name: 'delete_forever',
            color: 'negative',
            size: '22px'
          },
          nativeOn: {
            click: () => {
              t.id && ajax_delete_sql_editor_tab(t.id).then(d => {
                if (d.status === 1) {
                  this.$q.ok("删除窗口成功！")
                  this.$emit("close_curr", t)
                  this.refresh_catalog()
                }
              })
            }
          }
        }, [
          h('q-tooltip', {props: {offset: [5, 5]}}, '删除窗口'),
        ]),
      ])
    },
    render_tabs_catalog(h) {
      if (this.tabs && this.tabs.length > 0) {
        return this.tabs && this.tabs.map(t => [
          this.render_tabs_item(h, t),
          h('q-item-separator', {staticClass: 'q-ma-none'})
        ])
      } else {
        return h('div', {
          staticClass: 'items-center font-13 text-faded text-left full-height',
          style: {
            height: '20px'
          }
        }, ['暂无数据'])
      }
    },
    refresh_catalog() {
      ajax_search_active_sql_editor_tab().then(d => {
        if (d.status === 1) {
          let active_list = d.data || []
          if (active_list.length > 0) {
            this.active = active_list[0]
          }
        }
      }).then(() => {
        ajax_search_all_sql_editor_tab(null, null).then(d => {
          if (d.status === 1) {
            this.tabs = d.data
          }
        })
      })
    }
  },
  render(h) {
    return h('div', {
      style: {
        width: '300px',
        minHeight: '0px'
      }
    }, [this.render_tabs_catalog(h)])
  },
  activated() {
    this.refresh_catalog()
  }
}
