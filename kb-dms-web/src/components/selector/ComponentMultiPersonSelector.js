import SelectorMixin from  './MixinSelectorBase'
import PluginMultiSelector from './PluginMultiSelector'
import SelectorQueryFilterPlugin from '../selector/PluginSelectorOptionsQueryFilter'
import {ajax_search_user} from "../../api/user/user_info_api";
import {setFavoriteUser, getFavoriteUsers} from '../../utils/favorite_user_selection'

export default {
  mixins: [SelectorMixin, PluginMultiSelector, SelectorQueryFilterPlugin],
  data: () => ({
    favorite: [],
    distinctKey: 'account',
  }),
  methods: {

    render_field_prefix(h, value) {
      return this.$slots.before
    },

    render_field_content(h, value) {
      return !value || value.length === 0
        ? this.__render_placeholder(h)
        : h('div', {staticClass: 'flex', style: {marginLeft: '-4px'}},
          this.value.map(i => h('div', {staticClass: 'flex no-wrap items-center q-mr-sm'}, this.render_field_item(h, i)))
        )
    },
    render_field_item(h, value) {
      return [
        h('q-checkbox', {
          staticClass: 'no-ripple',
          props: {
            value: true,
            disable:this.disable
          },
          on: {input: v => this.__select(v, value)}
        }),
        h('span', {staticClass: 'font-12'}, value.name),
      ]
    },
    render_list_content(h, value) {
      return [
        h('div', {staticClass: 'q-mr-xs font-12 text-no-wrap', style: {minWidth: '38px'}}, value.name),
        h('span', {staticClass: 'text-faded font-12'}, value.account),
      ]
    },
    show() {
      this.favorite = getFavoriteUsers(5);
    },
    // overwrite mixin start
    __select(v, value) {
      let res = v ? this.value.concat(value) : this.value.filter(i => !this.__is_same(i, value));
      this.$emit('input', res);
      v && setFavoriteUser(value)
    },
    __render_list(h) {
      return h('q-list', {
          staticClass: 'q-pt-xs q-pb-xs column no-border',
          props: {link: true, dense: true}
        }, [
          this.kw
            ? this.__render_list_content(h)
            : this.render_list_favorite(h)
        ]
      )
    },
    // overwrite mixin end
    render_list_favorite(h) {
      return [
        h('q-list-header', {staticClass: 'no-padding q-ml-xs', style: {fontSize: '12px', minHeight: '14px'}}, '常用'),
        this.favorite && this.favorite.length > 0
          ? this.__render_list_content(h, this.favorite)
          : null
      ]
    },
    search(kw = this.kw) {
      kw && ajax_search_user(kw)
        .then(response => {
          if (response.status === 1) {
            this.raw_options = response.data;
          }
        });
    }
  }
}
