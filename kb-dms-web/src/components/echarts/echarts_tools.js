import extend from "quasar-framework/src/utils/extend"

let echarts = require('echarts/lib/echarts')
require('echarts-wordcloud');

// 初始化图表
export function drawChart(chart, id, option, theme) {
  if (chart) {
    chart.dispose();
  }
  chart = document.getElementById(id) && echarts.init(document.getElementById(id), theme);
  chart && chart.setOption(option);
  return chart;
}

// 组装图表数据
export function assembleChartData(source, title, subtitle, legend, xData, series, type = 'line', colors = null) {
  let isBar = type === 'bar'
  let target = extend(true, target, source);

  // init basic option
  if (target && Object.keys(target).length < 1) {
    target = {
      title: {text: ''},
      legend: {
        data: []
      },
      calculable: true,
      toolbox: {
        show: true,
        right: 20,
        feature: {
          //dataView: {optionToContent: opt => formatDataView(opt)},
          saveAsImage: {},
          // myFormula: getMyFormula(() => {
          // })
        }
      },
      tooltip: {trigger: 'axis', formatter: tooltipFormatter},
      xAxis: {},
      yAxis: {},
      series: []
    }
  }

  target.title.text = title
  target.title.subtext = subtitle
  target.legend.data = legend
  target.series.splice(series.length, target.series.length - series.length)

  // axis
  if (isBar) {
    target.yAxis = {
      type: 'category',
      data: xData
    }

    target.xAxis.type = 'value'
  } else {
    target.xAxis = {
      boundaryGap: false,
      type: 'category',
      axisLabel: {interval: 0, rotate: 0},
      splitLine: {show: false},    //去除网格线
      data: xData
    }

    // x轴文字大小、斜率控制
    target.xAxis.axisLabel.rotate = xData.length < 6 ? 0 : (xData.length < 55 ? xData.length * 1.3 : 85)
    target.xAxis.axisLabel.fontSize = xData.length > 20 ? 10 : null
  }

  // series
  series.map((s, index) => {
    if (target.series[index] === undefined) target.series[index] = {
      itemStyle: {
        normal: {
          label: {
            show: true, position: isBar ? 'right' : 'top', formatter: function (params) {
              if (params.value === 0) {
                return '';
              }
            }
          }
        }
      },
    }
    if (type != null) target.series[index].type = type
    target.series[index].name = legend[index]
    target.series[index].data = s
    target.series[index].areaStyle = {}
    // if (type === 'line') target.series[index].smooth = false
    if (colors) target.series[index].color = colors[index]
  })

  target.grid = isBar ? barGrid : grid

  return target
}

// 图表tooltip格式化
export function tooltipFormatter(data) {
  let tooltip = data[0].name + '<br/>'
  let seriesName = null

  for (let index = 0, length = data.length; index < length; index++) {
    seriesName = data[index].seriesName
    let dataUnit = null

    if (seriesName.indexOf('进度') > -1) {
      dataUnit = '%'
    } else if (seriesName.indexOf('时') > -1) {
      dataUnit = '人天'
    } else if (seriesName.indexOf('次数') > -1) {
      dataUnit = '次'
    } else if (seriesName.indexOf('率') > -1) {
      dataUnit = ''
    } else {
      dataUnit = '个'
    }

    tooltip += `${data[index].seriesName}: ${data[index].value} ${dataUnit}<br/>`
  }

  return `${tooltip}`
}

export function tooltipFormatterMore(data) {
  return `${tooltipFormatter(data)}*点击查看详情`
}

// 报表的边距设置
export const grid = {
  left: 55,
  right: 20,
  bottom: 50
}

export const barGrid = {
  left: 115,
  right: 40,
  bottom: 30
}

export const resourceGrid = {
  left: 38,
  right: 20,
  bottom: 50
}

// 设置报表展示(x轴、y轴、网格线、legend等)
export function setOptionTheme(option) {
  let color = '#676767'

  try {
    if (option) {
      option.title.textStyle = {color: color}

      if (option.yAxis) {
        option.yAxis.splitLine = {show: true}
        option.yAxis.splitLine.lineStyle = {color: '#e0e0e0'}
        option.yAxis.axisLine = {show: true}
        option.yAxis.axisTick = {show: true}
        option.yAxis.axisLine.lineStyle = {color: color}
        option.yAxis.axisTick.lineStyle = {color: color}
      }

      if (option.xAxis) {
        let xAxis = option.xAxis[0] ? option.xAxis[0] : option.xAxis

        xAxis.axisLine = {show: true}
        xAxis.axisTick = {show: true}
        xAxis.axisLine.lineStyle = {color: color}
        xAxis.axisTick.lineStyle = {color: color}
      }
    }
  } catch (e) {
  }
}

export function formatDataView(opt) {
  let axisData = opt.xAxis ? opt.xAxis[0].data : opt.series[0].data.map(d => d.name);
  let series = opt.series;

  let tdHeads = '<td  style="padding:3px 10px; font-weight: bold">维度</td>';
  if (series && series.length > 1) {
    series.map(item => {
      tdHeads += '<td style="padding:3px 10px; font-weight: bold">' + item.name + '</td>';
    });
  } else {
    tdHeads += '<td style="padding:3px 10px; font-weight: bold">数值</td>';
  }

  let table = '<table border="1" style="user-select:text;margin-left:20px;border-collapse:collapse;text-align: center"><tbody><tr>' + tdHeads + '</tr>';
  let tdBodys = '';

  for (let i = 0, l = axisData.length; i < l; i++) {
    for (let j = 0; j < series.length; j++) {
      if (typeof (series[j].data[i]) == 'object') {
        tdBodys += '<td>' + series[j].data[i].value + '</td>';
      } else {
        tdBodys += '<td>' + series[j].data[i] + '</td>';
      }
    }
    table += '<tr><td style="padding: 3px 10px">' + axisData[i] + '</td>' + tdBodys + '</tr>';
    tdBodys = '';
  }

  table += '</tbody></table>';

  return table;
}

export function getMyFormula(formulaHelper) {
  return {
    show: true,
    title: '公式',
    // icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
    icon: 'path://M15.255,0c5.424,0,10.764,2.498,10.764,8.473c0,5.51-6.314,7.629-7.67,9.62c-1.018,1.481-0.678,3.562-3.475,3.562 c-1.822,0-2.712-1.482-2.712-2.838c0-5.046,7.414-6.188,7.414-10.343c0-2.287-1.522-3.643-4.066-3.643 c-5.424,0-3.306,5.592-7.414,5.592c-1.483,0-2.756-0.89-2.756-2.584C5.339,3.683,10.084,0,15.255,0z M15.044,24.406 c1.904,0,3.475,1.566,3.475,3.476c0,1.91-1.568,3.476-3.475,3.476c-1.907,0-3.476-1.564-3.476-3.476 C11.568,25.973,13.137,24.406,15.044,24.406z',
    onclick: formulaHelper
  }
}


/*************calculation helper***************/
export function getDefaultStartOfDate(date) {
  return formatDateWithSuffix(date, '00:00:00')
}

export function getDefaultEndOfDate(date) {
  return formatDateWithSuffix(date, '23:59:59')
}


export const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).getTime()

export const threeMothsAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).setMonth(new Date().getMonth() - 3)
