import SelectorBase from '../selector/MixinSelectorBase'
import {Optional} from "../../utils/Optional"
import {compare_hour, datePropValidator} from "./utils"

const hourDict = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

export default {
  name: 'hourPicker',
  mixins: [SelectorBase],
  props: {
    value: {type: [String, Number, Date], validator: datePropValidator},
    min: {type: [String, Number], validator: datePropValidator},
    max: {type: [String, Number, Date], validator: datePropValidator}
  },
  computed: {
    dateValue() {
      return Optional.ofNullable(this.value).map(v => new Date(v)).orElse(null)
    },
    hourValue() {
      return Optional.ofNullable(this.dateValue).map(d => d.getHours()).orElse(0)
    }
  },
  watch: {
    dateValue(v) {
      let m = new Date(this.min);
      if (v && m && compare_hour(v, m) < 0) {
        return this.$emit('input', m.getTime())
      }

      m = new Date(this.max);
      if (v && m && compare_hour(v, m) > 0) {
        return this.$emit('input', m.getTime())
      }
    },
    min(v) {
      let m = new Date(v);
      if (this.dateValue && v && compare_hour(this.dateValue, m) < 0) {
        return this.$emit('input', m.getTime())
      }
    },
    max(v) {
      let m = new Date(v);
      if (this.dateValue && v && compare_hour(this.dateValue, m) > 0) {
        return this.$emit('input', m.getTime())
      }
    }
  },
  methods: {
    /* abstract methods start */
    render_field_prefix(h, value) {
      return h('div', {staticClass: 'q-mr-sm font-13'}, '小时:')
    },
    render_field_content(h, value) {
      return h('span', {staticClass: 'q-mr-sm text-weight-bold font-13'}, hourDict[this.hourValue])
    },
    render_field_extend(h, value) {
    },
    render_list_top(h) {
    },
    render_list_content(h, value) {
      return h('div', {staticClass: 'full-width text-center font-12 text-weight-bold'}, value)
    },
    options() {
      return hourDict
    },
    show() {
      this.search()
    },
    hide() {
    },
    search() {
    },
    __render_list(h) {
      return h('div', {
          staticClass: 'q-pt-xs q-pb-xs scroll text-dark',
          style: {height: '150px', fontSize: this.fontSize},
        }, [this.__render_list_content(h)]
      )
    },
    __render_list_content(h) {
      return hourDict.map((i, index) => {
        if (this.hourValue === index) {
          return h('div', {
            staticClass: 'bg-blue-2 flex items-center',
            style: {minHeight: '22px'},
          }, [
            this.render_list_content(h, i)
          ])
        } else {
          let forbidden = false;
          forbidden = forbidden || (this.dateValue && this.min && compare_hour(new Date(this.dateValue.getFullYear(), this.dateValue.getMonth(), this.dateValue.getDate(), index), new Date(this.min)) < 0);
          forbidden = forbidden || (this.dateValue && this.max && compare_hour(new Date(this.dateValue.getFullYear(), this.dateValue.getMonth(), this.dateValue.getDate(), index), new Date(this.max)) > 0);
          let conf = forbidden
            ? {'class': ['text-light', 'cursor-not-allowed']}
            : {
              'class': ['pp-selectable-bg', 'cursor-pointer'],
              on: {click: () => this.__select(i)}
            };
          return h('div', {
            staticClass: 'flex items-center ',
            style: {minHeight: '22px'},
            ...conf
          }, [
            this.render_list_content(h, i)
          ])
        }
      })
    },
    __select(v) {
      this.$emit('input', this.dateValue.setHours(v));
      this.$refs.popup.hide()
    },
  }
}
