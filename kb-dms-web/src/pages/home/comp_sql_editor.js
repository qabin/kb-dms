import SqlEditor from '../../plugins/sql_exe_editor/editor'
import {datasource_type_enum} from "../../utils/config_dictionary";
import {ajax_sql_exe_async} from "../../api/utils/sql_exe_utils_api";
import {
  ajax_add_sql_editor_tab,
  ajax_delete_sql_editor_tab,
  ajax_share_sql_editor_tab,
  ajax_update_sql_editor_tab,
} from "../../api/user/sql_editor_tab_api";

import {ajax_get_datasource_db_table_field} from "../../api/config/datasource_api";

export default {
  name: "comp_sql_editor",
  data: () => ({
    value: "",
    tables: [],
    fields: [],
    db: null,
    datasource: null,
    tab_id: null,
    tab_name: null
  }),
  methods: {
    refresh_table_list(table_list) {
      this.tables = []
      table_list && table_list.map(d => {
        this.tables.push({
          name: d.name,
          value: d.name,
          caption: d.name,
          meta: 'table',
          type: 'local',
          score: 1000,
          completer: {
            insertMatch: (editor, data, ob) => {

              data.meta === 'table' && (editor['auto_complete_value'] = data.value)
              if (ob.completions.filterText) {
                let ranges = editor.selection.getAllRanges();
                for (let i = 0, range; range = ranges[i]; i++) {
                  range.start.column -= ob.completions.filterText.length;
                  editor.session.remove(range);
                }
              }
              if (data.snippet)
                ob.snippetManager.insertSnippet(editor, data.snippet);
              else
                editor.execCommand("insertstring", data.value || data);
            }
          }
        })
      })
      this.tables.length > 0 && this.$refs.SqlEditor && this.$refs.SqlEditor.add_auto_completes(this.tables)
    },
    refresh_datasource(v) {
      this.datasource = v
    },
    refresh_filed_list(table_name) {
      ajax_get_datasource_db_table_field(this.datasource.id, this.db, table_name).then(d => {
        if (d.status === 1) {
          this.fields = []
          d.data && d.data.map(d => {
            this.fields.push({
              name: d.column_name,
              value: d.column_name,
              caption: d.column_name,
              meta: 'field',
              type: 'local',
              score: 1001
            })
          })
          this.fields.length > 0 && this.$refs.SqlEditor && this.$refs.SqlEditor.add_auto_completes(this.fields)
        }
      })
    },
    refresh_db(v) {
      this.db = v
    },
    refresh_sql(v) {
      this.value = v || ""
    },
    add_sql(v) {
      this.value = this.value && this.value.length > 0 ? this.value + '\n\n' + v : v

      this.exe_sql(v)
    },
    refresh_tab(v) {
      this.tab_id = v || null
    },
    exe_sql(sql) {
      sql && ajax_sql_exe_async(this.datasource.id, this.db, sql).then(d => {
        if (d.status === 1) {
          this.$emit('sql_exe_record_id', d.data)
        }

        this.save_sql_tab()
      })
    },
    save_sql_tab() {
      if (this.db) {
        if (this.tab_id && typeof this.tab_id === 'number') {
          ajax_update_sql_editor_tab(this.tab_id, {
            sql_text: this.value,
            name: this.tab_name,
            datasource_id: this.datasource.id,
            db: this.db,
          }).then(d => {
            this.tab_name = null
            this.$emit("refresh")

          })
        } else {
          ajax_add_sql_editor_tab({
            sql_text: this.value,
            name: this.tab_name,
            datasource_id: this.datasource.id,
            db: this.db,
          }).then(d => {
            this.tab_name = null

            if (d.status === 1) {
              this.tab_id = d.data
            } else {
            }
            this.$emit("refresh")

          })
        }
      }

    }
  },
  render(h) {
    return h('div', {}, [
      h(SqlEditor, {
        ref: 'SqlEditor',
        props: {
          disable: false,
          value: this.value,
          width: '100%',
          toolbar: true,
          height: '450px',
          sql_type: this.datasource && this.datasource != null ? datasource_type_enum[this.datasource.type].label.toLowerCase() : 'sql',
        },
        on: {
          auto_complete_value: (v) => {
            this.refresh_filed_list(v)
          },
          delete: () => {
            this.$q.ppDialog(
              h => [
                h('div', {
                  staticClass: 'font-14'
                }, ['删除窗口'])
              ],
              h => [
                h('div', {
                  staticClass: 'q-ml-md q-mt-md items-center text-tertiary'
                }, [
                  h('span', ['确认删除当前窗口吗？']),
                ]),
              ],
              (close) => {
                this.tab_id && ajax_delete_sql_editor_tab(this.tab_id).then(d => {
                  if (d.status === 1) {
                    this.$q.ok("删除窗口成功！")
                    this.$emit("close_curr")
                  }
                })

                close && close()
              },
              (close) => {
                close && close()
              }
            )
          },
          input: (v) => {
            this.value = v
            this.$emit('value', v)
          },
          exe_selected_sql: (v) => {
            if (v && v != null) {
              this.exe_sql(v)
            } else {
              this.exe_sql(this.value)
            }
          },
          exe_all_sql: () => {
            this.exe_sql(this.value)
          },
          save: () => {
            if (this.$store.state.user.name) {
              if (this.tab_id && typeof this.tab_id === 'number') {
                ajax_update_sql_editor_tab(this.tab_id, {
                  sql_text: this.value,
                  name: this.tab_name,
                  datasource_id: this.datasource.id,
                  db: this.db,
                }).then(d => {
                  if (d.status === 1) {
                    this.$q.ok("保存成功！")
                    this.$emit("refresh")
                  } else {
                    this.$q.err("保存异常！")
                  }
                })
              } else {
                this.$q.ppDialog(
                  h => [
                    h('div', {
                      staticClass: 'font-14'
                    }, ['保存数据库脚本'])
                  ],
                  h => [h('q-input', {
                    staticClass: 'q-ma-md font-13',
                    props: {
                      placeholder: '请输入名称',
                      value: this.tab_name,
                      hideUnderline: true,
                    },
                    on: {
                      input: (v) => {
                        this.tab_name = v
                      }
                    }
                  })],
                  (close) => {
                    ajax_add_sql_editor_tab({
                      sql_text: this.value,
                      name: this.tab_name,
                      datasource_id: this.datasource.id,
                      db: this.db,
                    }).then(d => {
                      if (d.status === 1) {
                        this.$q.ok("保存成功！")
                        this.$emit("refresh")
                        this.tab_id = d.data
                      } else {
                        this.$q.err("保存异常！")
                      }
                    })

                    close && close()
                  },
                  (close) => {
                    close && close()
                  }
                )

              }

            } else {
              this.$q.err('登录后保存！')
              this.$router.push({path: '/login'})
            }
          },
          save_as: () => {
            if (this.$store.state.user.name) {
              this.$q.ppDialog(
                h => [
                  h('div', {
                    staticClass: 'font-14'
                  }, ['保存数据库脚本'])
                ],
                h => [h('q-input', {
                  staticClass: 'q-ma-md font-13',
                  props: {
                    placeholder: '请输入名称',
                    value: this.tab_name,
                    hideUnderline: true,
                  },
                  on: {
                    input: (v) => {
                      this.tab_name = v
                    }
                  }
                })],
                (close) => {
                  if (this.tab_id && typeof this.tab_id === 'number') {
                    ajax_update_sql_editor_tab(this.tab_id, {
                      sql_text: this.value,
                      name: this.tab_name,
                      datasource_id: this.datasource.id,
                      db: this.db,
                    }).then(d => {
                      if (d.status === 1) {
                        this.$q.ok("保存成功！")
                        this.$emit("refresh")
                      } else {
                        this.$q.err("保存异常！")
                      }
                    })
                  } else {
                    ajax_add_sql_editor_tab({
                      sql_text: this.value,
                      name: this.tab_name,
                      datasource_id: this.datasource.id,
                      db: this.db,
                    }).then(d => {
                      if (d.status === 1) {
                        this.$q.ok("保存成功！")
                        this.$emit("refresh")
                        this.tab_id = d.data
                      } else {
                        this.$q.err("保存异常！")
                      }
                    })
                  }
                  close && close()
                },
                (close) => {
                  close && close()
                }
              )

            } else {
              this.$q.err('登录后保存！')
              this.$router.push({path: '/login'})
            }
          },
          share_person: (v) => {
            this.tab_id && ajax_share_sql_editor_tab(this.tab_id, {
              users: v
            }).then(d => {
              if (d.status === 1) {
                this.$q.ok("分享成功！")
              }
            })
          }
        }
      })
    ])
  },
}
