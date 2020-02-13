import ModalMixin from "../../../components/modal/MixinsBaseModal";
import {required} from "vuelidate/lib/validators";
import PpField from "../../../components/elements/pp_field";
import Editor from "../../../components/editor/Editor";
import GroupSelector from '../../../components/selector/BusGroupSelector'
import DatasourceTypeSelector from '../../../components/selector/DatasourceTypeSelector'
import {ajax_add_datasource} from "../../../api/config/datasource_api";

export default {
  name: 'createTroubleModal',
  mixins: [ModalMixin],
  props: {},
  data: () => ({
    model: {
      name: null,
      description: null,
      group_id: null,
      group_name: null,
      type: null
    },
    generic_placeholder: '待添加',
    labelWidth: 110,
    minWidth: '550px',
    maxWidth: '550px',
    group: null,
    datasource_type: null
  }),
  validations: {
    model: {
      name: {required},
      group_id: {required},
      type: {required}
    }
  },
  watch: {
    group: {
      handler(nv, ov) {
        nv && nv.value && (this.model.group_id = nv.value)
      },
      deep: true,
      immediate: true
    },
    datasource_type: {
      handler(nv, ov) {
        nv && nv.value && (this.model.type = nv.value)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    title() {
      return '创建字典映射'
    },
    init() {
      this.model = {
        name: null,
        description: null,
        group_id: null,
        group_name: null,
        type: null,
      };
      this.group = null
      this.datasource_type = null
    },
    submit({done, close}) {
      ajax_add_datasource(this.model.name, this.model.type, this.model.group_id, this.model.description)
        .then((d) => {
          if (d.status === 1) {
            close();
            this.$emit('submit', {
              group: {
                group_id: this.group.value,
                group_name: this.group.label
              },
              datasource: {
                id: d.data,
                ...this.model
              }
            });
          }

        })
        .catch(() => {
          done();
          this.$q.err('添加数据源失败!');
        });
    },
    cancel() {
    },
    field_class(others) {
      return 'q-mb-md ' + others
    },
    render_contents(h) {
      return [
        this.render_name(h),
        this.render_type(h),
        this.render_group(h),
        this.render_description(h),

      ];
    },
    render_name(h) {
      return h(PpField, {
        staticClass: this.field_class(),
        props: {labelWidth: this.labelWidth, label: '名称', required: true, error: this.$v.model.name.$error}
      }, [
        h('q-input', {
          props: {
            color: 'tertiary',
            value: this.model.name,
            placeholder: this.generic_placeholder,
            hideUnderline: true
          },
          on: {input: (v) => this.model.name = v}
        })
      ])
    },
    render_type(h) {
      return h(PpField, {
        staticClass: this.field_class(),
        props: {labelWidth: this.labelWidth, label: '类型', required: true, error: this.$v.model.type.$error}
      }, [
        h(DatasourceTypeSelector, {
          props: {
            value: this.datasource_type,
            placeholder: this.generic_placeholder
          },
          on: {input: (v) => this.datasource_type = v}
        })
      ])
    },
    render_group(h) {
      return h(PpField, {
        staticClass: this.field_class(),
        props: {labelWidth: this.labelWidth, label: '所属团队', required: true, error: this.$v.model.group_id.$error}
      }, [
        h(GroupSelector, {
          props: {
            value: this.group,
            placeholder: this.generic_placeholder
          },
          on: {
            input: (v) => {
              this.group = v
              this.$emit('group', v)
            }
          }
        })
      ])
    },
    render_description(h) {
      return h(Editor, {
        props: {
          desText: this.model.description || '',
          placeholder: '描述',
          contentStyle: {minHeight: 50, fontSize: '13px', backgroundColor: 'transparent', whiteSpace: 'pre-wrap'},
        },
        on: {
          input: (v) => {
            this.model.description = v
            this.$emit('description', v)
          }
        }
      })
    }
  }
}
