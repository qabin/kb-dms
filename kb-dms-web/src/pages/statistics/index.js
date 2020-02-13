import dash_card_simple from './comp_dash_card_simple'
import {assembleChartData, drawChart} from "../../components/echarts/echarts_tools"
import 'echarts/theme/macarons.js'
import {
  ajax_get_general_all_biz_total,
  ajax_get_general_month_timeline
} from "../../api/statistics/general_statistics_api"

const border = {border: '1px solid var(--q-color-grey-4)'}

export default {
  name: 'statistics_index',
  data: () => ({
    general_count_data: {},
    general_month_timeline_view: null,
    general_month_timeline_data: {},
  }),
  computed: {},
  methods: {
    initData() {

      ajax_get_general_month_timeline().then(d => {
        if (d.status === 1) {
          let trend_series = new Array(d.data.map(res => res.sql_exe_result_total == null ? 0 : res.sql_exe_result_total),
            d.data.map(res => res.sql_exe_result_success_total == null ? 0 : res.sql_exe_result_success_total),
            d.data.map(res => res.sql_exe_result_running_total == null ? 0 : res.sql_exe_result_running_total),
            d.data.map(res => res.sql_exe_result_fail_total == null ? 0 : res.sql_exe_result_fail_total),
            d.data.map(res => res.sql_syntax_error_total == null ? 0 : res.sql_syntax_error_total),
            d.data.map(res => res.sql_syntax_no_permission_total == null ? 0 : res.sql_syntax_no_permission_total),
            d.data.map(res => res.sql_syntax_no_where_total == null ? 0 : res.sql_syntax_no_where_total),
            d.data.map(res => res.sql_syntax_no_limit_total == null ? 0 : res.sql_syntax_no_limit_total),
          )

          let trend_xData = d.data.map(res => res.date)

          this.general_month_timeline_data = assembleChartData(this.general_month_timeline_data, '执行情况统计', '过去一个月执行情况统计', ['全部', '' +
          '执行成功',
            '执行中',
            '执行失败',
            '全部异常',
            '越权',
            '缺少WHERE',
            '缺少行数限制',

          ], trend_xData, trend_series)
          this.general_month_timeline_view.setOption(this.general_month_timeline_data)

        }

      })
      ajax_get_general_all_biz_total().then(d => {
        if (d.status === 1) {
          this.general_count_data = d.data
        }
      })
    },
    drawAll() {
      this.general_month_timeline_view = drawChart(this.general_month_timeline_view, 'general_month_timeline_view', this.general_month_timeline_data, 'macarons')
    },
  },
  mounted() {
    this.drawAll()
  },
  activated() {
    this.initData()
  },
  render(h) {
    return h('div', {
    }, [
      h('div', {staticClass: 'row no-wrap'}, [
        // overall
        h(dash_card_simple, {props: {description: '接入团队', number: this.general_count_data.bus_count}}),
        h(dash_card_simple, {props: {description: '数据源', number: this.general_count_data.datasource_count}}),
        h(dash_card_simple, {props: {description: '执行次数', number: this.general_count_data.sql_exe_result_total}}),
        h(dash_card_simple, {
          props: {
            description: '阻止越权次数',
            number: this.general_count_data.sql_syntax_no_permission_total
          }
        }),
        h(dash_card_simple, {
          props: {
            description: '阻止误操作次数',
            tooltip: '更新缺少WHERE条件+查询缺少行数限制',
            number: this.general_count_data.sql_syntax_other_error_total
          }
        }),
      ]),

      h('div', {
        staticClass: 'flex justify-between',
        style: {width: '96vw', height: '60vh', marginTop: '8vh'}
      }, [
        h('div', {attrs: {id: 'general_month_timeline_view'}, style: {float: 'left', width: '100%'}}),
      ])
    ])
  }
}
