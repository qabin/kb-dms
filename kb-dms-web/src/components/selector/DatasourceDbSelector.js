import LazyInput from "../catalog/ComponentLazyInput";
import {ajax_datasource_search, ajax_get_datasource_db} from "../../api/config/datasource_api";
import {datasource_type_enum} from "../../utils/config_dictionary";
import FavoriteBtn from '../elements/favorite-btn'
import {
  ajax_add_group_favorite,
  ajax_delete_group_favorite,
  ajax_add_datasource_favorite,
  ajax_delete_datasource_favorite,
  ajax_add_db_favorite,
  ajax_delete_db_favorite,
} from "../../api/user/user_favorite_api";

export default {
  name: 'datasource_db_selector',
  data: () => ({
    group: null,
    groups: [],
    data: [],
    collection_list: [],
    datasource_list: [],
    datasource: null,
    no_more_datasource: false,
    db_list: [],
    db: null,
    table_kw: null,
    datasource_filter_kw: null,
  }),
  props: {
    default_group: {},
    default_db: {},
    default_datasource: {},
  },
  watch: {
    datasource: {
      immediate: true,
      handler: function (nv, ov) {
        this.$emit("select_datasource", nv)
        let vm = this
        nv && ajax_get_datasource_db(nv.id).then(d => {
          if (d.status == 1) {
            vm.db_list = d.data || []
            // if (vm.db_list.length > 0) {
            //   vm.db = vm.db_list[0]
            // }
          }
        })
      }
    },
    default_db: {
      immediate: true,
      handler: function (nv, ov) {
        if (nv) {
          this.db = nv
        }
      }
    },
    default_group: {
      immediate: true,
      handler: function (nv, ov) {
        if (nv) {
          this.group = nv
        }
      }
    },
    default_datasource: {
      immediate: true,
      handler: function (nv, ov) {
        if (nv) {
          this.datasource = nv
        }
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
        if (nv) {
          this.$emit("select_db", nv.name)
        }

      }
    }
  },
  methods: {
    render_db_catalog(h) {
      let filter_list = this.table_kw && this.table_kw != null ? this.db_list.filter(d => d.name.toLowerCase().indexOf(this.table_kw.toLowerCase()) !== -1) : this.db_list

      return h('div', {}, [
        h('div', {
          style: {
            height: '30px'
          }
        }, [
          h(LazyInput, {
            staticClass: 'pp-search-input',
            style: {
              margin: '3px'
            },
            props: {value: this.table_kw, placeholder: '查询数据库', width: '100%'},
            on: {
              input: v => {
                this.table_kw = v;
              }
            }
          })
        ]),
        h('div', {
          staticClass: 'scroll',
          style: {
            width: '255px',
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
        staticClass: 'pp-selectable-bg q-pl-sm q-pr-sm flex no-wrap justify-between cursor-pointer text-left ellipsis ' + (db['favorite'] ? null : 'hover-icon'),
        'class': {
          'bg-grey-3': this.db && this.db === db.name
        },
        style: {
          lineHeight: '36px',
          width: '100%'
        },
        key: db.name,
        on: {
          click: () => {
            this.select_db(db.name)
            this.$emit("select_db_click", {
              group: this.group,
              datasource: this.datasource,
              db: db.name
            })
            this.$emit('click', {datasource: this.datasource, db: db.name})
          }
        },
      }, [
        h('div', {
          staticClass: 'row col-grow no-wrap ellipsis',
          width: '100%'
        }, [
          h('i', {
            staticClass: 'mdi mdi-database text-' + datasource_type_enum[this.datasource.type].color,
            style: {
              fontSize: '22px'
            }
          }),
          h('div', {
            staticClass: 'col-grow ellipsis',
            attrs: {
              title: db.name,
            },
          }, db.name),
          h(FavoriteBtn, {
              staticClass: 'text-orange cursor-pointer',
              style: {
                fontSize: '22px',
              },
              props: {value: db['favorite'] || false},
              on: {input: v => this.db_favorite(db.name, v)}
            }
          )
        ]),
      ])
    },
    render_group_catalog_item(h, group) {
      return h('div', {
        staticClass: 'pp-selectable-bg q-pl-sm q-pr-sm cursor-pointer text-left text-weight-bold row no-wrap ellipsis ' + (group['group_favorite'] ? null : 'hover-icon'),
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
          staticClass: 'no-wrap col-grow ellipsis',
        }, group.group_name),
        h(FavoriteBtn, {
            staticClass: 'text-orange cursor-pointer',
            style: {
              fontSize: '22px',
            },
            props: {value: group['group_favorite'] || false},
            on: {input: v => this.group_favorite(group.group_id, v)}
          }
        )
      ])
    },
    render_group_catalog(h) {
      return h('div', {
        staticClass:'scroll',
        style: {
          borderRight: '1px solid var(--q-color-grey-3)',
          width: '120px',
          height:'330px'
        }
      }, [this.collection_list.map(p => [
        this.render_group_catalog_item(h, p),
        h('q-item-separator', {staticClass: 'q-ma-none'})
      ])])
    },
    render_datasource_catalog_item(h, datasource) {
      return h('div', {
        staticClass: 'pp-selectable-bg q-pl-sm q-pr-sm flex no-wrap justify-between cursor-pointer text-left text-weight-medium ' + (datasource['datasource_favorite'] ? null : 'hover-icon'),
        'class': {
          'bg-grey-3': this.datasource && this.datasource.id === datasource.id
        },
        style: {
          lineHeight: '36px',
        },
        attrs: {
          title: datasource.name,
        },
        on: {click: () => this.select_datasource(datasource)},
        key: datasource.id
      }, [
        h('div', {
          staticClass: 'row col-grow no-wrap ellipsis'
        }, [
          h('i', {
            staticClass: 'mdi ' + datasource_type_enum[datasource.type].icon + ' text-' + datasource_type_enum[datasource.type].color,
            style: {
              fontSize: '22px'
            }
          }),
          h('div', {
            staticClass: 'col-grow ellipsis',
          }, datasource.name),
          h(FavoriteBtn, {
              staticClass: 'text-orange cursor-pointer',
              style: {
                fontSize: '22px',
              },
              props: {value: datasource['datasource_favorite'] || false},
              on: {input: v => this.datasource_favorite(datasource.id, v)}
            }
          )
        ]),
      ])
    },
    render_datasource_catalog(h) {
      return h('div', {
        style: {
          borderRight: '1px solid var(--q-color-grey-3)',
          width: '240px',
        }
      }, [
        h('div', {
          style: {
            height: '30px'
          }
        }, [
          h(LazyInput, {
            staticClass: 'pp-search-input',
            style: {
              margin: '3px'
            },
            props: {value: this.datasource_filter_kw, placeholder: '数据源', width: '100%'},
            on: {
              input: v => {
                this.datasource_filter_kw = v;
                this.$nextTick(this.refresh_catalog)
              }
            }
          })
        ]),
        h('div', {
          staticClass: 'scroll',
          style: {
            width: '240px',
            height: '300px'
          }
        }, [
          this.datasource_filter_kw ? this.datasource_list.filter(d => d.name.indexOf(this.datasource_filter_kw) !== -1).map(p => [
              this.render_datasource_catalog_item(h, p),
              h('q-item-separator', {staticClass: 'q-ma-none'})
            ]) :
            this.datasource_list.map(p => [
              this.render_datasource_catalog_item(h, p),
              h('q-item-separator', {staticClass: 'q-ma-none'})
            ])
        ])
      ])
    },
    refresh_catalog() {
      this.datasource_list = []
      this.collection_list = []
      this.datasource = null
      this.group = null
      this.db_list = []
      this.db = null
      this.search_all_datasource_list()
    },
    search_all_datasource_list( callback) {
      ajax_datasource_search(null, 1)
        .then(data => {
          if (data.status === 1) {
            this.collection_list = this.collection_list.concat(this.deal_data_to_folder_list(data.data) || [])
            this.group === null && this.collection_list.length > 0 && (this.group = this.collection_list[0])
            if (this.group !== null && this.group.children) {
              this.datasource_list = this.group.children || []
            }
            if (this.datasource_list && this.datasource_list.length > 0) {
              if (!this.datasource || !this.datasource_list.some(d => d.id === this.datasource.id)) {
                this.datasource = this.datasource_list[0]
              }

            }

          }
        }).catch(() => this.$q.err('获取数据源列表异常'))
    },
    select_datasource(datasource) {
      this.datasource = datasource;

    },
    only_refresh_catalog_data() {
      this.datasource_list = []
      this.collection_list = []

      this.search_all_datasource_list(null, () => {
        if (this.group) {
          let new_group = this.collection_list.filter(d => d.group_id === this.group.group_id)
          if (new_group && new_group.length > 0) {
            this.group = new_group[0]
            this.datasource_list = this.group.children
          }
        }
      })
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
            group_favorite: d.group_favorite,
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
            group_favorite: d.group_favorite,
            group_name: d.group_name
          }
          folder_list.push(folder_map)
        }
      })
      return folder_list
    },
    group_favorite(group_id, v) {
      if (v) {
        ajax_add_group_favorite(group_id).then(d => {
          if (d.status === 1) {
            this.only_refresh_catalog_data()
          }
        })
      } else {
        ajax_delete_group_favorite(group_id).then(d => {
          if (d.status === 1) {
            this.only_refresh_catalog_data()
          }
        })
      }
    },
    datasource_favorite(datasource_id, v) {
      if (v) {
        ajax_add_datasource_favorite(datasource_id).then(d => {
          if (d.status === 1) {
            this.only_refresh_catalog_data()
          }
        })
      } else {
        ajax_delete_datasource_favorite(datasource_id).then(d => {
          if (d.status === 1) {
            this.only_refresh_catalog_data()
          }
        })
      }
    },
    db_favorite(db, v) {
      if (v) {
        ajax_add_db_favorite(this.datasource.id, db).then(d => {
          if (d.status === 1) {
            this.db_list = []
            ajax_get_datasource_db(this.datasource.id).then(d => {
              this.db_list = d.data
            })
          }
        })
      } else {
        ajax_delete_db_favorite(this.datasource.id, db).then(d => {
          if (d.status === 1) {
            this.db_list = []
            ajax_get_datasource_db(this.datasource.id).then(d => {
              this.db_list = d.data
            })
          }
        })
      }
    }
  },
  render(h) {
    return h('div', {
      staticClass: 'font-12 column',
      style: {
        height: '100%'
      }
    }, [
      h('div', {
        staticClass: 'no-wrap row col-grow',
      }, [
        this.render_group_catalog(h),
        this.render_datasource_catalog(h),
        this.render_db_catalog(h),
      ]),

    ])
  },
  mounted() {
    this.refresh_catalog()
  }
}
