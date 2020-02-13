import FontColorCard from './componentFontsColorCard'
import PpField from '../elements/pp_field'

export default {
  name: 'Editor',
  data: () => ({
    fz: ['12', '13', '16', '18', '24', '32', '48'],
    fontLabel: '12'
  }),
  props: {
    desText: '',
    toolBarHide: false,
    readonly: false,
    editorStyle: {},
    contentStyle: {}
  },
  computed: {
    editFz() {
      let length = this.fz.length;
      let fontSizeData = [];
      for (let index = 0; index < length; index++) {
        fontSizeData['font' + this.fz[index]] = {
          cmd: 'fontSize',
          param: index + 1,
          tip: this.fz[index],
          label: this.fz[index],
          icon: this.fz[index],
          handler: () => {
            this.fontLabel = this.fz[index];
            document.execCommand('fontSize', false, index + 1)
          }
        }
      }

      return fontSizeData
    },

    fontSizeTitles() {
      return this.fz.map(f => `font${f}`)
    },
    description() {
      return this.desText
    }
  },
  methods: {
    init() {
      this.fontLabel = this.fz[0]
    },
    render_model_editor(h) {
      return h('div', {staticClass: 'editor-full-screen relative-position'},
        [
          h('q-editor', {
            class: this.toolBarHide ? 'no-border' : '',
            staticClass: 'describe-edit no-ripple',
            ref: "editor",
            style: this.editorStyle,
            props: {
              value: this.description,
              placeholder: '描述',
              readonly: this.readonly,
              toolbar: this.toolBarHide
                ? [] : [
                  ['bold', 'fonts_color_btn'],
                  ['left', 'center', 'right', 'justify'],
                  ['ordered', 'unordered'],
                  ['undo', 'redo'],
                  ['save']
                ],
              definitions: {
                bold: {label: null, tip: '加粗'},
                undo: {tip: '撤销'},
                redo: {tip: '前进'},
                left: {tip: '居左'},
                center: {tip: '居中'},
                right: {tip: '居右'},
                justify: {tip: '自动'},
                ordered: {tip: '有序列表'},
                unordered: {tip: '无序列表'},
                save:{tip:'保存',icon:'save',color:'primary',handler:this.saveWork},
                link: {tip: '超链接'},
                ...this.editFz
              },
              toolbarBg: 'white',
              contentStyle: {
                overflow: 'auto',
                ...this.contentStyle
              }
            },
            on: {
              input: (v) => {
                this.$emit('input', v)
              },
            }
          }),
        ])
    },
    render_font_color(h) {
      return h('q-btn', {
          slot: 'fonts_color_btn',
        }, [h(PpField, {}, [
          h(FontColorCard, {
            on: {
              click: (v) => {
                document.execCommand('foreColor', false, v)
              }
            }
          })
        ])
        ]
      )
    },
    saveWork(){
      this.$emit('save')
    }

  },
  render(h) {
    return this.render_model_editor(h)
  },
  activated() {
    this.init()
  }
}

