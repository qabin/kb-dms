import {data_type_name_date_options, data_type_name_boolean_options} from "../../utils/sql_editor_dictionary";
import {format_date_full} from "../../utils/date_format_utils";

export default {
  name: 'comp_table_column_type_input',
  data: () => ({
    input_style: false,
  }),
  props: {
    value: {
      required: true
    },
    field: {},
    disable: Boolean,
    no_enter_icon: {
      default: false
    }
  },
  methods: {
    render_check_box(h) {
      return h('q-checkbox', {
        staticClass: 'no-ripple',
        props: {value: this.value},
        on: {
          input: v => {
            this.disable ? null : this.$emit('input', v)

          }
        }
      })
    },
    render_input(h) {
      return h('q-input', {
        style: {
          fontSize: '12px',
          width: this.$parent.offsetWidth,
          minWidth: '80px'
        },
        staticClass: 'no-border',
        on: {
          input: (v) => {
            this.value = v
            this.disable ? null : this.$emit('input', v)

          },
          focus: () => {
            this.$emit("focus")
          }
        },
        props: {
          value: this.value,
          hideUnderline: true,
          disable: this.disable,
        },
      })
    },
    render_datetime_picker(h) {
      return h('q-input', {
        staticClass: 'no-border',
        style: {
          width: this.$parent.offsetWidth,
          minWidth: '130px'
        },
        props: {
          value: format_date_full(this.value),
          hideUnderline: true,
          readonly: this.disable,
          disable: this.disable,
          format24h: true,
          popover: true,
          type: 'datetime',
          formatModel: 'number'
        },
        on: {
          input: (v) => {
            this.value = v
            this.disable ? null : this.$emit('input', format_date_full(v))
          }
        },
      })
    },

    render_data_type(h) {
      if (data_type_name_date_options.some(d => d.toUpperCase() === this.field.type_name.toUpperCase())) {
        return this.render_datetime_picker(h)
      } else if (data_type_name_boolean_options.some(b => b.toUpperCase() === this.field.type_name.toUpperCase())) {
        return this.render_check_box(h)
      } else {
        return this.render_input(h)
      }
    }
  },
  render(h) {
    return this.render_data_type(h)
  }
}
