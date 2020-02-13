import {data_options_type_enums} from "../../utils/sql_editor_dictionary";

export function get_ddl_sql_builder(type, old_rows, new_rows, table) {
  let sql = "";
  if (type === 1) {
    for (let i = 0; i < new_rows.length; i++) {
      if (typeof new_rows[i].options_type !== 'undefined') {
        if (new_rows[i].options_type === data_options_type_enums.UPDATE) {
          sql += get_ddl_update_row_for_mysql(table, old_rows[i], new_rows[i], old_rows, new_rows) + '\n'
        } else if (new_rows[i].options_type === data_options_type_enums.DELETE) {
          sql += get_ddl_delete_row_for_mysql(table, old_rows[i]) + '\n'
        } else if (new_rows[i].options_type === data_options_type_enums.ADD) {
          sql += get_ddl_add_row_for_mysql(table,new_rows[i],) + '\n'
        }
      }
    }

  } else if (type === 2) {
    // return get_ddl_update_sql_builder_sqlserver(table, field, value_ov, value_nv, column_ov, column_nv, row, rows)
  }
  return sql

}


function get_ddl_update_row_for_mysql(table, old_row, new_row, old_rows, new_rows) {
  let update_sql = "ALTER TABLE " + table + " CHANGE COLUMN " + "`" + old_row['column_name'] + "`" + " " + "`" + new_row['column_name'] + "`" + " ";

  update_sql += new_row['type_name']

  update_sql += new_row['is_nullable'] ? " NULL" : " NOT NULL"

  update_sql += new_row['is_autoincrement'] ? " AUTO_INCREMENT" : ""

  update_sql += new_row["column_def"] && new_row["column_def"] !== null ? " DEFAULT '" + new_row["column_def"] + "'" : ""

  update_sql += new_row["remarks"] && new_row['remarks'] !== "" ? " COMMENT '" + new_row['remarks'] + "'" : ""

  //主键字段
  let primary_key_string = ""
  new_rows.map(r => {
    if (r['is_primary_key']) {
      primary_key_string += "`" + r['column_name'] + "`" + ","
    }
  })

  let old_primary_key_string = ""
  old_rows.map(r => {
    if (r['is_primary_key']) {
      old_primary_key_string += "`" + r['column_name'] + "`" + ","
    }
  })

  if (primary_key_string !== old_primary_key_string) {
    update_sql += ", DROP PRIMARY KEY,"
    if (primary_key_string.lastIndexOf(",")) {
      primary_key_string = primary_key_string.substring(0, primary_key_string.lastIndexOf(","))
    }

    if (primary_key_string.length > 0) {
      update_sql += " ADD PRIMARY KEY ("
      update_sql += primary_key_string
      update_sql += ")"

    }
  }

  return update_sql + ";";
}

function get_ddl_delete_row_for_mysql(table, old_row) {
  let delete_sql = "ALTER TABLE " + table + " DROP COLUMN `" + old_row['column_name'] + "`"
  return delete_sql + ";"
}


function get_ddl_add_row_for_mysql(table, new_row) {

  let add_sql = "ALTER TABLE " + table + " ADD " + "`" + new_row['column_name'] + "` ";

  add_sql += new_row['type_name']

  add_sql += new_row['is_nullable'] ? " NULL" : " NOT NULL"

  add_sql += new_row['is_autoincrement'] ? " AUTO_INCREMENT" : ""

  add_sql += new_row["column_def"] && new_row["column_def"] !== null ? " DEFAULT '" + new_row["column_def"] + "'" : ""

  add_sql += new_row["remarks"] && new_row['remarks'] !== "" ? " COMMENT '" + new_row['remarks'] + "'" : ""

  add_sql += new_row["is_primary_key"] ? " PRIMARY KEY " : ""
  return add_sql + ";"
}


