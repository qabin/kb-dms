export default {
  name: 'comp_table_data_menu',
  data: () => ({}),
  props: {
    row: {
      type: [Object, String]
    }
  },
  methods: {
    render_delete_tools(h) {
      return h('div', {}, [
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          on: {
            click: () => {
              this.$refs.QContextMenu.hide()
              this.$emit("delete_cur_row", this.row)
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
          h('span', ['删除当前行'])
        ]),
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          on: {
            click: () => {
              this.$refs.QContextMenu.hide()
              this.$emit("add_new_row")
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
      ])
    },
    render_copy_tools(h) {
      return h('div', {}, [
        h('div', {
          staticClass: 'pp-selected-bg-grey-2-hover q-pa-sm col-grow cursor-pointer text-left overflow-hidden',
          on: {
            click: () => {
              this.$refs.QContextMenu.hide()
              this.$emit("copy_cur_row", this.row)
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
          on: {
            click: () => {
              this.$refs.QContextMenu.hide()
              this.$emit("paste_cur_row")

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
        this.render_copy_tools(h),
        h('q-item-separator', {staticClass: 'q-ma-none'}),
        this.render_delete_tools(h),
      ])
    ])
  }
}
