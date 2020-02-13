import HourSelector from './hour_selector'
import MinuteSelector from './minute_selector'
import {compare_day, datePropValidator} from "./utils"

const monthDictionary = {
  0: '一月', 1: '二月', 2: '三月', 3: '四月', 4: '五月', 5: '六月', 6: '七月', 7: '八月', 8: '九月', 9: '十月', 10: '十一月', 11: '十二月',
};


export default {
  name: 'DatePicker',
  props: {
    value: {type: [String, Number, Date], validator: datePropValidator},
    min: {type: [String, Number, Date], validator: datePropValidator},
    max: {type: [String, Number, Date], validator: datePropValidator},
    valid: Function,
    conf_time: Boolean
  },
  data: () => ({
    size: 26,
    viewYearHold: null,
    viewMonthHold: null,
  }),
  computed: {
    cell_size() {
      let size = this.size + 'px';
      return {width: size, height: size, margin: '1px', lineHeight: size}
    },
    line_size() {
      return (this.size + 2) * 7 + 'px'
    },
    valueDay() {
      return this.value ? new Date(this.value) : null
    },
    viewYear: {
      get() {
        return this.viewYearHold !== null
          ? this.viewYearHold
          : (this.valueDay
              ? this.valueDay.getFullYear()
              : (this.min && compare_day(new Date(this.min), new Date()) < 0
                  ? new Date(this.min).getFullYear()
                  : new Date().getFullYear()
              )
          )
      },
      set(v) {
        this.viewYearHold = v
      }
    },
    viewMonth: {
      get() {
        return this.viewMonthHold !== null
          ? this.viewMonthHold
          : (this.valueDay
              ? this.valueDay.getMonth()
              : (this.min && compare_day(new Date(this.min), new Date()) < 0
                  ? new Date(this.min).getMonth()
                  : new Date().getMonth()
              )
          );
      },
      set(v) {
        this.viewMonthHold = v
      }
    },
    lastDayPreviousViewMonth() {
      return new Date(this.viewYear, this.viewMonth, 0)
    },
    lastDayViewMonth() {
      return new Date(this.viewYear, this.viewMonth + 1, 0)
    },
    firstDayNextMonth() {
      return new Date(this.viewYear, this.viewMonth + 1, 1)
    },
    dayListPreviousViewMonth() {
      let length = this.lastDayPreviousViewMonth.getDay() + 1;
      if (length < 7) {
        let date = this.lastDayPreviousViewMonth.getDate();
        let month = this.lastDayPreviousViewMonth.getMonth();
        let year = this.lastDayPreviousViewMonth.getFullYear();
        return Array.apply(null, {length}).map((day, index) => new Date(year, month, date - length + 1 + index))
      }
      return []
    },
    dayListViewMonth() {
      let month = this.lastDayViewMonth.getMonth();
      let year = this.lastDayViewMonth.getFullYear();
      return Array.apply(null, {length: this.lastDayViewMonth.getDate()}).map((day, index) => new Date(year, month, index + 1))
    },
    dayListNextViewMonth() {
      let length = 7 - this.firstDayNextMonth.getDay();
      if (length < 7) {
        let month = this.firstDayNextMonth.getMonth();
        let year = this.firstDayNextMonth.getFullYear();
        return Array.apply(null, {length}).map((day, index) => new Date(year, month, index + 1))
      }
      return []
    }
  },
  methods: {
    offset_view_month(direct) {
      if (!direct || typeof direct !== 'number')
        return;
      if (direct > 0) {
        if (this.viewMonth === 11) {
          this.viewMonth = 0;
          this.viewYear += 1;
        } else {
          this.viewMonth += 1;
        }
      } else {
        if (this.viewMonth === 0) {
          this.viewMonth = 11;
          this.viewYear -= 1;
        } else {
          this.viewMonth -= 1;
        }
      }
    },
    render_time_picker(h) {
      return h('div', {
        staticClass: 'flex no-wrap justify-around full-width',
        style: {padding: '2px 0'}
      }, [
        h(HourSelector, {
          staticClass: 'bg-transparent pp-selectable-bg pp-radius q-pl-sm q-pr-sm q-pt-xs q-pb-xs no-border',
          'class': {'text-light': !this.valueDay},
          props: {value: this.valueDay, disable: !this.valueDay, min: this.min, max: this.max},
          on: {input: v => this.$emit('input', v)}
        }),
        h(MinuteSelector, {
          staticClass: 'bg-transparent pp-selectable-bg pp-radius q-pl-sm q-pr-sm q-pt-xs q-pb-xs no-border',
          'class': {'text-light': !this.valueDay},
          props: {value: this.valueDay, disable: !this.valueDay, min: this.min, max: this.max},
          on: {input: v => this.$emit('input', v)}
        })
      ])
    },
    render_header(h) {
      return h('div', {
        staticClass: 'full-width flex no-wrap items-center justify-between q-pl-sm q-pr-sm text-weight-medium',
        style: {margin: '0px 8px'}
      }, [
        h('q-btn', {
          staticClass: 'shadow-0',
          style: {height: '26px', width: '26px'},
          props: {icon: 'chevron_left', round: true, color: 'primary', flat: true},
          on: {click: () => this.offset_view_month(-1)}
        }),
        h('div', {staticClass: 'font-14'}, [
          h('span', {staticClass: 'q-mr-sm'}, this.viewYear),
          h('span', {}, monthDictionary[this.viewMonth])
        ]),
        h('q-btn', {
          staticClass: 'shadow-0',
          style: {height: '26px', width: '26px'},
          props: {icon: 'chevron_right', round: true, color: 'primary', flat: true},
          on: {click: () => this.offset_view_month(1)}
        })
      ])
    },
    render_week(h) {
      return [
        this.render_week_cell(h, '日'),
        this.render_week_cell(h, '一'),
        this.render_week_cell(h, '二'),
        this.render_week_cell(h, '三'),
        this.render_week_cell(h, '四'),
        this.render_week_cell(h, '五'),
        this.render_week_cell(h, '六')
      ]
    },
    render_week_cell(h, value) {
      return h('div', {staticClass: 'text-center', style: this.cell_size}, value)
    },

    render_day_cell(h, value, cls) {
      let selected = this.valueDay && compare_day(this.valueDay, value) === 0;
      let forbidden = false;
      let today = false;

      let cell_cls;
      if (selected) {
        cell_cls = 'bg-primary text-white'
      } else if ((forbidden = (this.valid && !this.valid(value)) || (this.min && compare_day(new Date(this.min), value) > 0) || (this.max && compare_day(new Date(this.max), value) < 0))) {
        cell_cls = 'text-grey-4 cursor-not-allowed'
      } else if ((today = compare_day(new Date(), value) === 0)) { //today
        cell_cls = 'text-primary font-13 cursor-pointer pp-selectable-bg'
      } else {
        cell_cls = 'cursor-pointer pp-selectable-bg ' + cls
      }
      return h('div', {
        staticClass: 'text-center pp-radius-3 ' + cell_cls,
        style: this.cell_size,
        on: {
          click: () => {
            if (!forbidden) {
              this.viewYearHold = this.viewYear;
              this.viewMonthHold = this.viewMonth;
              this.$emit('input', selected ? null : new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime());
            }
          }
        }
      }, value.getDate())
    }
  },
  render(h) {
    return this.conf_time
      ? h('div', {
        staticClass: 'font-12 text-weight-bold text-dark non-selectable',
      }, [
        this.render_time_picker(h),
        h('div', {staticClass: 'full-width bg-grey-4', style: {minHeight: '1px', height: '1px'}}),
        h('div', {
          staticClass: 'flex',
          style: {width: this.line_size, cursor: 'default', margin: '8px 16px'}
        }, [
          this.render_header(h),
          this.render_week(h),
          this.dayListPreviousViewMonth.map(date => this.render_day_cell(h, date, 'text-grey-6')),
          this.dayListViewMonth.map(date => this.render_day_cell(h, date)),
          this.dayListNextViewMonth.map(date => this.render_day_cell(h, date, 'text-grey-6')),
        ])
      ])
      : h('div', {
        staticClass: 'font-12 text-weight-bold text-dark non-selectable flex',
        style: {width: this.line_size, cursor: 'default', margin: '8px 16px'}
      }, [
        this.render_header(h),
        this.render_week(h),
        this.dayListPreviousViewMonth.map(date => this.render_day_cell(h, date, 'text-grey-6')),
        this.dayListViewMonth.map(date => this.render_day_cell(h, date)),
        this.dayListNextViewMonth.map(date => this.render_day_cell(h, date, 'text-grey-6')),
      ])
  }
}
