import SqlEditor from '../../plugins/sql_exe_editor/editor'
import {ajax_get_table_create_sql} from "../../api/utils/sql_editor_utils_api";
import {to_string} from "../../utils/data_format_utils";

export default {
  name: "comp_table_info_ddl",
  data: () => ({
    value: "",
  }),
  props: {
    datasource_id: [String, Number],
    db: [String],
    table_name: {
      type: [String],
      default: ""
    },
    datasource_type: {
      type: [Number],
    }
  },
  watch: {
    table_name: {
      handler() {
        this.request();
      },
      immediate: true
    }
  },
  methods: {
    request() {
      ajax_get_table_create_sql(this.datasource_id, this.db, this.table_name).then(d => {
        if (d.status === 1) {
          this.value = to_string(d.data)
        }
      })
    }
  },
  render(h) {
    return h('div', {}, [
      h(SqlEditor, {
        ref: 'SqlEditor',
        props: {
          disable: true,
          value: this.value,
          width: '100%',
          toolbar: false,
          height: '450px',
          datasource_type: this.datasource_type
        },

      })
    ])
  },
}
