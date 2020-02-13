import SelectorMixin from '../selector/MixinSelectorBase'
import SelectorQueryFilterPlugin from '../selector/PluginSelectorOptionsQueryFilter'
import {ajax_search_user} from "../../api/user/user_info_api";
import {setFavoriteUser, getFavoriteUsers} from '../../utils/favorite_user_selection'

export default {
  mixins: [SelectorMixin, SelectorQueryFilterPlugin],
  props: {
    clear: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    favorite: [],
  }),
  methods: {
    render_field_content(h, value) {
      return h('div', {
        staticClass: 'full-width flex no-wrap justify-between items-center'
      }, [
        h('div', {staticClass: 'q-mr-xs'}, [
          value.displayName,
          h('span', {staticClass: 'text-faded q-ml-xs'}, value.account)
        ]),
        this.clear
          ? h('q-icon', {
            staticClass: 'font-12 bg-faded text-white pp-radius-3',
            props: {name: 'clear'},
            nativeOn: {
              click: e => {
                e.stopPropagation();
                this.$nextTick(() => this.$emit('input', null));
              }
            }
          })
          : null
      ])
    },
    render_list_content(h, value) {
      return [
        h('span', {staticClass: 'q-ml-xs q-mr-xs font-12', style: {minWidth: '38px'}}, value.user),
        h('span', {staticClass: 'text-faded font-12'}, value.account),
      ]
    },
    show() {
      this.favorite = getFavoriteUsers(5);
    },
    __select(v) {
      this.$emit('input', v);
      setFavoriteUser(v)
    },
    __render_list(h) {
      return h('q-list', {
          staticClass: 'q-pt-xs q-pb-xs no-border',
          props: {link: true, dense: true}
        },
        [
          this.kw
            ? this.__render_list_content(h)
            : this.render_list_favorite(h),
        ]
      )
    },
    search(kw = this.kw) {
      kw && ajax_search_user(kw).then(data => this.raw_options = data.data);
    },
    render_list_favorite(h) {
      return [
        h('q-list-header', {staticClass: 'no-padding q-ml-xs', style: {fontSize: '12px', minHeight: '14px'}}, '常用'),
        this.favorite && this.favorite.length > 0
          ? this.__render_list_content(h, this.favorite)
          : []
      ]

    }
  }
}
