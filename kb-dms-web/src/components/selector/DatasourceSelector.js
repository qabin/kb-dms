import LazyInput from "../catalog/ComponentLazyInput";
import {ajax_datasource_search} from "../../api/config/datasource_api";
import {datasource_type_enum} from "../../utils/config_dictionary";

export default {
  name: 'datasource_selector',
  data: () => ({
    kw: null,
    group: null,
    groups: [],
    data: [],
    collection_list: [],
    datasource_list: [],
    datasource: null,
    no_more_datasource: false,
  }),
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
        }
      }, [this.collection_list.map(p => [
        this.render_group_catalog_item(h, p),
        h('q-item-separator', {staticClass: 'q-ma-none'})
      ])])
    },
    render_datasource_catalog_item(h, datasource) {
      return h('div', {
        staticClass: 'pp-selectable-bg q-pl-sm q-pr-sm flex no-wrap justify-between cursor-pointer text-left',
        style: {
          lineHeight: '36px',
        },
        on: {click: () => this.select_datasource(datasource)},
        key: datasource.id
      }, [
        h('div', {
          staticClass:'row'
        }, [
          h('i', {
            staticClass: 'mdi '+datasource_type_enum[datasource.type].icon+' text-'+datasource_type_enum[datasource.type].color,
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
    render_datasource_catalog(h) {
      return h('div', {
        style: {
          width: '150px',
        }
      }, [this.datasource_list != null && this.datasource_list && this.datasource_list.map(p => [
        this.render_datasource_catalog_item(h, p),
        h('q-item-separator', {staticClass: 'q-ma-none'})
      ])])
    },
    refresh_catalog() {
      this.datasource_list = []
      this.collection_list = []
      this.datasource = null
      this.group = null
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
      staticClass: 'font-13 column',
      style: {
        minHeight: '300px'
      }
    }, [
      this.render_search(h),
      h('div', {
        staticClass: 'no-wrap row col-grow',
      }, [
        this.render_group_catalog(h),
        this.render_datasource_catalog(h)
      ]),

    ])
  },
  mounted() {
    this.refresh_catalog()
  }
}
