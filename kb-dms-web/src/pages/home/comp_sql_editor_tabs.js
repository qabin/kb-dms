import {
  ajax_search_open_sql_editor_tab,
  ajax_close_sql_editor_tab,
  ajax_sql_editor_tab_active,
  ajax_search_active_sql_editor_tab
} from "../../api/user/sql_editor_tab_api";
import {datasource_type_enum} from "../../utils/config_dictionary";
import MySqlEditorSelector from '../../components/selector/MySqlEditorSelector'

export default {
  name: 'comp_sql_editor_tabs',
  data: () => ({
    selectTab: null,
    tabs: [],
    active_list: []
  }),
  watch: {
    selectTab: {
      immediate: true,
      handler: function (nv, ov) {
        nv && this.$emit('select', nv)
      }
    }
  },
  methods: {
    render_tabs_item(h, tab) {

      return h('div', {
        staticClass: 'row cursor-pointer pp-border-4-no-bottom no-wrap pp-selected-bg-grey-2-hover text-left items-center',
        'class': {
          'pp-tab-selected-top-high-light bg-grey-3': this.selectTab && this.selectTab.id === tab.id
        },
        style: {
          marginRight: '3px',
          width: '200px',
          minWidth: '200px'
        }

      }, [
        h('div', {
          staticClass: 'row cursor-pointer no-wrap col-grow',
          style: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'noWrap',
          },
          on: {
            click: () => {
              this.select_tab(tab)
            }
          }
        }, [
          h('div', {
            staticClass: 'col-grow ellipsis text-weight-medium',
          }, [
            tab.datasource_type ? h('i', {
              staticClass: 'mdi ' + datasource_type_enum[tab.datasource_type].icon + ' text-' + datasource_type_enum[tab.datasource_type].color,
              style: {
                fontSize: '20px',
                marginRight: '3px'
              }
            }) : null,
            tab && tab.type === 1 ? h('i', {
              staticClass: 'mdi mdi-table-search text-primary',
              style: {
                fontSize: '16px',
                marginRight: '3px'
              }
            }) : null,

            tab && tab.type === 2 ? h('i', {
              staticClass: 'mdi mdi-table-eye text-primary',
              style: {
                fontSize: '16px',
                marginRight: '3px'
              }
            }) : null,

            tab && tab.type === 3 ? h('i', {
              staticClass: 'mdi mdi-table-edit text-secondary',
              style: {
                fontSize: '16px',
                marginRight: '3px'
              }
            }) : null,

            tab && tab.type === 4 ? h('i', {
              staticClass: 'mdi mdi-table-settings text-primary',
              style: {
                fontSize: '16px',
                marginRight: '3px'
              }
            }) : null,
            h('span', {
              style: {
                marginLeft: '3px'
              },
              attrs: {
                title: tab.name ? tab.name : (tab.db ? tab.db + '@' + tab.datasource_name : '请选择数据库')
              }
            }, [tab.name ? tab.name : (tab.db ? tab.db + '@' + tab.datasource_name : '请选择数据库')])
          ])]),
        h('div', {
          style: {
            width: '20px'
          }
        }, [
          this.tabs.length <= 1 ? null : h('q-icon', {
            staticClass: 'cursor-pointer icon-red-hover',
            props: {
              name: 'cancel',
              size: '16px',
              color: 'amber'
            },
            nativeOn: {
              click: () => {
                this.close_cur_tab(tab)
              }
            }
          })
        ])
      ])
    },
    render_scroll_left(h) {
      return h('div', {
        staticClass: 'pp-border-4-no-bottom flex-center row cursor-pointer full-height bg-blue-5 pp-selectable-bg-blue-7',
        style: {
          width: '35px',
          minWidth: '35px',
          marginRight: '3px'
        },
        on: {
          click: () => {
            this.auto_scroll_to_left()
          }
        }
      }, [h('q-icon', {
        props: {
          name: 'first_page',
          color: 'white',
          size: '20px',
        },
      }, [h('q-tooltip', {props: {offset: [5, 5]}}, '滚到最左侧')])])
    },
    render_scroll_right(h) {
      return h('div', {
        staticClass: 'pp-border-4-no-bottom flex-center row cursor-pointer full-height bg-blue-5 pp-selectable-bg-blue-7',
        style: {
          width: '35px',
          minWidth: '35px',
          marginRight: '3px'
        },
        on: {
          click: () => {
            this.auto_scroll_to_right()
          }
        }
      }, [h('q-icon', {
        props: {
          name: 'last_page',
          color: 'white',
          size: '20px',
        },
      }, [h('q-tooltip', {props: {offset: [5, 5]}}, '滚到最右侧')])])
    },
    // render_tabs_add(h) {
    //   return h('div', {
    //     staticClass: 'pp-border-4-no-bottom flex-center row cursor-pointer full-height bg-blue-5 pp-selectable-bg-blue-7',
    //     style: {
    //       width: '35px',
    //       minWidth: '35px',
    //       marginRight: '3px'
    //     },
    //     on: {
    //       click: () => {
    //         let model = {
    //           type: 1
    //         }
    //         this.add_active_tab(model, false);
    //       }
    //     }
    //   }, [h('q-icon', {
    //     props: {
    //       name: 'add',
    //       color: 'white',
    //       size: '20px',
    //     },
    //   }, [h('q-tooltip', {props: {offset: [5, 5]}}, '新建查询窗口')])])
    // },
    render_my_tabs(h) {
      return h('div', {
        staticClass: 'pp-border-4-no-bottom flex-center row cursor-pointer full-height bg-blue-5 pp-selectable-bg-blue-7',
        style: {
          width: '35px',
          minWidth: '35px',
          marginRight: '3px'
        },
        on: {
          click: () => {
            this.$refs.MySqlEditorSelector.refresh_catalog()
          }
        }
      }, [h('q-icon', {
        props: {
          name: 'star',
          color: 'white',
          size: '16px',
        },
      }, [h('q-tooltip', {props: {offset: [5, 5]}}, '我的脚本')]),
        h('q-popover', {
          props: {}
        }, [
          h(MySqlEditorSelector, {
            ref: 'MySqlEditorSelector',
            on: {
              select: (v) => {
                this.select_tab(v)
              }
            }
          })
        ])
      ])
    },
    render_tabs_list(h) {
      let count = 0;
      this.tabs.length <= 0 && this.tabs.push(
        this.new_default_tab()
      )
      //!this.selectTab && this.tabs.length > 0 && (this.selectTab = this.tabs[0])
      return this.tabs.map(tab => [this.render_tabs_item(h, tab, ++count)])

    },
    select_tab(v) {
      this.selectTab = v;

      if (this.selectTab && this.selectTab.id && typeof this.selectTab.id === 'number') {
        ajax_sql_editor_tab_active(this.selectTab.id).then().catch()
      }
    },
    add_active_tab(v, first) {
      let newTab = this.new_default_tab()
      this.selectTab = {
        ...newTab,
        ...v
      }

      let new_tab_obj = {
        ...this.selectTab
      }

      new_tab_obj['from_table_catalog'] = false

      if (!first) {
        this.tabs.push({
          ...new_tab_obj
        })
        //添加元素后自动滚动到最右侧
        setTimeout(this.auto_scroll_to_right, 100)
      } else {
        this.tabs.splice(0, 1, new_tab_obj)
        //添加元素后自动滚动到最左侧
        setTimeout(this.auto_scroll_to_left, 100)
      }

    },
    auto_scroll_to_right() {
      let tabs_div = document.getElementById('tabs_list_div')
      tabs_div.scrollLeft = tabs_div.scrollWidth
    },
    auto_scroll_to_left() {
      let tabs_div = document.getElementById('tabs_list_div')
      tabs_div.scrollLeft = 0
    },
    // close_other_tabs() {
    //   this.tabs = []
    //   this.tabs.push(this.selectTab)
    // },
    // close_all_tabs() {
    //   this.tabs = []
    //   this.selectTab = null
    // },
    close_cur_tab(v) {
      let flag = false;
      if (typeof v !== 'undefined') {
        flag = this.selectTab && this.selectTab.id === v.id
      } else {
        flag = true
        v = this.selectTab
      }
      let index = 0;
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].id === v.id) {
          index = i
          break
        }
      }
      this.tabs.splice(index, 1)

      this.tabs.length <= 0 && this.tabs.push(this.new_default_tab())

      flag && (this.selectTab = index - 1 <= 0 ? this.tabs[0] : this.tabs[index - 1])

      v.id && typeof v.id === 'number' && ajax_close_sql_editor_tab(v.id).then(d => {
        if (d.status === 1) {

        }
      })

    },
    new_default_tab() {
      return {
        id: 'id_' + new Date()
      }
    },
    refresh_tab_list() {
      ajax_search_active_sql_editor_tab().then(d => {
        if (d.status === 1) {
          this.active_list = d.data || []
        }
      }).then(() => {
        ajax_search_open_sql_editor_tab(null, 1).then(d => {
          if (d.status === 1) {
            this.tabs = d.data || []
            if (this.tabs.length > 0) {
              if (this.active_list.length > 0) {
                let active = this.active_list[0]
                for (let i = 0; i < this.tabs.length; i++) {
                  if (this.tabs[i].id === active.sql_tab_id) {
                    this.selectTab = this.tabs[i]
                    return
                  }
                }
                this.selectTab = this.tabs[0]
              } else {
                this.selectTab = this.tabs[0]
              }
            }
          }
        })
      })
    },

    refresh_tab_data_list() {
      ajax_search_open_sql_editor_tab(null, 1).then(d => {
        if (d.status === 1) {
          this.tabs = d.data || []
        }
      })
    }
  }
  ,
  render(h) {
    return h('div', {
      staticClass: 'row items-center font-12 no-wrap col-grow bg-grey-1 overflow-hidden',
      style: {
        height: '30px',
        userSelect: 'none',
      }
    }, [
      h('div', {
        staticClass: 'row no-wrap col-grow scroll full-height',
        attrs: {
          id: 'tabs_list_div'
        }
      }, [
        this.render_tabs_list(h)
      ]),
      //this.render_tabs_add(h),
      this.render_my_tabs(h),
      this.render_scroll_left(h),
      this.render_scroll_right(h),
    ])
  }
  ,
  mounted() {
    this.refresh_tab_list()
  }
}
