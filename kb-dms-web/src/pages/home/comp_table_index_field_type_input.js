import IndexTypeSelector from '../../components/selector/TableIndexTypeInputSelector'

export default {
  name: 'comp_table_index_field_type_input',
  data: () => ({
    table_index_check_error: {
      error: false,
      msg: null
    }
  }),
  computed: {
    ddl_save_check() {
      return this.$store.state.home.ddl_save_check || false
    },
  },
  watch: {
    ddl_save_check: {
      immediate: true,
      handler: function (nv, ov) {
        if (nv) {
          this.table_index_check_error = this.table_index_check()
        }
      }
    },
    value: {
      immediate: false,
      handler: function () {
        this.table_index_check_error = this.table_index_check()
        setTimeout(() => {
          this.$refs.table_index_check_tooltip && this.$refs.table_index_check_tooltip.show()
        }, 100)
      }
    },
  },
  props: {
    value: {
      required: true,
    },
    disable: Boolean,
    field_name: {
      required: true,
      type: [String]
    },
    field_desc: {
      required: false,
      type: [String]
    },
    field: {
      type: [Object]
    }
  },
  methods: {
    render_input(h) {
      return h('q-input', {
        staticClass: 'no-border',
        'class': {
          'pp-input-error-border': this.table_index_check_error.error
        },
        style: {
          minWidth: '150px'
        },
        attrs: {
          maxLength: 32
        },
        on: {
          input: (v) => {
            this.$store.state.home.ddl_save_check = false
            this.disable ? null : this.$emit('input', v)
          }
        },
        props: {
          value: this.value || null,
          hideUnderline: true,
          disable: this.disable,
          placeholder:  this.field_desc
        },
      }, [
        this.table_index_check_error.error ? h('q-tooltip', {
          ref: 'table_index_check_tooltip',
          props: {offset: [5, 5]}
        }, this.table_index_check_error.msg) : null
      ])
    },
    render_index_column_order_input(h) {
      return h('q-input', {
        staticClass: 'no-border',
        style: {
          minWidth: '30px'
        },
        attrs: {
          maxLength: 2,
          type: 'number'
        },
        on: {
          input: (v) => {
            this.disable ? null : this.$emit('input', v)
          }
        },
        props: {
          value: this.value || null,
          hideUnderline: true,
          disable: this.disable,
        },
      }, [
        this.table_index_check_error.error ? h('q-tooltip', {
          ref: 'table_index_check_tooltip',
          props: {offset: [5, 5]}
        }, this.table_index_check_error.msg) : null
      ])
    },
    render_index_type_input(h) {
      return h(IndexTypeSelector, {
        staticClass: 'no-border',
        props: {
          value: {
            label: this.value,
            value: this.value
          },
          disable: this.disable,
          readonly: this.disable,
          placeholder: this.generic_placeholder
        },
        on: {
          input: (v) => {
            this.disable ? null : this.$emit('input', v.value)
          }
        }
      })
    },
    table_index_check() {
      let check_error = {
        error: false,
        msg: null
      }

      // if (!this.field.online_index_name || this.field.online_index_name !== this.field.index_name) {
      //   if (!this.value && this.field.index_name) {
      //
      //     if (this.field_name === 'remarks' || this.field_name === 'type_name') {
      //       check_error = {
      //         error: true,
      //         msg: this.field_desc + '不能为空!'
      //       }
      //     }
      //     if (this.field_name === 'index_name') {
      //       check_error = table_index_name_check(this.value)
      //     }
      //   } else if (this.value && this.field.index_name) {
      //     if (this.field_name === 'index_name') {
      //       check_error = table_index_name_check(this.value)
      //     }
      //   }
      // }

      if (check_error.error) {
        this.$emit('table_index_check_error', check_error)
      }
      return check_error
    },
    render_data_type(h) {
      if (this.field_name === 'index_name') {
        return this.render_input(h)
      }
      if (this.field_name === 'index_type') {
        return this.render_index_type_input(h)
      }
      if (this.field_name === 'index_column_order') {
        return this.render_index_column_order_input(h)
      }
      return this.render_input(h)
    },
  },
  render(h) {
    return this.render_data_type(h)
  }
}
