import PpSection from '../../../components/elements/pp_section'
import {formatDate} from "quasar-framework/src/utils/date";
import {ajax_get_bus_group, ajax_update_bus_group} from "../../../api/config/bus_group_api";
import GroupUsers from './comp_group_users'
import PersonSelector from "../../../components/selector/ComponentMultiPersonSelector";
import {ajax_update_bus_group_owners, ajax_bus_group_owners_search} from "../../../api/config/bus_group_owners_api";
import {ajax_get_group_update_permission} from "../../../api/permission/sql_options_api";

export default {
  name: 'comp_group_detail',
  data: () => ({
    group: {},
    owners: [],
    update_permission: false,
  }),
  methods: {
    render_base_info(h) {
      return h(PpSection, {
        staticClass: 'q-mb-md',
      }, [
        h('div', {slot: 'label', staticClass: 'q-mr-xs text-weight-bold'}, ['基础信息']),
        h('div', {staticClass: 'row no-wrap'}, [
          h('div', {staticClass: 'col-12'}, [
            this.render_tr(h, '名称：', h('q-input', {
              props: {
                placeholder: '请输入团队',
                value: this.group.name,
                hideUnderline: true,
                disable: !this.update_permission,
                after: [
                  {
                    icon: 'keyboard_return', handler: () => {
                      ajax_update_bus_group(this.group.id, this.group.name).then(d => {
                        if (d.status === 1) {
                          this.$emit('update')
                          this.$q.ok('修改成功!');
                        } else {
                          this.$q.err(d.message);
                        }
                      })
                    }
                  }
                ],
              },
              on: {
                input: (v) => this.group.name = v
              }
            })),
            this.render_tr(h, '负责人：', h(PersonSelector, {
              props: {
                value: this.owners,
                placeholder: '请选择负责人',
                disable: !this.update_permission,
              },
              on: {
                input: (v) => {
                  this.owners = v
                  ajax_update_bus_group_owners(this.group.id, this.owners).then().catch()
                }
              }
            })),
            this.render_tr(h, '创建人：', this.group.creator_name),
            this.render_tr(h, '创建时间：', formatDate(this.group.create_time, 'YYYY-MM-DD HH:mm:ss')),
            this.render_tr(h, '激活：', h('q-toggle', {
              staticClass: 'text-left',
              props: {
                leftLabel: true,
                value: this.group.status === 1 ? true : false,
                color: 'deep-orange',
                disable: !this.update_permission,

              },
              on: {
                input: (v) => {
                  this.group.status = v === true ? 1 : -1
                  ajax_update_bus_group(this.group.id, null, this.group.status).then(d => {
                    if (d.status === 1) {
                      if (v === true) {
                        this.$q.ok("已激活！")
                      } else {
                        this.$q.ok("已失效！")
                      }
                    }
                  })
                }
              }
            }))

          ]),
        ])
      ])
    },
    render_tr(h, key, value, value_cls = 'q-pa-xs text-tertiary') {
      return h('tr',
        {
          staticClass: 'text-left'
        }, [
          h('td', {
            staticClass: 'q-pa-xs',
            style: {
              textAlign: 'left',
              whiteSpace: 'nowrap',
            }
          }, key),
          value
            ? h('td', {
              staticClass: value_cls,
            }, [value])
            : h('td', {
              staticClass: value_cls,
            }, '--')
        ])
    },
    select_group(group) {
      if (group && group.id) {
        this.query_group(group.id);
        this.$refs.GroupUsers.query(group.id);
      }
    },

    query_group(group_id) {
      ajax_get_group_update_permission(group_id).then(d => {
        if (d.status === 1) {
          this.update_permission = d.data
        }
      }).then(() => {
        ajax_get_bus_group(group_id)
          .then(date => this.group = date.data || {})
          .catch(() => this.$q.err('获取业务团队异常'));
        ajax_bus_group_owners_search(group_id).then(d => {
          this.owners = d.data || []
        }).catch()
      })
    },
  },
  render(h) {
    return h('transition', {props: {appear: true, mode: 'out-in', enterActiveClass: 'animate-popup-down'}}, [
      h('div', {
        staticClass: 'scroll',
        style: {
          paddingLeft: '10px',
          paddingTop: '3px'
        }
      }, [
        this.render_base_info(h),
        h(GroupUsers, {
          ref: 'GroupUsers', props: {
            disable: !this.update_permission
          }
        }),
      ])
    ])
  }
}
