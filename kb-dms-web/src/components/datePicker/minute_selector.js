import SelectorBase from '../selector/MixinSelectorBase'
import {Optional} from "../../utils/Optional"
import {compare_minutes} from "./utils"

const minDict = [];

(function setMinDict() {
  let i = 0;
  while (i < 60) {
    if (i < 10) {
      minDict.push('0' + i);
    } else {
      minDict.push(i + '');
    }
    i++;
  }
})()

export default {
  name: 'minutePicker',
  mixins: [SelectorBase],
  props: {
    value: [String, Number, Date],
    min: [String, Number, Date],
    max: [String, Number, Date],
  },
  computed: {
    dateValue() {
      return Optional.ofNullable(this.value).map(v => new Date(v)).orElse(null)
    },
    minuteValue() {
      return Optional.ofNullable(this.dateValue).map(d => d.getMinutes()).orElse(0);
    }
  },
  watch: {
    dateValue(v) {

      let m = new Date(this.min);
      if (v && this.min && compare_minutes(v, m) < 0) {
        return this.$emit('input', m.getTime())
      }

      m = new Date(this.max);
      if (v && this.max && compare_minutes(v, m) > 0) {
        return this.$emit('input', m.getTime())
      }
    },
    min(v) {
      let m = new Date(v);
      if (this.dateValue && v && compare_minutes(this.dateValue, m) < 0) {
        return this.$emit('input', m.getTime())
      }
    },
    max(v) {
      let m = new Date(v);

      if (this.dateValue && v && compare_minutes(this.dateValue, m) > 0) {

        return this.$emit('input', m.getTime())
      }
    }
  },
  methods: {
    /* abstract methods start */
    render_field_prefix(h, value) {
      return h('div', {staticClass: 'q-mr-sm font-13'}, '分钟:')
    },
    render_field_content(h, value) {
      return h('span', {staticClass: 'q-mr-sm text-weight-bold font-13'}, minDict[this.minuteValue])
    },
    render_field_extend(h, value) {
    },
    render_list_top(h) {
    },
    render_list_content(h, value) {
      return h('div', {staticClass: 'full-width text-center font-12 text-weight-bold'}, value)
    },
    options() {
      return minDict
    },
    show() {
      this.search()
    },
    hide() {
    },
    search() {
    },
    __render_list(h) {
      return h('q-list', {
          staticClass: 'q-pt-xs q-pb-xs no-border scroll text-dark',
          style: {height: '150px'},
          props: {link: true, dense: true}
        }, [this.__render_list_content(h)]
      )
    },
    __render_list_content(h) {
      return minDict.map((i, index) => {
        if (this.minuteValue === index) {
          return h('div', {
            staticClass: 'bg-blue-2 flex items-center',
            style: {minHeight: '22px'},
          }, [
            this.render_list_content(h, i)
          ])
        } else {
          let forbidden = false;
          forbidden = forbidden || (this.dateValue && this.min && compare_minutes(new Date(this.dateValue.getFullYear(), this.dateValue.getMonth(), this.dateValue.getDate(), this.dateValue.getHours(), index), new Date(this.min)) < 0);
          forbidden = forbidden || (this.dateValue && this.max && compare_minutes(new Date(this.dateValue.getFullYear(), this.dateValue.getMonth(), this.dateValue.getDate(), this.dateValue.getHours(), index), new Date(this.max)) > 0);
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
      this.$emit('input', this.dateValue.setMinutes(v));
      this.$refs.popup.hide()
    },
  }
}
