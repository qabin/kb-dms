import PpSection from "../../../components/elements/pp_section";
import {user_selector} from '../../../components/GenericFormUI'
import icon_btn_improve from '../../../components/elements/icon_btn_improve'
import {
  ajax_admin_search,
  ajax_delete_admin,
  ajax_add_admin
} from "../../../api/config/admin_api";

export default {
  name: 'comp_admin_catalog',
  props: {
    disable: Boolean,
  },
  data: () => ({
    steps: [{id:1,name:'STEP1'}],
    edit_mode: false,
    users:[],
  }),
  computed:{
    c_members() {
      let res = {};
      this.users.forEach(m => {
        if (m.account) {
          let c = m.account[0];
          let tmp = res[c] || [];
          tmp.push(m);
          res[c] = tmp;
        }
      });
      return res;
    }
  },
  methods: {
    render_admin_catalog(h) {
      let letters = Object.keys(this.c_members);

      return h('div', {staticClass: 'column no-wrap q-py-sm'},
        letters.length
          ? letters.map(c => h('div', {staticClass: 'flex items-start no-wrap q-mb-md'}, [
            h('div', {
              staticClass: 'font-18 text-faded',
              style: {height: '26px', lineHeight: '26px', width: '30px', flexShrink: 0}
            }, c.toUpperCase()),
            this.render_group_members(h, this.c_members[c])
          ]))
          : [h('div', {staticClass: 'text-light'}, '无数据')]
      )
    },
    render_group_members(h, members) {
      return h('div', {
          staticClass: 'flex',
        }, members.map(u => this.render_group_member_item(h, u))
      )
    },
    render_group_member_item(h, user) {
      return h('div', {
        staticClass: 'flex no-wrap items-center justify-between pp-border pp-radius bg-grey-2 q-px-xs q-mr-md q-mb-xs',
        style: {height: '26px', lineHeight: '26px', width: '165px', flexShrink: 0}
      }, [
        h('div', {
          staticClass: 'text-tertiary text-weight-medium ellipsis',
        }, `${user.name}（${user.account}）`),
        h('q-icon', {
          staticClass: 'font-16 cursor-pointer text-grey-4 pp-selectable-color-red',
          props: {name: 'cancel'},
          nativeOn: {click: () => this.remove_user(user)}
        }),
      ])
    },
    remove_user(user) {
      if (user && user.account)
        ajax_delete_admin(user.account).then(this.refresh).catch(() => this.$q.err('删除失败'))
    },
    refresh() {
      ajax_admin_search()
        .then(d => this.users = (d.data || []))
        .catch(() => this.$q.err('查询人员列表异常'))
    },

  },
  render(h) {
    return h(PpSection, {
      staticClass: 'q-mb-md',
      props: {label: '添加管理员', collapse: false}
    }, [
      this.render_admin_catalog(h),

      h(user_selector, {
        staticClass: 'no-border no-padding',
        props: {
          multiple: false,
          filter_out_account: this.users.map(r => r.account),
          auto_hide: false
        },
        on: {
          input: (v)=>{
            ajax_add_admin(v.name,v.account).then(d=>{
              if(d.status===1){
                this.refresh()
              }else{
                this.$q.err(d.message)
              }
            })
          }
        },
        scopedSlots: {
          field_content: (v, h) => h(icon_btn_improve, {props: {tooltip: '添加人员'}}, 'add')
        },
        slot: 'before',
      })
    ])
  }
}
