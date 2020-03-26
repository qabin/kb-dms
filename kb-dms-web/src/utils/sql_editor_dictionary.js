export const sql_editor_select_100 = {
  1: {
    command: "select * from {0} limit 100;",
  },
  2: {
    command: "select top 100 * from {0};",
  },
};

export const data_type_name_date_options = [
  "datetime",
  "date",
  "timestamp",
  "time",
  "year"
]

export const data_type_name_number_options = [
  "bit",
  "int",
  "tinyint",
  "bool",
  "mediumint",
  "bigint",
  "long",
]


export const data_type_name_boolean_options = [
  "boolean",
]

export const sql_tab_typ_enums = {
  1: {
    label: '查询窗口'
  },
  2: {
    label: "查看表数据"
  },
  3: {
    label: '更新表结构'
  }
}


export const data_options_type_enums = {
  UPDATE: {
    value: 1
  },
  DELETE: {
    value: 2,
  },
  ADD: {
    value: 3
  }
}
