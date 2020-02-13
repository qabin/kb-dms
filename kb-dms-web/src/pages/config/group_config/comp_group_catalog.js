import {ajax_bus_group_search} from "../../../api/config/bus_group_api";
import LazyInput from "../../../components/catalog/ComponentLazyInput";
import {base_status_enum} from "../../../utils/config_dictionary";
import PpNavigator from '../../../components/elements/pp_navigator'

const query_type = {
  all: '所有',
  created_by_me: '我创建的',
  owner_by_me: '我负责的',
};
export default {
  name: 'comp_group_catalog',
  data: () => ({
    groups: [],
    group: null,
    page: 1,
    size: 50,
    no_more_group: false,
    query_type: 'all',
    kw: null
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
      return h(LazyInput, {
        staticClass: 'pp-search-input',
        style: {
          margin: '3px',
        },
        props: {value: this.kw, placeholder: '按名称查找', width: '100%'},
        on: {
          input: v => {
            this.kw = v;
            this.$nextTick(this.refresh_catalog)
          }
        }
      })
    },
    render_group_catalog_item(h, group) {
      return h('div', {
        staticClass: 'pp-selectable-bg q-pl-sm q-pr-sm flex no-wrap justify-between cursor-pointer text-left',
        'class': {
          'pp-selected-bg': this.group && this.group.id === group.id
        },
        style: {
          lineHeight: '36px',
          width: '300px'
        },
        on: {click: () => this.select_group(group)},
        key: group.id
      }, [
        h('div', {
          staticClass: 'ellipsis',
        }, group.name),
        h('div', {
          style: {
            width: '50px'
          }
        }, [base_status_enum[group.status].label])
      ])
    },
    refresh_catalog() {
      this.groups = [];
      ajax_bus_group_search(this.kw, null, this.query_type)
        .then(data => {
          this.no_more_group = !data.data || data.data.length === 0 || data.data.length < this.size;
          this.groups = this.groups.concat(data.data || []);
          !this.group && this.groups.length > 0 && this.select_group(this.groups[0])
        })
        .catch(() => this.$q.err('获取业务团队列表异常'))
    },
    select_group(group) {
      this.group = group;
      this.$emit('input', group)
    }
  },
  render(h) {
    return h('transition', {props: {appear: true, mode: 'out-in', enterActiveClass: 'animate-popup-down'}}, [
      h('div', {
        staticClass: 'font-13 text-dark scroll',
        style: {
          width: '300px',
          minWidth: '300px'
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
        this.groups.map(p => [
          this.render_group_catalog_item(h, p),
          h('q-item-separator', {staticClass: 'q-ma-none'})
        ]),
      ])
    ])
  },
}
