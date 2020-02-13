import LazyInput from "../catalog/ComponentLazyInput"
import {
  ajax_datasource_search,
  ajax_get_datasource_db,
  ajax_get_datasource_db_table
} from "../../api/config/datasource_api"
import {datasource_type_enum} from "../../utils/config_dictionary"
import TableFolder from "../../pages/home/comp_table_folder";

export default {
  name: 'datasource_table_selector',
  data: () => ({
    kw: null,
    group: null,
    groups: [],
    data: [],
    collection_list: [],
    datasource: null,
    datasource_list: [],
    no_more_datasource: false,
    db_kw: null,
    db: null,
    db_list: [],
    table_kw: null,
    table: null,
    table_list: [],
  }),
  props: {
    default_group: {},
    default_datasource: {},
    default_db: {},
    default_table: {},
    placeholder: {type: String, default: '请选择'}
  },
  watch: {
    datasource: {
      immediate: true,
      handler: function (nv, ov) {
        this.$emit("select_datasource", nv)
        nv && ajax_get_datasource_db(nv.id).then(d => {
          if (d.status === 1) {
            this.db_list = d.data || []
          }
        })
      }
    },
    default_table: {
      immediate: true,
      handler: function (nv, ov) {
        this.table = nv
      }
    },
    default_db: {
      immediate: true,
      handler: function (nv, ov) {
        this.db = nv

      }
    },
    default_group: {
      immediate: true,
      handler: function (nv, ov) {
        this.group = nv

      }
    },
    default_datasource: {
      immediate: true,
      handler: function (nv, ov) {
        this.datasource = nv
      }
    },
    group: {
      immediate: true,
      handler: function (nv, ov) {
        this.$emit("select_group", nv)
      }
    },
    db: {
      immediate: true,
      handler: function (nv, ov) {
        this.datasource && ajax_get_datasource_db_table(this.datasource.id, nv).then(d => {
          if (d.status === 1) {
            this.table_list = d.data
          }
        })
      }
    }
  },
  methods: {
    render_search(h) {
      return h('div', {}, [
        h(LazyInput, {
          staticClass: 'pp-search-input',
          style: {
            margin: '3px'
          },
          props: {value: this.kw, placeholder: '按数据源名称查找', width: '100%'},
          on: {
            input: v => {
              this.kw = v;
              this.$nextTick(this.refresh_catalog)
            }
          }
        })
      ])
    },
    render_group_catalog(h) {
      return h('div', {
        style: {
          borderRight: '1px solid var(--q-color-grey-3)',
          width: '100px',
          maxHeight: '100%'
        }
      }, [this.collection_list.map(p => [
        this.render_group_catalog_item(h, p),
        h('q-item-separator', {staticClass: 'q-ma-none'})
      ])])
    },
    render_group_catalog_item(h, group) {
      return h('div', {
        staticClass: 'q-pl-sm q-pr-sm cursor-pointer text-left text-weight-bold row no-wrap ellipsis',
        'class': {
          'bg-grey-3': this.group && this.group.group_id === group.group_id
        },
        style: {
          lineHeight: '36px',
        },
        on: {click: () => this.select_group(group)},
        key: group.group_id
      }, [
        h('div', {
          staticClass: 'no-wrap ellipsis',
        }, group.group_name),
      ])
    },
    render_datasource_catalog(h) {
      return h('div', {
        style: {
          borderRight: '1px solid var(--q-color-grey-3)',
          width: '160px',
        }
      }, [
        h('div', {}, [
          h(LazyInput, {
            staticClass: 'pp-search-input',
            style: {
              margin: '3px'
            },
            props: {value: this.kw, placeholder: '查询数据源', width: '100%'},
            on: {
              input: v => {
                this.kw = v;
                this.$nextTick(this.refresh_catalog)
              }
            }
          })
        ]),
        h('div', {
          style: {
            width: '160px',
            maxHeight: '260px',
          }
        }, [this.datasource_list != null && this.datasource_list && this.datasource_list.map(p => [
          this.render_datasource_catalog_item(h, p),
          h('q-item-separator', {staticClass: 'q-ma-none'})
        ])])
      ])
    },
    render_datasource_catalog_item(h, datasource) {
      return h('div', {
        staticClass: 'pp-selectable-bg q-pl-sm q-pr-sm flex no-wrap justify-between cursor-pointer text-left text-weight-medium',
        'class': {
          'bg-grey-3': this.datasource && this.datasource.id === datasource.id
        },
        style: {
          lineHeight: '36px',
        },
        on: {click: () => this.select_datasource(datasource)},
        key: datasource.id
      }, [
        h('div', {
          staticClass: 'row no-wrap ellipsis'
        }, [
          h('i', {
            staticClass: 'mdi ' + datasource_type_enum[datasource.type].icon + ' text-' + datasource_type_enum[datasource.type].color,
            style: {
              fontSize: '22px'
            }
          }),
          h('div', {
            staticClass: 'ellipsis',
          }, datasource.name)
        ]),
      ])
    },
    render_db_catalog(h) {
      let filter_list = this.db_kw && this.db_kw != null ? this.db_list.filter(d => d.name.toLowerCase().indexOf(this.db_kw.toLowerCase()) !== -1) : this.db_list

      return h('div', {}, [
        h('div', {}, [
          h(LazyInput, {
            staticClass: 'pp-search-input',
            style: {
              margin: '3px'
            },
            props: {value: this.db_kw, placeholder: '查询数据库', width: '100%'},
            on: {
              input: v => {
                this.db_kw = v;
              }
            }
          })
        ]),
        h('div', {
          staticClass: 'scroll',
          style: {
            width: '200px',
            maxHeight: '300px'
          }
        }, [
          filter_list != null && filter_list && filter_list.map(p => [
            this.render_db_catalog_item(h, p),
            h('q-item-separator', {staticClass: 'q-ma-none'})
          ])])
      ])
    },
    render_db_catalog_item(h, db) {
      return h('div', {
        staticClass: 'pp-selectable-bg q-pl-sm q-pr-sm flex no-wrap justify-between cursor-pointer text-left ellipsis',
        'class': {
          'bg-grey-3': this.db && this.db === db.name
        },
        style: {
          lineHeight: '36px',
          width: '100%'
        },
        key: db.name,
        on: {click: () => this.select_db(db.name)},
      }, [
        h('div', {
          staticClass: 'row no-wrap ellipsis',
          width: '100%'
        }, [
          h('i', {
            staticClass: `mdi mdi-database text-${this.datasource && datasource_type_enum[this.datasource.type].color}`,
            style: {
              fontSize: '22px'
            }
          }),
          h('div', {
            staticClass: 'col-grow ellipsis',
          }, db.name)
        ]),
      ])
    },
    render_table_catalog(h) {
      return h('div', {}, [
        h('div', {}, [
          h(LazyInput, {
            staticClass: 'pp-search-input',
            style: {
              margin: '3px'
            },
            props: {value: this.table_kw, placeholder: '查询数据表', width: '100%'},
            on: {
              input: v => {
                this.table_kw = v;
              }
            }
          })
        ]),
        h('div', {
          staticClass: 'font-12 text-left scroll',
          style: {
            width: '200px',
            maxHeight: '300px'
          }
        }, [this.table_list != null && this.table_list && this.table_list.map(p => [
          this.render_table_catalog_item(h, p),
          h('q-item-separator', {staticClass: 'q-ma-none'})
        ])])
      ])
    },
    render_table_catalog_item(h, t) {
      return h(TableFolder, {
        props: {
          datasource: this.datasource,
          table: t.name,
          db: this.db,
          active: this.table === t.name,
          folder_mode: false,
          favorite: t.favorite || false
        },
        nativeOn: {
          click: () => {
            this.table = t.name
            this.$emit('input', {datasource: this.datasource, db: this.db, table: this.table})
            this.$refs.pop.hide()
          }
        },
      })
    },
    refresh_catalog() {
      this.datasource_list = []
      this.collection_list = []
      this.datasource = null
      this.group = null
      this.db_list = []
      this.db = null

      this.search_all_datasource_list(this.kw)
    },
    search_all_datasource_list(kw = this.kw) {
      kw = kw ? kw : null
      let vm = this
      ajax_datasource_search(kw, 1)
        .then(data => {
          if (data.status === 1) {
            vm.collection_list = vm.collection_list.concat(this.deal_data_to_folder_list(data.data) || [])
            this.group === null && vm.collection_list.length > 0 && (this.group = vm.collection_list[0])
            if (this.group !== null && this.group.children) {
              this.datasource_list = this.group.children || []
            }
            if (this.datasource_list && this.datasource_list.length > 0) {
              this.datasource = this.datasource_list[0]
            }
          }
        })
        .catch(() => this.$q.err('获取数据源列表异常'))
    },
    select_datasource(datasource) {
      this.datasource = datasource;
    },
    select_db(db) {
      this.db = db
    },
    select_group(group) {
      this.group = group
      this.datasource_list = []
      this.db = null
      this.db_list = []
      this.datasource_list = group.children || []
      this.datasource = this.datasource_list && this.datasource_list.length > 0 ? this.datasource_list[0] : null
    },
    deal_data_to_folder_list(v) {
      let folder_list = [];
      v.map(d => {
        let folder_map = {}
        let contain_flag = false
        let index = 0;
        for (let i = 0; i < folder_list.length; i++) {
          if (folder_list[i].group_id === d.group_id) {
            contain_flag = true
            index = i
            break
          }
        }
        if (contain_flag) {
          let children = (folder_list[index]).children
          d.id && children.push(d)
          folder_map = {
            group_id: d.group_id,
            children: children,
            group_name: d.group_name
          }
          folder_list.splice(index, 1, folder_map)

        } else {
          let children = []
          d.id && children.push(d)
          folder_map = {
            group_id: d.group_id,
            children: children,
            group_name: d.group_name
          }
          folder_list.push(folder_map)
        }
      })
      return folder_list
    },
  },
  render(h) {
    return h('div', {
      staticClass: 'pjm-selector relative-position flex no-wrap items-center',
      style: {height: '24px'},
    }, [
      this.table ? h('span', {}, this.table) : h('span', {style: {color: '#979797'}}, this.placeholder),
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
          //this.render_search(h),
          h('div', {
            staticClass: 'no-wrap row col-grow',
          }, [
            this.render_group_catalog(h),
            this.render_datasource_catalog(h),
            this.render_db_catalog(h),
            this.render_table_catalog(h)
          ]),
        ])])
    ])
  },
  mounted() {
    this.refresh_catalog()
  }
}
