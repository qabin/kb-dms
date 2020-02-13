export default {
  name: 'comp_table_ddl_row_menu',
  data: () => ({}),
  props: {
    row: {
      type: [Object, String]
    },
    past: {
      type: [Boolean],
      default: false
    },
    readonly: {
      type: [Boolean],
      default: false
    },
    disable: {
      type: [Boolean],
      default: false
    }
  },
  methods: {
    render_move_tools(h) {
      return h('div', {}, [
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          'class': {
            'disabled': this.readonly || this.disable
          },
          on: {
            click: () => {
              if (!this.readonly && !this.disable) {
                this.$refs.QContextMenu.hide()
                this.$emit("move_up", this.row)
              }
            }
          }
        }, [
          h('i', {
            staticClass: 'mdi mdi-arrow-up-bold-outline text-orange-7',
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('span', ['向上移动'])
        ]),
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          'class': {
            'disabled': this.readonly
          },
          on: {
            click: () => {
              if (!this.readonly && !this.disable) {
                this.$refs.QContextMenu.hide()
                this.$emit("move_down", this.row)
              }
            }
          }
        }, [
          h('i', {
            staticClass: 'mdi mdi-arrow-down-bold-outline text-orange-7',
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('span', ['向下移动'])
        ]),
      ])
    },
    render_delete_tools(h) {
      return h('div', {}, [
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          'class': {
            'disabled': this.disable
          },
          on: {
            click: () => {
              if (!this.disable) {
                this.$refs.QContextMenu.hide()
                this.$emit("insert_new_row", this.row)
              }
            }
          }
        }, [
          h('i', {
            staticClass: 'mdi mdi-playlist-plus text-info',
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('span', ['插入行'])
        ]),
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          'class': {
            'disabled': this.disable
          },
          on: {
            click: () => {
              if (!this.disable) {
                this.$refs.QContextMenu.hide()
                this.$emit("add_new_row")
              }
            }
          }
        }, [
          h('i', {
            staticClass: 'mdi mdi-plus text-primary',
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('span', ['新增行'])
        ]),
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          'class': {
            'disabled': this.readonly || this.disable
          },
          on: {
            click: () => {
              if (!this.readonly && !this.disable) {
                this.$refs.QContextMenu.hide()
                this.$emit("delete_cur_row", this.row)
              }
            }
          }
        }, [
          h('i', {
            staticClass: 'mdi mdi-minus text-negative',
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('span', ['删除行'])
        ]),
      ])
    },
    render_copy_tools(h) {
      return h('div', {}, [
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          'class': {
            'disabled': this.readonly || this.disable
          },
          on: {
            click: () => {
              if (!this.readonly && !this.disable) {
                this.$refs.QContextMenu.hide()
                this.$emit("copy_cur_row", this.row)
              }
            }
          }
        }, [
          h('i', {
            staticClass: 'mdi mdi-content-copy text-secondary',
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('span', ['复制当前行'])
        ]),
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          'class': {
            'disabled': !this.past || this.disable
          },
          on: {
            click: () => {
              if (this.past && !this.disable) {
                this.$refs.QContextMenu.hide()
                this.$emit("paste_cur_row")
              }
            }
          }
        }, [
          h('i', {
            staticClass: 'mdi mdi-content-paste text-secondary',
            style: {
              fontSize: '16px',
              marginRight: '3px'
            }
          }),
          h('span', ['粘贴复制行'])
        ]),
      ])
    },

  },
  render(h) {
    return h('q-context-menu', {
      ref: 'QContextMenu',
      style: {
        userSelect: 'none',
      },
      on: {
        show: () => {
          this.$emit('click', this.row)
        },
      }
    }, [
      h('div', {
        staticClass: 'font-13 items-center text-left scroll text-weight-medium',
        style: {
          width: '200px',
          borderTop: '10px solid var(--q-color-info)',
        },
        on: {
          contextmenu: (e) => {
            e.preventDefault()
          }
        }
      }, [
        this.render_move_tools(h),
        h('q-item-separator', {staticClass: 'q-ma-none'}),
        this.render_copy_tools(h),
        h('q-item-separator', {staticClass: 'q-ma-none'}),
        this.render_delete_tools(h),
      ])
    ])
  }
}
