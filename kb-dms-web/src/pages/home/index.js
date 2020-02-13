import SqlEditor from './comp_sql_editor'
import TableContentCatalog from './comp_table_content_catalog'
import TableInfo from './comp_table_info'
import ExeResult from './comp_exe_result'
import TableCatalog from './comp_table_catalog'
import SqlEditorTabs from './comp_sql_editor_tabs'
import TableEditCatalog from './comp_table_edit_catalog'
import ModalSqlConfirm from './modal_sql_confirm'

export default {
  name: "home_index",
  data: () => ({
    tab: {}
  }),
  methods: {
    render_tab_type(h) {
      if (this.tab.type === 2) {
        return h(TableContentCatalog, {
          ref: 'TableContentCatalog',
          props: {
            datasource_id: this.tab.datasource_id,
            db: this.tab.db,
            table_name: this.tab.table_name,
          },
          on: {
            sql_exe_record_id: (v) => {
              this.$refs.ExeResult && this.$refs.ExeResult.refresh_sql_exe_record_id(v)
            },
            sql_confirm: (v) => {
              this.$refs.ModalSqlConfirm.show(v)
            }
          }
        })
      } else if (this.tab.type === 3) {
        return h(TableEditCatalog, {
          ref: 'TableEditCatalog',
          props: {
            datasource_id: this.tab.datasource_id,
            db: this.tab.db,
            table_name: this.tab.table_name,
            datasource_type: this.tab.datasource_type
          },
          on: {
            sql_exe_record_id: (v) => {
              this.$refs.ExeResult && this.$refs.ExeResult.refresh_sql_exe_record_id(v)
            },
            sql_confirm: (v) => {
              this.$refs.ModalSqlConfirm.show(v)
            }
          }
        })
      } else if (this.tab.type === 4) {
        return h(TableInfo, {
          ref: 'TableInfo',
          props: {
            datasource_id: this.tab.datasource_id,
            db: this.tab.db,
            table_name: this.tab.table_name,
            datasource_type: this.tab.datasource_type
          },
        })
      } else {
        return h(SqlEditor, {
          ref: 'SqlEditor',
          on: {
            sql_exe_record_id: (v) => {
              this.$refs.ExeResult.refresh_sql_exe_record_id(v)
            },
            refresh: () => {
              this.$refs.SqlEditorTabs.refresh_tab_data_list()
            },
            close_curr:()=>{
              this.$refs.SqlEditorTabs.close_cur_tab()

            }
          }
        })
      }
    }
  },
  render(h) {
    return h('div', {
      staticClass: 'row',
      on: {
        contextmenu: (e) => {
          e.preventDefault()
        }
      }
    }, [
      h('div', {
        staticClass: 'col-grow overflow-hidden'
      }, [
        h('div', {
          staticClass: 'row col-12 no-wrap'
        }, [
          h('div', {
            style: {
              width: '240px',
            }
          }, [
            h(TableCatalog, {
              ref: 'TableCatalog',
              on: {
                table_list: (v) => {
                  this.$refs.SqlEditor && this.$refs.SqlEditor.refresh_table_list(v)
                },
                datasource: (v) => {
                  this.$refs.SqlEditor && this.$refs.SqlEditor.refresh_datasource(v)
                },
                // field_list: (v) => {
                //   setTimeout(() => {
                //     this.$refs.SqlEditor && this.$refs.SqlEditor.refresh_filed_list(v)
                //   }, 100)
                // },
                db: (v) => {
                  this.$refs.SqlEditor && this.$refs.SqlEditor.refresh_db(v)
                },
                select_100: (v) => {
                  this.$refs.SqlEditor && this.$refs.SqlEditor.add_sql(v)
                },
                view_table_content: (v) => {
                  this.$refs.SqlEditorTabs && this.$refs.SqlEditorTabs.add_active_tab({
                    name: v.table,
                    db: v.db,
                    datasource_id: v.datasource.id,
                    datasource_type: v.datasource.type,
                    table_name: v.table,
                    from_table_catalog: true,
                    type: 2,
                  }, false)
                },
                view_table_info: (v) => {
                  this.$refs.SqlEditorTabs && this.$refs.SqlEditorTabs.add_active_tab({
                    name: v.table,
                    db: v.db,
                    datasource_id: v.datasource.id,
                    datasource_type: v.datasource.type,
                    table_name: v.table,
                    from_table_catalog: true,
                    type: 4,
                  }, false)
                },
                edit_table: (v) => {
                  this.$refs.SqlEditorTabs && this.$refs.SqlEditorTabs.add_active_tab({
                    name: v.table,
                    db: v.db,
                    datasource_id: v.datasource.id,
                    datasource_type: v.datasource.type,
                    table_name: v.table,
                    type: 3,
                    from_table_catalog: true
                  }, false)
                },
                create_table: (v) => {
                  this.$refs.SqlEditorTabs && this.$refs.SqlEditorTabs.add_active_tab({
                    name: "创建新表",
                    db: v.db,
                    datasource_id: v.datasource.id,
                    datasource_type: v.datasource.type,
                    table_name: v.table,
                    type: 3,
                    from_table_catalog: true
                  }, false)
                },
                new_table_search: (v) => {
                  this.$refs.SqlEditorTabs.refresh_tab_list()

                }
              }
            }),
          ]),
          h('div', {
            staticClass: 'col-grow overflow-hidden'
          }, [
            h(SqlEditorTabs, {
              ref: 'SqlEditorTabs',
              on: {
                select: (v) => {
                  this.tab = v

                  v && v.db && (typeof this.tab['from_table_catalog'] === 'undefined' || !this.tab['from_table_catalog']) && this.$refs.TableCatalog.refresh_db_tab_from_index(v.datasource_id, v.db)

                  if (this.tab.type === 1) {

                    new Promise((resolve, reject) => {
                      if (typeof v.id === 'number') {
                        v && this.$refs.SqlEditor && this.$refs.SqlEditor.save_sql_tab()
                      }
                      resolve("ok")

                    }).then(() => {

                      v && this.$refs.SqlEditor && this.$refs.SqlEditor.refresh_sql(v.sql_text)

                      v && this.$refs.SqlEditor && this.$refs.SqlEditor.refresh_tab(v.id)

                      v && this.$refs.SqlEditor && this.$refs.SqlEditor.refresh_db(v.db)

                      v && this.$refs.SqlEditor && v.datasource && this.$refs.SqlEditor.refresh_datasource(v.datasource)


                    })

                  } else if (this.tab.type === 2) {
                    // setTimeout(() => {
                    //   v && this.$refs.TableContentCatalog && this.$refs.TableContentCatalog.refresh_tab(v.id)
                    // }, 200)
                  } else if (this.tab.type === 3) {
                    // setTimeout(() => {
                    //   v && this.$refs.TableEditCatalog && this.$refs.TableEditCatalog.refresh_tab(v.id)
                    // }, 200)
                  }
                }
              }
            }),
            this.render_tab_type(h),
          ])
        ]),
        h(ExeResult, {
          ref: 'ExeResult',
          on: {
            sql_confirm: (v) => {
              this.$refs.ModalSqlConfirm.show(v)
            }
          }
        }),
        h(ModalSqlConfirm, {
          ref: 'ModalSqlConfirm'
        })
      ])
    ])
  },
  mounted() {
  }
}
