import PpSectionCard from "../../../components/elements/pp_section_card";
import CatalogBase from "../../../components/catalog/MixinCatalogBase";
import {generic_button, user_selector} from "../../../components/GenericFormUI";
import icon_btn_improve from "../../../components/elements/icon_btn_improve";
import {
  ajax_get_datasource_permission_member,
  ajax_add_datasource_permission_member,
  ajax_delete_datasource_permission_member
} from "../../../api/config/datasource_permission_member_api";
import {ajax_get_sql_options} from "../../../api/permission/sql_options_api";
import {
  ajax_add_datasource_permission_sql_options,
  ajax_delete_datasource_permission_sql_options
} from "../../../api/config/datasource_permission_sql_options_api";

import {ajax_get_datasource, ajax_update_datasource} from "../../../api/config/datasource_api";
import {ajax_get_datasource_update_permission} from "../../../api/permission/sql_options_api";

const contains = (arr, e) => {
  return arr.some(a => a.option_type === e.type);
}

const check_btn = {
  props: {value: Boolean, disable: Boolean},
  render(h) {
    return this.render_btn(h)
  },
  methods: {
    render_btn(h) {
      let icon = this.value ? 'check_box' : 'check_box_outline_blank';
      return h('i', {
        staticClass: 'material-icons font-16 text-center',
        'class': {
          'cursor-not-allowed': this.disable,
          'cursor-pointer': !this.disable,
          'text-primary': this.value,
          'text-faded': !this.value
        },
        style: {
          opacity: this.disable ? 0.5 : 1,
          width: '20px',
          height: '20px',
          lineHeight: '20px',
          flexShrink: 0
        },
        on: {click: () => this.disable ? null : this.$emit('input', !this.value)}
      }, icon)
    }
  }
};

