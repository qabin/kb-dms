export const sql_exe_result_status_enum = {
  1: {
    label: "执行中",
    color: 'warning',
    icon: 'run'
  },
  "-1": {
    label: "执行失败",
    color: 'negative',
    icon: 'cancel'
  },
  2: {
    label: '执行成功',
    color: 'primary',
    icon: 'check'
  }
};


export const sql_option_type_enum = {
  1: {
    label: "查询",
    color: 'primary',
    icon: 'run'
  },
  2: {
    label: "更新",
    color: 'secondary',
    icon: 'cancel'
  },
  3: {
    label: '表结构',
    color: 'positive',
    icon: 'check'
  },
  4: {
    label: '其他',
    color: 'info',
    icon: 'check'
  }
};

export const sql_syntax_check_error_enum = {
  1: {
    label: "缺少行数限制",
    color: 'orange-7',
    icon: 'run'
  },
  2: {
    label: "缺少查询条件",
    color: 'negative',
    icon: 'cancel'
  },
  3: {
    label: '越权操作',
    color: 'negative',
    icon: 'check'
  }
};

export const sql_exe_result_query_by_enum = {
  all: {
    label: '所有记录',
    key: 'all',
    color: 'primary',
  },
  executed_by_me: {
    label: '我执行的',
    key: 'executed_by_me',
    color: 'secondary'
  },
};

export const sql_exe_result_query_by_options = [
  {
    label: '所有记录',
    value: 'all',
  },
  {
    label: '我执行的',
    value: 'executed_by_me',
  },
]

export const sql_exe_result_query_type_enum = {
  all: {
    label: '所有操作',
    key: 'all',
    color: 'primary'
  },
  dql_type: {
    label: '查询操作',
    key: 'dql_type',
    color: 'primary'
  },
  dml_type: {
    label: '更新操作',
    key: 'dml_type',
    color: 'secondary'
  },
  ddl_type: {
    label: '表结构操作',
    key: 'ddl_type',
    color: 'positive'
  },
  exe_failed: {
    label: '执行失败',
    key: 'exe_failed',
    color: 'negative',
  },
  no_permission: {
    label: '越权操作',
    key: 'no_permission',
    color: 'negative',
  },
  syntax_error: {
    label: '误操作',
    key: 'syntax_error',
    color: 'negative'
  },
};
