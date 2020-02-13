import LazyInput from "../../components/catalog/ComponentLazyInput"

export default {
  name: 'comp_selector_catalog',
  props: {
    value: {type: Object},
    query_func: {type: Function, required: true},
    group_id: {type: String, required: true},
    group_name: {type: String, required: true}
  },
  data: () => ({
    kw: null,
    item: {},
    item_list: [],
    group: {},
    groups: [],
    collection_list: [],
  }),
  watch: {
    value: {
      handler(nv, ov) {
        if (nv) {
          this.value[this.group_id] && this.collection_list.forEach(c => {
            if (c[this.group_id] === this.value[this.group_id]) {
              this.select_group(c)
            }
          })
          this.item = this.value
        }
      },
      immediate: true,
      deep: true
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
          'bg-grey-3': this.group && this.group[this.group_id] === group[this.group_id]
        },
        style: {
          lineHeight: '36px',
        },
        on: {click: () => this.select_group(group)},
        key: group[this.group_id]
      }, [
        h('div', {
          staticClass: 'ellipsis',
        }, group[this.group_name]),
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
    render_child_catalog_item(h, item) {
      return h('div', {
        staticClass: 'pp-selectable-bg q-pl-sm q-pr-sm flex no-wrap justify-between cursor-pointer text-left',
        'class': {
          'pp-selected-bg': this.item && this.item.id === item.id
        },
        style: {
          lineHeight: '36px',
        },
        on: {click: () => this.select_item(item)},
        key: item.id
      }, [
        h('div', {
          staticClass: 'ellipsis',
        }, item.name),
        h('div', {
          style: {
            width: '50px'
          }
        },)
      ])
    },
    render_child_catalog(h) {
      return h('div', {
        style: {
          width: '200px',
        }
      }, [this.item_list != null && this.item_list && this.item_list.map(p => [
        this.render_child_catalog_item(h, p),
        h('q-item-separator', {staticClass: 'q-ma-none'})
      ])])
    },
    refresh_catalog() {
      this.item_list = []
      this.collection_list = []
      this.item = null
      this.group = null
      this.search_all_item_list(this.kw)
    },
    search_all_item_list() {
      let vm = this

      this.query_func(this.kw)
        .then(data => {
          if (data.status === 1) {
            vm.collection_list = vm.collection_list.concat(this.deal_data_to_folder_list(data.data) || [])
            this.group === null && vm.collection_list.length > 0 && (this.group = vm.collection_list[0])
            if (this.group !== null && this.group.children) {
              this.item_list = this.group.children || []
              this.item_list.length > 0 && this.item === null && (this.item = this.item_list[0])
            }
          }
        })
        .catch(() => this.$q.err('获取模块异常'))
    },
    select_item(item) {
      this.item = item;
      this.$emit('select', item)
    },
    select_group(group) {
      this.group = group
      this.item_list = group.children || []
      // this.item = null
      // this.item_list.length > 0 && this.item === null && this.select_item(this.item_list[0])

    },
    deal_data_to_folder_list(v) {
      let folder_list = [];
      v.map(d => {
        let folder_map = {}
        let contain_flag = false
        let index = 0;
        for (let i = 0; i < folder_list.length; i++) {
          if (folder_list[i][this.group_id] === d[this.group_id]) {
            contain_flag = true
            index = i
            break
          }
        }
        if (contain_flag) {
          let children = (folder_list[index]).children
          d.id && children.push(d)

          folder_map[this.group_id] = d[this.group_id]
          folder_map.children = children
          folder_map[this.group_name] = d[this.group_name]

          folder_list.splice(index, 1, folder_map)
        } else {
          let children = []
          d.id && children.push(d)

          folder_map[this.group_id] = d[this.group_id]
          folder_map.children = children
          folder_map[this.group_name] = d[this.group_name]

          folder_list.push(folder_map)
        }
      })
      return folder_list
    },
  },
  render(h) {
    return h('div', {
      style: {
        height: '96%'
      }
    }, [
      this.render_search(h),
      h('div', {
        staticClass: 'no-wrap row',
        style: {
          height: '100%'
        }
      }, [
        this.render_group_catalog(h),
        this.render_child_catalog(h)
      ]),

    ])
  },
  mounted() {
    this.refresh_catalog()
  }
}