export default {
  name: 'section_datasource_permission',
  props: {datasource_id: [String, Number], disable: Boolean},
  mixins: [CatalogBase],
  data: () => ({
    table_columns: [],
    query_switch: true,
    update_permission: false,
  }),
  watch: {
    datasource_id: {
      handler() {
        this.request();
        this.request_get_query_switch();
      },
      immediate: true
    }
  },
  mounted() {
    this.assemble_column();
  },
  methods: {
    render_scope_slot(h, scope) {
      scope['header'] = (props) => h('q-tr', {props}, this.table_columns.map(c =>
        h('q-td', {
          staticClass: 'font-12 text-faded text-weight-medium', 'class': [c.label_bg, `text-${c.align || 'center'}`],
          props, key: c.name
        }, [
          c.header_render ? c.header_render(h) : c.label
        ])));
    },
    assemble_column() {
      ajax_get_sql_options()
        .then(d => {
          let options = d.data
          let arr = [];

          arr.push({
            name: 'name', align: 'left', field: 'name', label: '账号',
            header_render: (h) => h('div', {staticClass: 'flex no-wrap items-center'}, [
              h(user_selector, {
                staticClass: 'no-border no-padding',
                props: {
                  multiple: false,
                  filter_out_account: this.rows.map(r => r.account),
                  auto_hide: false,
                  include_group: true,
                  disable: this.disable
                },
                on: {input: this.add_member},
                scopedSlots: {
                  field_content: (v, h) => h(generic_button, {
                    staticClass: 'font-12 q-py-xxs',
                    style: {minHeight: '26px', lineHeight: '26px'},
                    props: {
                      outline: true,
                      color: 'primary',
                      label: '添加人员',
                      disable: !this.update_permission
                    }
                  })
                },
                slot: 'before',
              })
            ]),
            renderData: {style: {width: '200px'}},
            render: (h, props) => {
              let user = props.row;
              return h('div', {staticClass: 'flex no-wrap items-center'},
                [
                  h('i', {staticClass: 'material-icons text-faded pp-radius font-16 q-mr-xs'}, 'person'),
                  h('div', user.name),
                  h('div', {staticClass: 'q-ml-xs'}, user.account),
                ]
              )
            }
          });

          arr.push({
            name: 'auth_space',
            header_render: h => h('div', {staticClass: 'text-right font-14 text-light'}, '权限'),
            render: (h) => ''
          });
          options.forEach((option, i) => arr.push({
            name: option.type, align: 'center', field: 'auth_list',
            label: option.desc, label_bg: i % 2 === 0 ? 'bg-grey-2' : '',
            renderData: {'class': {'bg-grey-2': i % 2 === 0}},
            render: (h, props) => h(check_btn, {
              staticClass: 'pp-selectable-bg-grey-4 pp-radius ',
              props: {value: contains(props.value, option), disable: !this.update_permission},
              on: {input: v => this.update_auth(v, props.row.account, option.type)}
            })
          }));

          arr.push({
            name: 'remove', align: 'center',
            render: (h, props) => h(icon_btn_improve, {
              props: {color: 'faded', disable: !this.update_permission, tooltip: '移除人员'},
              on: {input: () => this.delete(props.row)}
            }, 'delete')
          });

          this.table_columns = this.table_columns.concat(arr);
        })
        .catch(() => this.$q.err('获取数据异常'))
    },
    request() {

      this.datasource_id && ajax_get_datasource_update_permission(this.datasource_id).then(d => {
          if (d.status === 1) {
            this.update_permission = d.data
          }
        }
      ).then(() => {
        ajax_get_datasource_permission_member(this.datasource_id)
          .then(d => {
            this.rows = d.data || [];
            this.rowsNumber = d.data.length;
          })
          .catch(() => this.$q.err('获取人员异常'))
      })
    },
    request_get_query_switch() {
      this.datasource_id && ajax_get_datasource(this.datasource_id).then(d => this.query_switch = d.data.query_switch === 1 ? true : false).catch(() => this.$q.err('获取权限控制标识位异常'))
    },
    add_member(user) {
      let model = {account: user.account, name: user.name};
      this.datasource_id && ajax_add_datasource_permission_member(this.datasource_id, model).then(this.request).catch(() => this.$q.err('添加人员异常'))
    },
    delete(user) {
      user && user['account'] && ajax_delete_datasource_permission_member(this.datasource_id, user['account']).then(this.request).catch(() => this.$q.err('删除人员异常'))
    },
    update_auth(decision, account, option_type) {
      if (account && option_type) {
        decision
          ? ajax_add_datasource_permission_sql_options(this.datasource_id, {
            account: account,
            option_type: option_type
          }).then(this.request).catch(() => this.$q.err('添加权限异常'))
          : ajax_delete_datasource_permission_sql_options(this.datasource_id, {
            account: account,
            option_type: option_type
          }).then(this.request).catch(() => this.$q.err('移除权限异常'))
      }
    },
    update_query_switch(v) {
      this.datasource_id && ajax_update_datasource(this.datasource_id, {query_switch: v ? 1 : -1}).then(this.request_get_query_switch).catch(() => this.$q.err('更新权限控制标识位异常'))
    },
  },
  render(h) {
    return h(PpSectionCard, [
      h('q-table', {
        staticClass: 'shadow-0 overflow-hidden',
        props: {
          dense: true,
          color: 'primary',
          data: this.rows,
          columns: this.table_columns,
          pagination: {rowsPerPage: null},
          rowKey: 'account',
          noDataLabel: '无数据',
          hideBottom: true,
          hideHeader: false,
          readonly: !this.update_permission,
          disable: !this.update_permission,
        },
        scopedSlots: this.__render_scope_slot(h),
        on: {request: this.__request}
      }),
      h('div', {slot: 'before'}, [
        h('div', {staticClass: 'flex no-wrap items-center'}, [
          h('div', {staticClass: 'q-mr-sm font-13 text-tertiary text-weight-medium'}, '开放查询权限'),
          h('q-toggle', {
            staticClass: 'no-ripple',
            props: {value: this.query_switch, disable: !this.update_permission},
            on: {input: this.update_query_switch},
          })
        ]),
        h('div', {staticClass: 'font-11 text-grey q-mb-sm'}, ['勾选"开放查询权限"后，未配置权限的同学均可进行查询操作！']),
      ])
    ])
  }
}
