import TableDataTypeInputSelector from '../../components/selector/TableDataTypeInputSelector'
import {table_column_name_check} from "./utils_ddl_sql_check";

export default {
  name: 'comp_table_edit_field_type_input',
  data: () => ({
    table_column_check_error: {
      error: false,
      msg: null
    }
  }),
  computed: {
    ddl_save_check() {
      return this.$store.state.home.ddl_save_check || false
    },
    check_box_is_allow() {
      //自增选择框 只能给id自增
      if (this.field && this.field_name === 'is_autoincrement') {
        if (this.field.column_name === 'id') {
          return true
        } else {
          return false
        }
      }
      //无符号选择框 只有数字类型可以选择
      if (this.field && this.field_name === 'is_unsigned') {
        if (this.field.type_name && this.field.type_name.toUpperCase().indexOf("INT") !== -1) {
          return true
        } else {
          return false
        }
      }

      if (this.field && !this.field.column_name) {
        return false
      }
      return true
    },
  },
  watch: {
    ddl_save_check: {
      immediate: true,
      handler: function (nv, ov) {
        if (nv) {
          this.table_column_check_error = this.table_column_check()
        }
      }
    },
    value: {
      immediate: false,
      handler: function () {
        this.table_column_check_error = this.table_column_check()
        setTimeout(() => {
          this.$refs.table_column_check_tooltip && this.$refs.table_column_check_tooltip.show()
        }, 100)
      }
    },
  },
  props: {
    value: {
      required: true,
    },
    field: {},
    disable: Boolean,
    no_enter_icon: {
      default: false
    },
    field_name: {
      required: true,
      type: [String]
    },
    field_desc: {
      required: false,
      type: [String]
    },
    datasource_type: {
      type: [Number],
      default: 1
    }
  },
  methods: {
    render_check_box(h) {
      return h('q-checkbox', {
        staticClass: 'no-ripple',
        props: {
          value: this.value,
          trueValue: true,
          falseValue: false,
          readonly: this.disable || !this.check_box_is_allow,
          disable: this.disable || !this.check_box_is_allow,
        },
        on: {
          input: v => {
            this.disable ? null : this.$emit('input', v)

          }
        }
      })
    },
    render_input(h) {
      return h('q-input', {
        staticClass: 'no-border',
        'class': {
          'pp-input-error-border': this.table_column_check_error.error
        },
        style: {
          minWidth: '150px'
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
          placeholder: '请输入' + this.field_desc
        },
      }, [
        this.table_column_check_error.error ? h('q-tooltip', {
          ref: 'table_column_check_tooltip',
          props: {offset: [5, 5]}
        }, this.table_column_check_error.msg) : null
      ])
    },
    render_datetime_default_input(h) {
      return h('div', {
        staticClass: 'row no-wrap',
        'class': {
          'pp-input-error-border': this.table_column_check_error.error
        },
      }, [
        h('q-input', {
          staticClass: 'no-border col-grow',
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
            placeholder: '请输入' + this.field_desc
          },
        }, [
          this.table_column_check_error.error ? h('q-tooltip', {
            ref: 'table_column_check_tooltip',
            props: {offset: [5, 5]}
          }, this.table_column_check_error.msg) : null
        ]),
        h('div', {
          staticClass: 'row no-wrap items-center q-ml-sm',
          'class': {
            'text-faded': this.disable
          }
        }, [
          h('span', {}, ['当前时间']),
          h('q-checkbox', {
            staticClass: 'no-ripple',
            props: {
              value: this.value && this.value.toUpperCase().indexOf('CURRENT_TIMESTAMP') !== -1 ? true : false,
              trueValue: true,
              falseValue: false,
              readonly: this.disable,
              disable: this.disable,
            },
            on: {
              input: v => {
                if (!this.disable) {
                  if (v) {
                    if (!this.value || this.value.indexOf("CURRENT_TIMESTAMP") === -1) {
                      if (!this.value) {
                        this.value = "CURRENT_TIMESTAMP" + (this.field.type_name.indexOf("(") !== -1 ? this.field.type_name.substring(this.field.type_name.indexOf("(")) : "")
                      } else {
                        this.value = "CURRENT_TIMESTAMP" + (this.field.type_name.indexOf("(") !== -1 ? this.field.type_name.substring(this.field.type_name.indexOf("(")) : "") + this.value
                      }
                      this.$emit("input", this.value)
                    }
                  } else {
                    if (this.value && this.value.indexOf("CURRENT_TIMESTAMP") !== -1) {
                      this.value = null
                      this.$emit("input", this.value)
                    }
                  }
                }
              }
            }
          })
        ]),
        h('div', {
          staticClass: 'row no-wrap items-center q-ml-sm',
          'class': {
            'text-faded': this.disable
          }
        }, [
          h('span', {}, ['自动更新']),
          h('q-checkbox', {
            staticClass: 'no-ripple',
            props: {
              value: this.value && this.value.toUpperCase().indexOf('ON UPDATE CURRENT_TIMESTAMP') !== -1 ? true : false,
              trueValue: true,
              falseValue: false,
              readonly: this.disable,
              disable: this.disable,
            },
            on: {
              input: v => {
                if (!this.disable) {
                  if (v) {
                    if (!this.value || this.value.indexOf("ON UPDATE CURRENT_TIMESTAMP") === -1) {
                      this.value = "CURRENT_TIMESTAMP" + (this.field.type_name.indexOf("(") !== -1 ? this.field.type_name.substring(this.field.type_name.indexOf("(")) : "") + " ON UPDATE CURRENT_TIMESTAMP" + (this.field.type_name.indexOf("(") !== -1 ? this.field.type_name.substring(this.field.type_name.indexOf("(")) : "")
                      this.$emit("input", this.value)
                    }
                  } else {
                    if (this.value && this.value.toUpperCase().indexOf("ON UPDATE CURRENT_TIMESTAMP") !== -1) {
                      this.value = this.value.toUpperCase()
                      console.log(this.value)
                      this.value = this.value.replace(" ON UPDATE CURRENT_TIMESTAMP" + (this.field.type_name.indexOf("(") !== -1 ? this.field.type_name.substring(this.field.type_name.indexOf("(")) : ""), "")
                      this.$emit("input", this.value)
                    }
                  }
                }
              }
            }
          })
        ])
      ])
    },

    render_varchar_default_input(h) {
      return h('div', {
        staticClass: 'row no-wrap',
        'class': {
          'pp-input-error-border': this.table_column_check_error.error
        },
      }, [
        h('q-input', {
          staticClass: 'no-border col-grow',
          on: {
            input: (v) => {
              this.$store.state.home.ddl_save_check = false
              this.disable ? null : this.$emit('input', v)
            }
          },
          props: {
            value: this.value,
            hideUnderline: true,
            disable: this.disable,
            placeholder: this.value === '' ? "" : '请输入' + this.field_desc
          },
        }, [
          this.table_column_check_error.error ? h('q-tooltip', {
            ref: 'table_column_check_tooltip',
            props: {offset: [5, 5]}
          }, this.table_column_check_error.msg) : null
        ]),
        h('div', {
          staticClass: 'row no-wrap items-center q-ml-sm',
          'class': {
            'text-faded': this.disable
          }
        }, [
          h('span', {}, ['空字符串']),
          h('q-checkbox', {
            staticClass: 'no-ripple',
            props: {
              value: this.value === '',
              trueValue: true,
              falseValue: false,
              readonly: this.disable,
              disable: this.disable,
            },
            on: {
              input: v => {
                if (!this.disable) {
                  if (v) {
                    this.$emit("input", '')
                  } else {
                    this.$emit("input", null)
                  }
                }
              }
            }
          })
        ]),
      ])
    },

    render_column_name_input(h) {
      return h('q-input', {
        staticClass: 'no-border',
        'class': {
          'pp-input-error-border': this.table_column_check_error.error
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
          placeholder: '请输入' + this.field_desc
        },
      }, [
        this.table_column_check_error.error ? h('q-tooltip', {
          ref: 'table_column_check_tooltip',
          props: {offset: [5, 5]}
        }, this.table_column_check_error.msg) : null
      ])
    },
    render_data_type_input(h) {
      return h('q-input', {
        staticClass: 'col-grow no-border',
        'class': {
          'pp-input-error-border': this.table_column_check_error.error
        },
        style: {
          minWidth: '150px'
        },
        on: {
          input: (v) => {
            this.disable ? null : this.$emit('input', v)
          }
        },
        props: {
          value: this.value || null,
          hideUnderline: true,
          readonly: this.disable,
          disable: this.disable,
          placeholder: '请输入' + this.field_desc
        },
      }, [
        this.table_column_check_error.error ? h('q-tooltip', {
          ref: 'table_column_check_tooltip',
          props: {offset: [5, 5]}
        }, this.table_column_check_error.msg) : null,
        h('div', {
          staticClass: 'row items-center bg-white full-height',
          style: {
            width: '20px',
          },
          slot: 'before'
        }, [
          h('q-icon', {
            staticClass: 'pp-selected-bg-blue-5-hover',
            props: {
              name: 'arrow_downward',
              size: '15px',
              color: 'faded'
            },
          }, [
            this.disable ? null : h('q-popover', {
              ref: 'QPopover',
              staticClass: 'col-grow q-mt-sm',
              style: {
                minWidth: '150px',
                width: '270px'
              },
            }, [
              h(TableDataTypeInputSelector, {
                ref: 'TableDataTypeInputSelector',
                props: {
                  datasource_type: this.datasource_type
                },
                on: {
                  select: (v) => {
                    this.disable ? null : this.$emit('input', v)
                    this.$refs.QPopover.hide()
                  }
                }
              })
            ])
          ])
        ])
      ])
    },
    table_column_check() {
      let check_error = {
        error: false,
        msg: null
      }

      if (!this.field.online_column_name || this.field.online_column_name !== this.field.column_name) {
        if (!this.value && this.field.column_name) {

          if (this.field_name === 'remarks' || this.field_name === 'type_name') {
            check_error = {
              error: true,
              msg: this.field_desc + '不能为空!'
            }
          }
          if (this.field_name === 'column_name') {
            check_error = table_column_name_check(this.value)
          }
        } else if (this.value && this.field.column_name) {
          if (this.field_name === 'column_name') {
            check_error = table_column_name_check(this.value)
          }
        }
      }

      if (check_error.error) {
        this.$emit('table_column_check_error', check_error)
      }
      return check_error
    },
    render_data_type(h) {
      if (this.field_name === 'column_name') {
        return this.render_column_name_input(h)
      }
      if (this.field_name === 'is_primary_key') {
        return this.render_check_box(h)
      }
      if (this.field_name === 'type_name') {
        return this.render_data_type_input(h)
      }
      if (this.field_name === 'is_nullable') {
        return this.render_check_box(h)
      }
      if (this.field_name === 'is_autoincrement') {
        return this.render_check_box(h)
      }
      if (this.field_name === 'remarks') {
        return this.render_input(h)
      }
      if (this.field_name === 'column_def') {
        if (this.field.type_name && this.field.type_name.toUpperCase().indexOf('DATETIME') !== -1) {
          return this.render_datetime_default_input(h)
        }
        if (this.field.type_name && this.field.type_name.toUpperCase().indexOf('VARCHAR') !== -1) {
          return this.render_varchar_default_input(h)
        }
        return this.render_input(h)
      }
      if (this.field_name === 'is_unsigned') {
        return this.render_check_box(h)
      }

    },
  },
  render(h) {
    return this.render_data_type(h)
  }
}
