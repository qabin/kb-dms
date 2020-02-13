import {data_options_type_enums, data_type_name_number_options} from "../../utils/sql_editor_dictionary";

function get_dml_update_sql_builder(table, table_fields, old_rows, new_rows) {
  let set_sql = "";

  for (let key of Object.keys(old_rows)) {
    if (old_rows[key] !== new_rows[key]) {
      set_sql += key + ' = \'' + new_rows[key] + '\','
    }
  }
  if (set_sql !== '' && set_sql.length > 0) {
    set_sql = set_sql.substring(0, set_sql.length - 1)
  }

  let update_sql = "UPDATE " + table + " SET " + set_sql + ' WHERE ';
  let first_where = true
  let has_primary_key = false
  if (table_fields) {
    table_fields.map(d => {
      if (d.is_primary_key) {
        has_primary_key = true
        update_sql += d.column_name + ' = ' + old_rows[d.column_name]
      }
    })
  }
  if (!has_primary_key) {
    for (let i = 0; i < table_fields.length; i++) {

      // if (table_fields[i].column_name === field) {
      //   continue
      // }

      if (data_type_name_number_options.some(d => d.toUpperCase() === table_fields[i].type_name.toUpperCase())) {
        if (first_where) {
          if (typeof old_rows[table_fields[i].column_name] !== 'undefined' && old_rows[table_fields[i].column_name] !== null) {
            update_sql += " " + table_fields[i].column_name + '="' + old_rows[table_fields[i].column_name] + '"';
            first_where = false
          }
        } else {
          if (typeof old_rows[table_fields[i].column_name] !== 'undefined' && old_rows[table_fields[i].column_name] !== null) {
            update_sql += " and " + table_fields[i].column_name + '="' + old_rows[table_fields[i].column_name] + '"';
          }
        }
      }

    }
  }
  return update_sql + ";"
}

function get_dml_delete_sql_builder(table, table_fields, row) {
  let delete_sql = "DELETE FROM " + table + " WHERE ";
  let first_where = true
  let has_primary_key = false
  if (table_fields) {
    table_fields.map(d => {
      if (d.is_primary_key) {
        has_primary_key = true
        delete_sql += d.column_name + ' = ' + row[d.column_name]
      }
    })
  }
  if (!has_primary_key) {
    for (let i = 0; i < table_fields.length; i++) {
      if (data_type_name_number_options.some(d => d.toUpperCase() === table_fields[i].type_name.toUpperCase())) {
        if (first_where) {
          if (typeof row[table_fields[i].column_name] !== 'undefined' && row[table_fields[i].column_name] !== null) {
            delete_sql += " " + table_fields[i].column_name + '="' + row[table_fields[i].column_name] + '"';
            first_where = false
          }
        } else {
          if (typeof row[table_fields[i].column_name] !== 'undefined' && row[table_fields[i].column_name] !== null) {
            delete_sql += " and " + table_fields[i].column_name + '="' + row[table_fields[i].column_name] + '"';
          }
        }
      }
    }
  }
  return delete_sql + ";"
}


function get_dml_insert_sql_build(new_rows, table_fields, table) {
  let insert_sql = "INSERT INTO " + table + " (";
  let first_field = true;
  for (let i = 0; i < table_fields.length; i++) {
    if (typeof new_rows[table_fields[i].column_name] !== 'undefined' && new_rows[table_fields[i].column_name] != null) {
      if (first_field) {
        insert_sql += "`" + table_fields[i].column_name + "`"
        first_field = false
      } else {
        insert_sql += ",`" + table_fields[i].column_name + "`"
      }
    }
  }
  insert_sql += ") VALUES ("

  first_field = true
  for (let i = 0; i < table_fields.length; i++) {
    if (typeof new_rows[table_fields[i].column_name] !== 'undefined' && new_rows[table_fields[i].column_name] != null) {
      if (first_field) {
        insert_sql += "'" + new_rows[table_fields[i].column_name] + "'"
        first_field = false
      } else {
        insert_sql += ",'" + new_rows[table_fields[i].column_name] + "'"
      }
    }
  }
  insert_sql += ")"

  return insert_sql + ";"
}

export function get_dml_sql_build(old_rows, new_rows, table_fields, table) {
  let sql = "";
  for (let i = 0; i < new_rows.length; i++) {
    if (typeof new_rows[i].options_type !== 'undefined') {
      if (new_rows[i].options_type === data_options_type_enums.UPDATE) {
        sql += get_dml_update_sql_builder(table, table_fields, old_rows[i], new_rows[i]) + '\n'
      } else if (new_rows[i].options_type === data_options_type_enums.DELETE) {
        sql += get_dml_delete_sql_builder(table, table_fields, old_rows[i]) + '\n'
      } else if (new_rows[i].options_type === data_options_type_enums.ADD) {
        sql += get_dml_insert_sql_build(new_rows[i], table_fields, table) + '\n'
      }
    }
  }
  return sql
}
