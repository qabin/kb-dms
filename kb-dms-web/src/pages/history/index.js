import CompSqlExeResultCatalog from './comp_sql_exe_result_catalog'
import CompSqlExeResultToolBar from './comp_sql_exe_result_tool_bar'

export default {
  name: 'history_index',
  data: () => ({}),
  methods: {},
  mounted() {
  },
  render(h) {
    return h('div', {}, [
      h(CompSqlExeResultToolBar, {
        on: {
          kw: (v) => {
            this.$refs.CompSqlExeResultCatalog && this.$refs.CompSqlExeResultCatalog.refresh_kw(v)
          },
          query_by: (v) => {
            this.$refs.CompSqlExeResultCatalog && this.$refs.CompSqlExeResultCatalog.refresh_query_by(v)
          },
          query_type: (v) => {
            this.$refs.CompSqlExeResultCatalog && this.$refs.CompSqlExeResultCatalog.refresh_query_type(v)
          }
        }
      }),
      h(CompSqlExeResultCatalog, {
        ref: 'CompSqlExeResultCatalog',
        staticClass: 'q-mt-sm'
      }),
    ])
  }
}
