export default {
  name: 'comp_table_index_row_menu',
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
    render_delete_tools(h) {
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
        this.render_delete_tools(h),
      ])
    ])
  }
}
