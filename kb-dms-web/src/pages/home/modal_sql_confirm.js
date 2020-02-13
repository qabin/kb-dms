import Editor from '../../plugins/sql_exe_editor/editor'
import ModalMixin from '../../components/modal/MixinsBaseModal'
import {ajax_sql_exe_async} from "../../api/utils/sql_exe_utils_api";
import CompExeResult from './comp_exe_result'

export default {
  name: 'modal_sql_confirm',
  mixins: [ModalMixin],
  computed: {
    exe_success() {
      return this.$store.state.home.exe_success;
    }
  },
  watch: {
    exe_success: {
      immediate: true,
      handler: function (v) {
        if (v) {
          setTimeout(() => {
            this.hide()
            this.$store.state.home.exe_success = false;
          }, 500)
        }
      }
    }
  },
  data: () => ({
    sql: null,
    datasource_id: null,
    db: null,
    minWidth: '60vw',
    maxWidth: '60vw',
  }),
  methods: {
    title() {
      return '确认将要执行的SQL信息'
    },
    __render_contents(h) {
      return h('div', {
        // staticClass: 'q-pa-sm',
        style: {
          maxHeight: `calc(${this.minHeight} - 43px - 45px)`,
          overflow: 'auto'
        }
      }, [
        this.render_contents(h),
      ])
    },
    __render_title(h) {
      return h('div', {
        staticClass: 'font-14 text-weight-bold bg-grey-3',
        style: {padding: '13px 3px'}
      }, [
        this.title(h)
      ])
    },
    __render_footer(h) {
      return h('div', {
        staticClass: 'row items-center justify-end',
        style: {height: '48px', minHeight: '48px', borderTop: '1px solid var(--q-color-grey-4)'}
      }, [
        this.render_foot_left(h),
        h('div', {staticClass: 'col-grow'}),
        h('q-btn', {
          staticClass: 'q-pt-none q-pb-none q-mr-md shadow-0',
          style: {minHeight: '32px', height: '32px', fontSize: '12px', width: '75px'},
          props: {label: '执行', size: 'md', color: 'blue-6', loading: this.loading},
          on: {
            click: this.__submit
          }
        }),
        h('q-btn', {
          staticClass: 'q-pt-none q-pb-none q-mr-md shadow-0',
          style: {minHeight: '32px', height: '32px', fontSize: '12px', width: '75px'},
          props: {label: '取消', flat: true, size: 'md', color: 'faded'},
          on: {
            click: this.cancel
          },
          directives: [{name: 'close-overlay'}]
        })
      ])
    },
    render_contents(h) {
      return h('div', {}, [
        h(Editor, {
          props: {
            disable: true,
            value: this.sql,
            width: '100%',
            toolbar: false,
            height: '300px'
          }
        }),
        h(CompExeResult, {
          props: {
            show_tools_bar: false
          },
          ref: 'CompExeResult',
        }),
      ])

    }
    ,
    show(v) {
      this.opened = true;
      this.$refs.CompExeResult.data_clear()

      this.sql = v.sql
      this.datasource_id = v.datasource_id
      this.db = v.db
    }
    ,
    hide() {
      this.opened = false
    },
    __submit() {
      ajax_sql_exe_async(this.datasource_id, this.db, this.sql).then(d => {
        this.$refs.CompExeResult.refresh_sql_exe_record_id(d.data)
      })
    }
  },

}
