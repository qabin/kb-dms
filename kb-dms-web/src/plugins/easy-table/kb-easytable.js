import 'kb-easy-table/libs/themes-base/index.css'
import {VTable} from 'kb-easy-table'

export default {
  name: 'easyTable',
  components: {
    VTable
  },
  props: {
    columns: {
      type: Array,
      default: []
    },
    tableData: {
      type: Array,
      default: []
    },
    tableClass: {
      type: String,
      default: ''
    },
    tableStyle: {
      type: Object,
      default: {}
    },
    tableOption: {
      type: Object,
      default: {}
    },
    bodyTrContext: null

  },
  methods: {
    __getEaseTable(h) {
      return h('v-table', {
        style: {
          width: '100%'
        },
        props: {
          height: 300,
          columns: this.columns,
          'table-data': this.tableData,
          'is-horizontal-resize': true,
          'column-width-drag': true,
          titleRowHeight: 30,
          bodyTrContext: this.bodyTrContext || null,
          ...this.tableOption
        },
        on: {
          'on-custom-comp': (v) => {
            this.$emit('on-custom-com', v)
          }
        }
      });
    },
  },
  render(h) {
    return this.__getEaseTable(h)
  }
}
