import ace from 'kb-brace/index'
import 'kb-brace/ext/emmet'
import 'kb-brace/ext/language_tools'
//import 'kb-brace/mode/sql'
import 'kb-brace/mode/mysql'
// import 'kb-brace/mode/sqlserver'
//import 'kb-brace/mode/pgsql'
import 'kb-brace/theme/eclipse'
import 'kb-brace/snippets/javascript'
import './style.css'
import PersonSelector from '../../components/selector/ComponentMultiPersonSelector'
import extend from "quasar-framework/src/utils/extend";
import UploadFile from '../../components/upload/button_upload_file'


const langTools = ace.acequire("ace/ext/language_tools");

export default {
  name: 'sql_editor',
  props: {
    value: {
      required: true,
    },
    height: true,
    width: true,
    disable: {
      required: false,
      type: Boolean,
      default: false
    },
    toolbar: {
      required: false,
      type: Boolean,
      default: false
    },
    sql_type: {
      required: false,
      type: String,
      default: 'sql'
    },
    simple_mode: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    editor: null,
    contentBackup: "",
    internalChange: false,
    share_person: [],
    show_share: false,
    auto_completes: [],
    last_refresh_time: null
  }),
  watch: {
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
        this.contentBackup = v
        this.editor.session.setValue(v)
      }
    },
    disable(v) {
      if (this.editor) {
        this.editor.setReadOnly(v)
        v ? this.$refs.vue_editor.classList.add('ace_content_disable') : this.$refs.vue_editor.classList.remove('ace_content_disable')
      }
    },
    sql_type: {
      immediate: true,
      handler: function (nv, ov) {
        if (nv) {
          //this.editor && this.set_sql_mode()
        }
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
        !this.simple_mode && h('q-icon', {
          staticClass: 'cursor-pointer q-ml-sm pp-selectable-bg-blue-5 pp-selectable-color-white',
          props: {
            name: 'play_arrow',
            color: 'primary',
            size: '28px'
          },
          attrs: {
            id: 'exe_selected_sql_id'
          },
          nativeOn: {
            click: () => this.$emit('exe_selected_sql', this.editor.getSelectedText())
          }
        }, [h('q-tooltip', {props: {offset: [5, 5]}}, '执行选中内容(或按F7)')]),
        h('q-icon', {
          staticClass: 'cursor-pointer q-ml-sm pp-selectable-bg-blue-5 pp-selectable-color-white',
          props: {
            name: 'playlist_play',
            color: 'primary',
            size: '28px'
          },
          attrs: {
            id: 'exe_all_sql_id'
          },
          nativeOn: {
            click: () => this.$emit('exe_all_sql')
          }
        }, [h('q-tooltip', {props: {offset: [5, 5]}}, '执行全部内容(或按F8)')]),
        !this.simple_mode && h('q-icon', {
          staticClass: 'cursor-pointer q-ml-sm pp-selectable-bg-green-5 pp-selectable-color-white',
          style: {
            padding: '4px'
          },
          props: {
            name: 'save',
            color: 'secondary',
            size: '20px'
          },
          nativeOn: {
            click: () => this.$emit('save')
          }
        }, [h('q-tooltip', {props: {offset: [5, 5]}}, '保存查询窗口')]),
        !this.simple_mode && h('i', {
          staticClass: 'mdi mdi-content-save-all text-secondary q-ml-sm cursor-pointer pp-selectable-bg-green-5 pp-selectable-color-white',
          style: {
            fontSize: '20px',
            padding: '1px 4px 1px 4px'
          },
          on: {
            click: () => {
              this.$emit('save_as')
            }
          }
        }, [h('q-tooltip', {props: {offset: [5, 5]}}, '查询窗口重命名')]),
        h('q-icon', {
          staticClass: 'cursor-pointer q-ml-sm pp-selectable-bg-green-5 pp-selectable-color-white',
          style: {
            padding: '4px'
          },
          props: {
            name: 'file_copy',
            color: 'secondary',
            size: '20px'
          },
          nativeOn: {
            click: () => this.copy_value()
          }
        }, [h('q-tooltip', {props: {offset: [5, 5]}}, '复制SQL语句')]),
        h('i', {
          staticClass: 'mdi mdi-folder-open-outline relative-position text-positive q-ml-sm cursor-pointer pp-selectable-bg-green-5 pp-selectable-color-white',
          style: {
            fontSize: '22px',
            padding: '1px 4px 1px 4px'
          },
          on: {
            click: () => {
            }
          }
        }, [
          h('q-tooltip', {props: {offset: [5, 5]}}, '打开本地SQL脚本文件'),
          h(UploadFile, {
            on: {
              uploaded: (v) => {
                this.value = this.value ? this.value + '\n' + v : v
              }
            }
          })
        ]),
        h('q-icon', {
          staticClass: 'cursor-pointer q-ml-sm pp-selectable-bg-red-5 pp-selectable-color-white',
          style: {
            padding: '4px'
          },
          props: {
            name: 'cancel',
            color: 'negative',
            size: '20px'
          },
          nativeOn: {
            click: () => this.editor.setValue("")
          }
        }, [h('q-tooltip', {props: {offset: [5, 5]}}, '清空SQL语句')]),
        h('q-icon', {
          staticClass: 'cursor-pointer q-ml-sm pp-selectable-bg-red-5 pp-selectable-color-white',
          style: {
            padding: '4px'
          },
          props: {
            name: 'delete_forever',
            color: 'negative',
            size: '22px'
          },
          nativeOn: {
            click: () => {
              this.$emit('delete')
            }
          }
        }, [
          h('q-tooltip', {props: {offset: [5, 5]}}, '删除窗口'),
        ]),
        h('q-icon', {
          staticClass: 'cursor-pointer q-ml-sm pp-selectable-bg-blue-5 pp-selectable-color-white',
          style: {
            padding: '4px'
          },
          props: {
            name: 'share',
            color: 'info',
            size: '20px'
          },
          nativeOn: {
            click: () => {
              this.show_share = true
            }
          }
        }, [
          h('q-tooltip', {props: {offset: [5, 5]}}, '分享查询窗口'),
        ]),
        this.show_share ? this.render_share_input(h) : null
      ])
    },
    render_tools_bar_right(h) {
      return h('div', {
        staticClass: 'row items-center full-height btn-hover'
      }, [])
    },
    render_tools_bar(h) {
      return h('div', {
        staticClass: 'row no-wrap bg-grey-3 items-center',
        style: {
          height: '40px'

        }
      }, [
        this.toolbar ? this.render_tools_bar_left(h) : null,
        this.toolbar ? this.render_tools_bar_right(h) : null
      ])
    },
    render_share_input(h) {
      return ('div', {}, [
        h(PersonSelector, {
          style: {
            width: '200px',
            maxHeight: '30px',
            overflow: 'auto'
          },
          props: {
            value: this.share_person,
            placeholder: '请选择要分享的人',
          },
          on: {
            input: (v) => {
              this.share_person = v
              // ajax_update_datasource_owners(this.datasource.id, this.owners).then().catch()
            },
          },
        }),
        h('q-btn', {
          props: {
            label: '确认',
            flat: true,
            color: 'primary',
            disable: this.share_person.length <= 0,
            size: 'sm'
          },
          on: {
            click: () => {
              this.$emit("share_person", this.share_person)
              this.show_share = false
            }
          }
        }),
        h('q-btn', {
          props: {
            label: '取消',
            flat: true,
            color: 'faded',
            size: 'sm'
          },
          on: {
            click: () => {
              this.share_person = []
              this.show_share = false
            }
          }
        }),
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
          //处理自动补全的数据库表
          if (this.editor.auto_complete_value && typeof this.editor.auto_complete_value !== "undefined") {
            this.$emit('auto_complete_value', this.editor.auto_complete_value)
            this.editor.auto_complete_value = null
          }
        }
      }
    },
    add_auto_completes(completes) {
      if (completes) {
        if (this.last_refresh_time && (new Date()).getTime() - this.last_refresh_time <= 1000) {
          return false
        } else {
          this.last_refresh_time = (new Date()).getTime()
        }

        completes.map(d => {
          if (!this.auto_completes.some(c => c.name === d.name && c.meta === d.meta)) {
            this.auto_completes.push(d)
          }

        })

        let values = extend(true, [], this.auto_completes)

        langTools.addCompleter({
          getCompletions: function (editor, session, pos, prefix, callback) {
            callback(null, [
              ...values
            ]);
          }
        });
      }
    },
    initView() {
      this.editor && this.editor.destroy();
      this.editor && this.editor.container.remove()
      this.editor = null
      this.contentBackup = this.value && this.value !== null ? this.value : ''
      let vm = this;
      let editor_div = this.$refs.vue_editor
      let editor = vm.editor = ace.edit(editor_div)
      this.disable && editor_div.classList.add('ace_content_disable')

      this.$emit('init', editor)

      editor.$blockScrolling = Infinity
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
      })

      //this.set_sql_mode()
      editor.getSession().setMode('ace/mode/mysql')
      editor.setTheme('ace/theme/eclipse')
      editor.getSession().setUseWrapMode(true)
      editor.setShowPrintMargin(false)
      editor.setValue(this.contentBackup)
      editor.gotoLine(1);

      ace.acequire("ace/ext/language_tools")
      editor.on('change', vm.onChange);
      if (vm.disable) {
        editor.setReadOnly(true)
      }
    },
    //set_sql_mode() {
    //this.editor.getSession().setMode('ace/mode/sqlserver')
    // switch (this.sql_type) {
    //   case 'sql':
    //     this.editor.getSession().setMode('ace/mode/sql')
    //     break
    //   case 'mysql':
    //     this.editor.getSession().setMode('ace/mode/mysql')
    //     break
    //   case 'sqlserver':
    //     this.editor.getSession().setMode('ace/mode/sqlserver')
    //     break
    //   case 'pgsql':
    //     this. editor.getSession().setMode('ace/mode/pgsql')
    //     break
    // }
    // }
  },

  beforeDestroy() {
    this.editor.destroy();
    this.editor.container.remove()
  },
  mounted() {
    this.initView()
    window.onkeydown = () => {
      if (window.event.keyCode === 118) {
        document.getElementById("exe_selected_sql_id").click()
      }

      if (window.event.keyCode === 119) {
        document.getElementById("exe_all_sql_id").click()
      }
    }


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
