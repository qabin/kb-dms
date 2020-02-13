import BusGroupConfig from './group_config/index'
import AdminConfig from './admin/index'
import DataSourceConfig from './datasource/index'

export default {
  name: "system_config",
  data: () => ({
    selected: 'datasource_config',
  }),
  computed: {
    menu() {
      let menu = {};
      menu['datasource_config'] = '数据源配置';
      menu['group_config'] = '团队管理';
      if (this.$store.state.user.is_admin) {
        menu['admin_config'] = '管理员配置';
      }
      return menu
    },
    path() {
      return this.$route.path
    },
  },
  watch: {
    path(v) {
      v === '/system_config' && (this.selected = 'trouble_config')
    }
  },
  methods: {
    render_config_menu(h) {
      return h('div', {
        staticClass: 'font-14 text-dark q-pt-sm column',
        style: {borderRight: '1px solid var(--q-color-grey-5)', paddingRight: '4px'}
      }, Object.keys(this.menu).map(k => this.render_menu_item(h, k)))
    },
    render_menu_item(h, key) {
      let is_selected = this.selected === key;
      return h('div', {
        staticClass: 'pp-selectable-bg cursor-pointer pp-radius-2 text-center',
        'class': {
          'text-primary': is_selected,
          'text-weight-bold': is_selected,
        },
        style: {width: '150px', lineHeight: '34px'},
        on: {click: () => this.selected = key}
      }, this.menu[key])
    },
    render_content(h) {
      switch (this.selected) {
        case 'group_config':
          return h(BusGroupConfig);
        case 'admin_config':
          return h(AdminConfig);
        case 'datasource_config':
          return h(DataSourceConfig);
      }
    }
  },
  render(h) {
    return h('div', {
      staticClass: 'row col-grow no-wrap q-pl-xs',
      style: {
        marginTop: '-10px',
        minHeight: '100vh'
      }
    }, [
      this.render_config_menu(h),
      this.render_content(h)
    ])
  }
}
