import ace from 'kb-brace/index'
import 'kb-brace/ext/emmet'
import 'kb-brace/ext/language_tools'
import 'kb-brace/mode/html'
import 'kb-brace/mode/json'
import 'kb-brace/mode/text'
import 'kb-brace/mode/xml'
import 'kb-brace/theme/eclipse'
import 'kb-brace/theme/terminal'
import 'kb-brace/snippets/javascript'
import './vue-editor.css'
import {
  string_to_json_wrap,
  json_wrap_to_string,
  string_to_xml_wrap,
  check_string_type,
  wrap_to_string,
  string_to_wrap
} from './vue-eidtor-data-format'

export default {
  name: 'vue_editor',
  props: {
    value: {
      required: true,
    },
    theme: {
      type: String,
      default: 'eclipse',
      required: false
    },
    height: true,
    width: true,
    options: Object,
    toolbar: {
      required: false,
      default: true,
      type: Boolean
    },
    disable: {
      required: false,
      type: Boolean,
      default: false
    },
    type: {
      required: false,
      type: String
    }
  },
  data: () => ({
    editor: null,
    contentBackup: "",
    value_type: null,
    internalChange: false
  }),
  watch: {
    theme(v) {
      this.editor.setTheme('ace/theme/' + v);
    },
    options(v) {
      this.editor.setOptions(v)
    },
    height() {
      this.$nextTick(function () {
        this.editor.resize()
      })
    },
    width() {
      this.$nextTick(function () {
        this.editor.resize()
      })
    },
    value(v) {
      if (this.editor && !this.internalChange) {
        v = v && v !== null ? v : ''
        typeof v === 'object' && (v = JSON.stringify(v))
        this.contentBackup = string_to_wrap(v)
        this.value_type = this.type || check_string_type(this.contentBackup)
        this.editor.session.setValue(this.contentBackup)
      }
    },
    value_type(nv) {
      switch (nv) {
        case 'JSON': {
          this.contentBackup = string_to_json_wrap(this.contentBackup)
          this.editor.getSession().setMode('ace/mode/' + nv.toLowerCase())
          this.editor.session.setValue(this.contentBackup)
          break
        }
        case 'TEXT': {
          this.contentBackup = json_wrap_to_string(this.contentBackup)
          this.editor.getSession().setMode('ace/mode/' + nv.toLowerCase())
          this.editor.session.setValue(this.contentBackup)
          break
        }
        case 'XML': {
          this.contentBackup = string_to_xml_wrap(this.contentBackup)
          this.editor.getSession().setMode('ace/mode/' + nv.toLowerCase())
          this.editor.session.setValue(this.contentBackup)
          break
        }
        case 'HTML': {
          this.contentBackup = string_to_xml_wrap(this.contentBackup)
          this.editor.getSession().setMode('ace/mode/' + nv.toLowerCase())
          this.editor.session.setValue(this.contentBackup)
          break
        }
      }
    },
    disable(v) {
      if (this.editor) {
        this.editor.setReadOnly(v)
        v ? this.$refs.vue_editor.classList.add('ace_content_disable') : this.$refs.vue_editor.classList.remove('ace_content_disable')
      }
    }
  },
  methods: {
    px: function (n) {
      if (/^\d*$/.test(n)) {
        return n + "px";
      }
      return n;
    },
    render_tools_bar_left(h) {
      return h('div', {
        staticClass: 'row items-center col-grow text-left full-height'
      }, [
        h('div', {
          staticClass: 'row items-center btn-hover cursor-pointer full-height',
          on: {
            click: () => {
              this.contentBackup = string_to_wrap(this.contentBackup, this.value_type)
              this.editor.session.setValue(this.contentBackup)
            }
          }
        }, [h('q-icon', {
          props: {
            name: 'wrap_text',
            color: 'faded',
            size: '26px'
          },
        })]),
        h('div', {
          staticClass: 'row items-center btn-hover cursor-pointer full-height',
          on: {
            click: () => {
              this.contentBackup = wrap_to_string(this.contentBackup, this.value_type)
              this.editor.session.setValue(this.contentBackup)
            }
          }
        }, [h('q-icon', {
          props: {
            name: 'notes',
            color: 'faded',
            size: '26px'
          },
        })]),
        h('q-btn-dropdown', {
          staticClass: 'full-height btn-hover',
          props: {
            flat: true,
            label: this.value_type,
            dense: true
          },
        }, [
          h('q-list', {
            staticClass: 'bg-grey-1',
            props: {
              link: true,
              dense: true,
            },
          }, [
            h('q-item', {
              style: {
                paddingLeft: '5px',
                paddingRight: '5px',
                fontSize: '14px'
              },
              directives: [{
                name: 'close-overlay',
              }],
              nativeOn: {
                click: () => this.value_type = 'JSON'
              }
            }, ['JSON']),
            h('q-item', {
              staticClass: 'font-12',
              style: {
                paddingLeft: '5px',
                paddingRight: '5px',
                fontSize: '14px'
              },
              directives: [{
                name: 'close-overlay',
              }],
              nativeOn: {
                click: () => this.value_type = 'XML'
              }
            }, [
              'XML'
            ]),
            h('q-item', {
              staticClass: 'font-12',
              style: {
                paddingLeft: '5px',
                paddingRight: '5px',
                fontSize: '14px'
              },
              directives: [{
                name: 'close-overlay',
              }],
              nativeOn: {
                click: () => this.value_type = 'HTML'
              }
            }, [
              'HTML'
            ]),
            h('q-item', {
              staticClass: 'font-12',
              style: {
                paddingLeft: '5px',
                paddingRight: '5px',
                fontSize: '14px'
              },
              directives: [{
                name: 'close-overlay',
              }],
              nativeOn: {
                click: () => this.value_type = 'TEXT'
              }
            }, [
              'TEXT'
            ]),
          ])
        ])
      ])
    },
    render_tools_bar_right(h) {
      return h('div', {
        staticClass: 'row items-center full-height btn-hover'
      }, [
        h('q-icon', {
          staticClass: 'cursor-pointer',
          props: {
            name: 'file_copy',
            color: 'faded',
            size: '26px'
          },
          nativeOn: {
            click: () => this.copy_value()
          }
        })
      ])
    },
    render_tools_bar(h) {
      return h('div', {
        staticClass: 'row no-wrap bg-grey-1 items-center',
        style: {
          height: '40px'

        }
      }, [
        this.render_tools_bar_left(h),
        this.render_tools_bar_right(h)
      ])
    },
    copy_value() {
      this.$copyText(this.contentBackup).then(() => {
        this.$q.ok('已经复制到粘贴板！')
      }, () => {
        this.$q.err('复制失败！')
      })
    },
    onChange() {
      let error = false
      let v
      try {
        v = this.editor.getValue()
        error = false
      } catch (err) {
        error = true
      }
      if (error) {
        this.$emit("error")
      } else {
        if (this.editor) {
          this.internalChange = true
          this.contentBackup = v
          this.$emit("input", v)
          this.$nextTick(() => {
            this.internalChange = false
          })
        }
      }
    },
    initView() {
      this.contentBackup = this.value && this.value !== null ? this.value : ''
      this.value_type = check_string_type(this.value)
      let vm = this;
      let lang = this.lang || 'text'
      let theme = this.theme && this.theme !== 'eclipse' ? this.theme : 'eclipse'
      let editor_div = this.$refs.vue_editor
      let editor = vm.editor = ace.edit(editor_div)

      this.$emit('init', editor)

      editor.$blockScrolling = Infinity
      editor.setOption("enableEmmet", false)
      editor.getSession().setMode('ace/mode/' + lang)
      editor.setTheme('ace/theme/' + theme)
      editor.getSession().setUseWrapMode(true)
      editor.setShowPrintMargin(false)
      editor.setValue(this.contentBackup)

      editor.on('change', vm.onChange);
      if (vm.options)
        editor.setOptions(vm.options)

      if (vm.disable) {
        editor.setReadOnly(true)
      }
    },
  },

  beforeDestroy() {
    this.editor.destroy();
    this.editor.container.remove()
  },
  mounted() {
    this.initView()
  },
  render(h) {
    let height = this.height ? this.px(this.height) : '100%'
    let width = this.width ? this.px(this.width) : '100%'
    return h('div', {
      staticClass: 'col-grow',
      style: {
        border: '1px solid #eee'
      }
    }, [
      this.toolbar ? this.render_tools_bar(h) : null,
      h('div', {
        staticClass: 'auto-height',
        ref: 'vue_editor',
        style: {
          width: width,
          height: height,
        }
      })
    ])
  },
}
