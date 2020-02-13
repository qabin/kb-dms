import LazyInput from "../../../components/catalog/ComponentLazyInput";
import {base_status_enum, datasource_type_enum} from "../../../utils/config_dictionary";
import {ajax_datasource_search} from "../../../api/config/datasource_api";
import PpNavigator from '../../../components/elements/pp_navigator'

const query_type = {
  all: '所有',
  created_by_me: '我创建的',
  owner_by_me: '我负责的',

};
export default {
  name: 'comp_datasource_catalog',
  data: () => ({
    kw: null,
    datasource: null,
    datasource_list: [],
    group: null,
    groups: [],
    collection_list: [],
    query_type: 'all'
  }),
  watch: {
    query_type: {
      immediate: true,
      handler: function (nv, ov) {
        if (nv) {
          this.refresh_catalog()
        }
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
          props: {value: this.kw, placeholder: '按名称查找', width: '100%'},
          on: {
            input: v => {
              this.kw = v;
              this.$nextTick(this.refresh_catalog)
            }
          }
        })
      ])
    },
    render_group_catalog_item(h, group) {
      return h('div', {
        staticClass: 'q-pl-sm q-pr-sm flex no-wrap justify-between cursor-pointer text-left',
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
          staticClass: 'ellipsis',
        }, group.group_name),
      ])
    },
    render_group_catalog(h) {
      return h('div', {
        style: {
          borderRight: '1px solid var(--q-color-grey-5)',
          width: '100px',
          minHeight: '96vh',
          maxHeight: '100%'
        }
      }, [this.collection_list.map(p => [
        this.render_group_catalog_item(h, p),
        h('q-item-separator', {staticClass: 'q-ma-none'})
      ])])
    },
    render_datasource_catalog_item(h, datasource) {
      return h('div', {
        staticClass: 'pp-selectable-bg q-pl-sm q-pr-sm row no-wrap justify-between cursor-pointer text-left',
        'class': {
          'pp-selected-bg': this.datasource && this.datasource.id === datasource.id
        },
        style: {
          lineHeight: '36px',
        },
        on: {click: () => this.select_datasource(datasource)},
        key: datasource.id
      }, [
        h('i', {
          staticClass: 'mdi ' + datasource_type_enum[datasource.type].icon + ' text-' + datasource_type_enum[datasource.type].color,
          style: {
            fontSize: '22px'
          }
        }),
        h('div', {
          staticClass: 'ellipsis col-grow',
        }, [
          h('span', datasource.name)
        ]),
        h('div', {
          style: {
            width: '30px',
            minWidth: '30px'
          }
        }, [base_status_enum[datasource.status].label])
      ])
    },
    render_datasource_catalog(h) {
      return h('div', {
        style: {
          width: '200px',
        }
      }, [this.datasource_list != null && this.datasource_list && this.datasource_list.map(p => [
        this.render_datasource_catalog_item(h, p),
        h('q-item-separator', {staticClass: 'q-ma-none'})
      ])])
    },
    refresh_catalog(v) {
      this.datasource_list = []
      this.collection_list = []
      if (v && typeof v !== 'undefined') {
        this.group = v.group || null
        this.datasource = v.datasource || null
        this.$emit('select', this.datasource)
      }
      this.search_all_datasource_list(this.kw)
    },
    search_all_datasource_list(kw = this.kw) {
      kw = kw ? kw : null
      let vm = this
      ajax_datasource_search(kw, null, this.query_type)
        .then(data => {
          if (data.status === 1) {
            vm.collection_list = vm.collection_list.concat(this.deal_data_to_folder_list(data.data) || [])
            if (this.group !== null) {
              vm.collection_list.forEach(c => {
                if (c.group_id === this.group.group_id) {
                  this.group = c
                }
              })

            } else if (this.group === null) {
              vm.collection_list.length > 0 && (this.group = vm.collection_list[0])
            }
            if (this.group !== null && this.group.children) {
              this.datasource_list = this.group.children || []
              this.datasource_list.length > 0 && this.datasource === null && this.select_datasource(this.datasource_list[0])
            }
          }
        })
        .catch(() => this.$q.err('获取排查工具列表异常'))
    },
    select_datasource(datasource) {
      this.datasource = datasource;
      this.$emit('select', datasource)
    },
    select_group(group) {
      this.group = group
      this.datasource_list = group.children || []
      this.datasource = null
      this.datasource_list.length > 0 && this.datasource === null && this.select_datasource(this.datasource_list[0])

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

    return h('transition', {props: {appear: true, mode: 'out-in', enterActiveClass: 'animate-popup-down'}}, [
      h('div', {
        style: {
          height: '96%'
        }
      }, [
        h(PpNavigator, {
          props: {value: this.query_type, options: Object.keys(query_type)},
          scopedSlots: {item: t => query_type[t]},
          on: {
            select: v => {
              this.query_type = v;
            }
          }
        }),
        this.render_search(h),
        h('div', {
          staticClass: 'no-wrap row',
          style: {
            height: '100%'
          }
        }, [
          this.render_group_catalog(h),
          this.render_datasource_catalog(h)
        ]),

      ])
    ])
  },
}
