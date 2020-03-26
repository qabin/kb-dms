import {data_options_type_enums} from "../../utils/sql_editor_dictionary";

export function get_ddl_sql_builder(option_type, old_rows, new_rows, old_table, new_table, table_charset, table_remarks, old_index_rows, new_index_rows) {
  new_rows = new_rows.filter(r => r.column_name)
  old_rows = old_rows.filter(r => r.column_name)

  let sql = "";
  if (option_type === 1) {
    //新建表
    if (new_rows && new_rows.length > 0 && new_table) {
      sql = "CREATE TABLE " + "`" + new_table + "`(\n";
      //拼接字段

      for (let i = 0; i < new_rows.length; i++) {

        if (new_rows[i].column_name && new_rows[i].column_name.length > 0) {
          sql += ("    `" + new_rows[i].column_name
            + "` " + (new_rows[i].type_name ? new_rows[i].type_name : "")
            + (new_rows[i].is_unsigned ? " UNSIGNED" : "")
            + (new_rows[i].is_nullable ? "" : " NOT NULL")
            + (new_rows[i].is_autoincrement ? " AUTO_INCREMENT" : "")
            + (((new_rows[i].column_def && new_rows[i].column_def.length > 0) || new_rows[i].column_def === '') ? new_rows[i].type_name.toUpperCase().indexOf('DATETIME') !== -1 && new_rows[i].column_def.toUpperCase().indexOf('CURRENT_TIMESTAMP') !== -1 ? " DEFAULT " + new_rows[i].column_def : " DEFAULT '" + new_rows[i].column_def + "'" : "")
            + (new_rows[i].remarks && new_rows[i].remarks.length > 0 ? " COMMENT '" + new_rows[i].remarks + "'" : ""))
            + ",\n"
        }

      }

      //拼接主键
      let primary_key_list = []
      new_rows.map(r => {
        if (r.is_primary_key) {
          primary_key_list.push(r.column_name)
        }
      })

      if (primary_key_list.length > 0) {
        sql += "    PRIMARY KEY (";

        for (let i = 0; i < primary_key_list.length; i++) {
          if (primary_key_list.length - 1 === i) {
            sql += "`" + primary_key_list[i] + "`"
          } else {
            sql += "`" + primary_key_list[i] + "`,"
          }
        }
        sql += "),\n";
      }

      //拼接索引
      if (new_index_rows) {
        let filter_index_rows = new_index_rows.filter(idx => idx.index_name && idx.index_name !== 'PRIMARY')

        for (let i = 0; i < filter_index_rows.length; i++) {
          if (filter_index_rows[i].index_type === 'UNIQUE') {
            sql += "   UNIQUE KEY `" + filter_index_rows[i].index_name + "` (" + get_index_columns(filter_index_rows[i].index_columns) + "),\n"
          } else {
            sql += "   KEY `" + filter_index_rows[i].index_name + "` (" + get_index_columns(filter_index_rows[i].index_columns) + "),\n"
          }
        }
      }

      if (sql.endsWith(",\n")) {
        sql = sql.substring(0, sql.lastIndexOf(",\n"))
        sql += '\n'
      }

      sql += (") ENGINE=InnoDB DEFAULT CHARSET=" + table_charset + " COMMENT='" + (table_remarks ? table_remarks : "") + "'");
      sql += ";"
    }


  } else if (option_type === 2) {
    //编辑表
    for (let i = 0; i < new_rows.length; i++) {
      if (typeof new_rows[i].options_type !== 'undefined') {

        if (new_rows[i].options_type.value === data_options_type_enums.UPDATE.value) {
          sql += get_ddl_update_row_for_mysql(old_table, new_rows[i]) + '\n'
        } else if (new_rows[i].options_type.value === data_options_type_enums.DELETE.value) {
          sql += get_ddl_delete_row_for_mysql(old_table, new_rows[i]) + '\n'
        } else if (new_rows[i].options_type.value === data_options_type_enums.ADD.value) {
          sql += get_ddl_add_row_for_mysql(old_table, new_rows[i],) + '\n'
        }
      }
    }
    //主键变更
    sql += get_ddl_update_primary_key_for_mysql(old_rows, new_rows)

    //索引变更
    sql += get_ddl_update_index_for_mysql(new_index_rows)

    //修改表名、备注
    sql += get_ddl_update_table_info_for_mysql(old_table, new_table, table_remarks)

    if (sql.length > 0 || table_charset) {
      sql = "ALTER TABLE " + old_table + " " + (table_charset ? 'CHARACTER SET = ' + table_charset + ",\n" : "") + sql
      if (sql.endsWith(",\n")) {
        sql = sql.substring(0, sql.lastIndexOf(",\n")) + ";"
      } else if (sql.endsWith(",")) {
        sql = sql.substring(0, sql.lastIndexOf(",")) + ";"
      }
    }
  }
  return sql

}


function get_ddl_update_row_for_mysql(table, new_row) {

  let update_sql;

  if (new_row.online_column_name === new_row.column_name) {
    update_sql = "MODIFY COLUMN " + "`" + new_row.online_column_name + "` ";

  } else {
    update_sql = "CHANGE COLUMN " + "`" + new_row.online_column_name + "`" + " " + "`" + new_row.column_name + "`" + " ";

  }

  return get_table_column_info(table, new_row, update_sql)

}

