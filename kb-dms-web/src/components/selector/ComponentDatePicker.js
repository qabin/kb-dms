import SelectorMixin from './MixinSelectorBase'
import {formatDate} from "quasar-framework/src/utils/date"
import DatePicker from '../datePicker/DatePicker'

export default {
  name: 'ppTimePicker',
  mixins: [SelectorMixin],
  props: {
    min: [String, Number, Date],
    max: [String, Number, Date],
    valid: Function,
    conf_time: Boolean,
    dateFormat: {type: String, default: 'YYYY年MM月DD日'},
    close: {type: Boolean, default: true}
  },
  data: () => ({popup_fit: false}),
  methods: {
    render_field_content(h, value) {
      return h('div', {staticClass: 'flex no-wrap items-center full-width q-pl-xs q-pr-xs'}, [
        h('div', {staticClass: 'col-grow'}, formatDate(value, this.conf_time ? 'YYYY年MM月DD日 HH:mm' : this.dateFormat)),
        this.close && !this.disable
          ? h('pp-clear', {
            style: {marginLeft: '3px'},
            on: {
              click: e => {
                this.$nextTick(() => this.$emit('clear'));
                e.stopPropagation();
              }
            }
          })
          : null
      ])
    },
    __render_list(h) {
      return h('div', {}, [
        h(DatePicker, {
          props: {
            value: this.value,
            min: this.min,
            max: this.max,
            valid: this.valid,
            conf_time: this.conf_time
          },
          ref: 'DatePicker',
          on: {
            input: v => {
              this.conf_time || this.$refs.popup.hide();
              this.$nextTick(() => this.$emit('input', v));
            }
          }
        })
      ])
    },
    hide() {
      this.$refs.DatePicker.viewYearHold = this.$refs.DatePicker.viewMonthHold = null
    },
  }
}