// function get_ddl_update_sql_builder_sqlserver(table, field, value_ov, value_nv, column_ov, column_nv, row) {
//   let update_sql = ""
//
//   if (column_nv !== column_ov) {
//     update_sql = "EXEC SP_RENAME '" + table + ".[" + column_ov + "]', '" + column_nv + "' , 'COLUMN'"
//   } else if (field === 'is_primary_key') {
//     if (value_nv !== value_ov && value_nv) {
//       update_sql += "ALTER TABLE " + table + " ADD CONSTRAINT " + column_ov + " PRIMARY KEY(" + column_ov + ")" + ";"
//     } else if (value_nv !== value_ov && !value_nv) {
//       update_sql = "IF NOT EXISTS (\n" +
//         "     SELECT DISTINCT CONSTRAINT_NAME NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE\n" +
//         "WHERE TABLE_NAME='" + table + "' AND COLUMN_NAME= '" + column_nv + "'\n" +
//         "   )\n" +
//         "BEGIN\n" +
//         "  PRINT 'DO NOTHING'\n" +
//         "END\n" +
//         "ELSE\n" +
//         "BEGIN\n" +
//         "\n" +
//         "DECLARE @CONSTRAINT_NAME NVARCHAR(1000)\n" +
//         "DECLARE @SQL NVARCHAR(1000)\n" +
//         "SELECT @CONSTRAINT_NAME=(SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME='" + table + "' AND COLUMN_NAME= '" + column_nv + "')\n" +
//         "SET @SQL='ALTER TABLE " + table + " DROP CONSTRAINT '+ @CONSTRAINT_NAME\n" +
//         "EXEC(@SQL)\n" +
//         "END;"
//       //update_sql += "ALTER TABLE " + table + " DROP COLUMN " + column_ov + ";"
//       //update_sql += "ALTER TABLE " + table + " ADD CONSTRAINT " + column_ov + " PRIMARY KEY(" + column_ov + ")" + ";"
//     }
//
//   } else if (field === 'column_def') {
//     if (value_ov !== value_nv && value_nv !== null && value_nv !== '') {
//       update_sql = "IF NOT EXISTS (\n" +
//         "      SELECT DISTINCT C.NAME FROM SYSCONSTRAINTS A\n" +
//         "\tINNER JOIN SYSCOLUMNS B ON A.COLID=B.COLID\n" +
//         " INNER JOIN SYSOBJECTS C ON A.CONSTID=C.ID\n" +
//         "WHERE A.ID=OBJECT_ID('" + table + "')\n" +
//         "AND C.ID= B.CDEFAULT AND B.NAME='" + column_nv + "'\n" +
//         "   )\n" +
//         "BEGIN\n" +
//         "    ALTER TABLE TEST_ADD_SQLSERVER \n" +
//         "    ADD DEFAULT('" + value_nv + "') FOR " + column_nv + " \n" +
//         "    WITH VALUES\n" +
//         "END\n" +
//         "ELSE\n" +
//         "BEGIN\n" +
//         "DECLARE @CONSTRAINT_NAME NVARCHAR(1000)\n" +
//         "DECLARE @SQL NVARCHAR(1000)\n" +
//         "SELECT @CONSTRAINT_NAME=  (\n" +
//         " SELECT DISTINCT C.NAME NAME FROM SYSCONSTRAINTS A\n" +
//         "\tINNER JOIN SYSCOLUMNS B ON A.COLID=B.COLID\n" +
//         " INNER JOIN SYSOBJECTS C ON A.CONSTID=C.ID\n" +
//         "WHERE A.ID=OBJECT_ID('" + table + "')\n" +
//         "AND C.ID= B.CDEFAULT AND B.NAME='" + column_nv + "'\n" +
//         ") \n" +
//         "SET @SQL='ALTER TABLE " + table + " DROP CONSTRAINT '+ @CONSTRAINT_NAME\n" +
//         "EXEC(@SQL)\n" +
//         "ALTER TABLE " + table + " ADD DEFAULT ('" + value_nv + "') FOR " + column_nv + " WITH VALUES\n" +
//         "END"
//     } else if (value_ov !== value_nv) {
//       update_sql = "IF NOT EXISTS (\n" +
//         "      SELECT DISTINCT C.NAME FROM SYSCONSTRAINTS A\n" +
//         "\tINNER JOIN SYSCOLUMNS B ON A.COLID=B.COLID\n" +
//         " INNER JOIN SYSOBJECTS C ON A.CONSTID=C.ID\n" +
//         "WHERE A.ID=OBJECT_ID('" + table + "')\n" +
//         "AND C.ID= B.CDEFAULT AND B.NAME='" + column_nv + "'\n" +
//         "   )\n" +
//         "BEGIN\n" +
//         "    ALTER TABLE TEST_ADD_SQLSERVER \n" +
//         "    ADD DEFAULT('" + value_nv + "') FOR " + column_nv + " \n" +
//         "    WITH VALUES\n" +
//         "END\n" +
//         "ELSE\n" +
//         "BEGIN\n" +
//         "DECLARE @CONSTRAINT_NAME NVARCHAR(1000)\n" +
//         "DECLARE @SQL NVARCHAR(1000)\n" +
//         "SELECT @CONSTRAINT_NAME=  (\n" +
//         " SELECT DISTINCT C.NAME NAME FROM SYSCONSTRAINTS A\n" +
//         "\tINNER JOIN SYSCOLUMNS B ON A.COLID=B.COLID\n" +
//         " INNER JOIN SYSOBJECTS C ON A.CONSTID=C.ID\n" +
//         "WHERE A.ID=OBJECT_ID('" + table + "')\n" +
//         "AND B.NAME='" + column_nv + "'\n" +
//         ") \n" +
//         "SET @SQL='ALTER TABLE " + table + " DROP CONSTRAINT '+ @CONSTRAINT_NAME\n" +
//         "EXEC(@SQL)\n" +
//         "END"
//     }
//
//   } else if (field === 'remarks') {
//     update_sql = "EXEC sp_updateextendedproperty 'MS_Description', '" + value_nv + "', 'SCHEMA', dbo, 'table', " + table + ", 'column', " + column_nv + ""
//   } else  if(field==='is_auto_increment'){
//
//   } else {
//     update_sql = "ALTER TABLE " + table + " ALTER COLUMN[" + column_ov + "] ";
//
//     if (field === 'type_name') {
//       update_sql += " " + value_nv + " "
//     } else {
//       update_sql += row['type_name'] + (row['column_size'] > 0 && row['type_name'].indexOf("(") === -1 ? ("(" + row['column_size'] + (row['decimal_digits'] > 0 ? "," + row['decimal_digits'] : "") + ")") : "")
//     }
//
//     update_sql += row['is_nullable'] ? " NULL" : " NOT NULL"
//
//   }
//
//   return update_sql;
// }