function get_ddl_delete_row_for_mysql(table, row) {
  let delete_sql = "DROP COLUMN `" + row.online_column_name + "`,"
  return delete_sql;
}

function get_table_column_info(table, new_row, sql) {
  sql += new_row.type_name ? new_row.type_name : ""

  sql += (new_row.is_unsigned ? " UNSIGNED" : "")


  sql += new_row.is_nullable ? " NULL" : " NOT NULL"

  sql += new_row.is_autoincrement ? " AUTO_INCREMENT" : ""

  sql += (((new_row.column_def && new_row.column_def.length > 0) || new_row.column_def === '') ? new_row.type_name.toUpperCase().indexOf('DATETIME') !== -1 && new_row.column_def.toUpperCase().indexOf('CURRENT_TIMESTAMP') !== -1 ? " DEFAULT " + new_row.column_def : " DEFAULT '" + new_row.column_def + "'" : "")

  sql += new_row.remarks && new_row.remarks !== "" ? " COMMENT '" + new_row.remarks + "'" : ""

  sql += new_row.after ? " AFTER `" + new_row.after + "`" : ""

  sql += new_row.before ? " BEFORE `" + new_row.before + "`" : ""

  return sql + ",";
}

function get_ddl_add_row_for_mysql(table, new_row) {

  let add_sql = "ADD COLUMN " + "`" + new_row.column_name + "` "

  return get_table_column_info(table, new_row, add_sql)

}


function get_ddl_update_primary_key_for_mysql(old_rows, new_rows) {

  new_rows = new_rows.filter(r => !r.options_type || r.options_type.value !== data_options_type_enums.DELETE.value)

  //主键字段
  let primary_key_string = ""
  new_rows.map(r => {
    if (r.is_primary_key) {
      primary_key_string += "`" + r.column_name + "`" + ","
    }
  })

  let old_primary_key_string = ""
  old_rows.map(r => {
    if (r.is_primary_key) {
      old_primary_key_string += "`" + r.column_name + "`" + ","
    }
  })

  if (primary_key_string !== old_primary_key_string && new_rows.length > 0) {
    let update_sql = "";
    update_sql += "DROP PRIMARY KEY,"
    if (primary_key_string.lastIndexOf(",")) {
      primary_key_string = primary_key_string.substring(0, primary_key_string.lastIndexOf(","))
    }

    if (primary_key_string.length > 0) {
      update_sql += " ADD PRIMARY KEY ("
      update_sql += primary_key_string
      update_sql += "),"

    }
    return update_sql;
  }
  return ""
}

function get_ddl_update_table_info_for_mysql(old_table, new_table_name, new_table_remarks) {
  let sql = ""
  if (new_table_remarks) {
    sql += "COMMENT ='" + new_table_remarks + "',"
  }

  if (new_table_name && new_table_name !== old_table) {
    sql += "RENAME TO `" + new_table_name + "`"
  }

  return sql
}

function get_ddl_update_index_for_mysql(new_rows) {
  let sql = ""
  let filter_add_rows = new_rows.filter(r => r.options_type && r.index_name && r.options_type.value === data_options_type_enums.ADD.value && r.index_type !== 'PRIMARY')
  for (let i = 0; i < filter_add_rows.length; i++) {
    if (filter_add_rows[i].index_type === 'UNIQUE') {
      sql += "ADD UNIQUE KEY `" + filter_add_rows[i].index_name + "` (" + get_index_columns(filter_add_rows[i].index_columns) + "),\n"
    } else {
      sql += "ADD KEY `" + filter_add_rows[i].index_name + "` (" + get_index_columns(filter_add_rows[i].index_columns) + "),\n"
    }
  }

  let filter_update_rows = new_rows.filter(r => r.options_type && r.index_name && r.options_type.value === data_options_type_enums.UPDATE.value && r.index_type !== 'PRIMARY')
  for (let i = 0; i < filter_update_rows.length; i++) {
    if (filter_update_rows[i].index_type === 'UNIQUE') {
      sql += "ADD UNIQUE KEY `" + filter_update_rows[i].index_name + "` (" + get_index_columns(filter_update_rows[i].index_columns) + "),\n"
    } else {
      sql += "ADD KEY `" + filter_update_rows[i].index_name + "` (" + get_index_columns(filter_update_rows[i].index_columns) + "),\n"
    }
  }

  for (let i = 0; i < filter_update_rows.length; i++) {
    sql += "DROP KEY `" + filter_update_rows[i].online_index_name + "`,\n"
  }

  let filter_delete_rows = new_rows.filter(r => r.options_type && r.index_name && r.options_type.value === data_options_type_enums.DELETE.value && r.index_type !== 'PRIMARY')
  for (let i = 0; i < filter_delete_rows.length; i++) {
    sql += "DROP KEY `" + filter_delete_rows[i].index_name + "`,\n"
  }

  return sql
}


function get_index_columns(columns) {
  let sql = ""
  for (let i = 0; i < columns.length; i++) {
    if (i == columns.length - 1) {
      sql += "`" + columns[i] + "`"
    } else {
      sql += "`" + columns[i] + "`,"
    }
  }
  return sql
}
