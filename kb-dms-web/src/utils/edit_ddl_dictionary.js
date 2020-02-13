export const DDLTypeEnum = {
  1: {
    label: '建表',
    value: 1,
    icon: 'mdi-table-plus',
    color: 'secondary'
  },
  2: {
    label: '改表',
    value: 2,
    icon: 'mdi-table-edit',
    color: 'info'
  },
}

export const DDLType = {
  CreateTable: 1,
  AlterTable: 2
}

export const DDLStatus = {
  Abandon: 0,
  Editing: 1,
  Reviewing: 2,
  ReviewFailed: 3,
  ReviewPassed: 4,
  Auditing: 5,
  AuditFailed: 6,
  ToExecute: 7,
  Executing: 8,
  ExecuteFailed: 9,
  ExecuteSuccess: 10
}

export const DDLStatusEnum = {
  0: {
    label: '已废弃',
    value: 0,
    color: 'grey'
  },
  1: {
    label: '编辑中',
    value: 1,
    color: 'primary',
  },
  2: {
    actions: ['发起评审'],
    label: '评审中',
    value: 2,
    color: 'warning',
  },
  3: {
    label: '评审失败',
    value: 3,
    color: 'negative',
  },
  4: {
    actions: ['撤销'],
    label: '评审通过',
    value: 4,
    color: 'positive',
  },
  5: {
    label: '审批中',
    value: 5,
    color: 'warning',
  },
  6: {
    label: '审批失败',
    value: 6,
    color: 'negative',
  },
  7: {
    label: '待执行',
    value: 7,
    color: 'positive',
  },
  8: {
    action: ['执行'],
    label: '执行中',
    value: 8,
    color: 'warning',
  },
  9: {
    label: '执行失败',
    value: 9,
    color: 'negative',
  },
  10: {
    actions: [{label: '发布测试', disable: false, comments: '测试环境已发布'},
      {label: '发布UAT', disable: true, comments: '依赖测试环境发布'},
      {label: '发布生产', disable: true, comments: '依赖测试环境发布'}
    ],
    label: "上线成功",
    value: 10,
    color: 'positive'
  }
}

export const DDLNextStatusOptions = {
  0: [],
  1: [DDLStatusEnum[2]],
  2: [],
  3: [DDLStatusEnum[2]],
  4: [DDLStatusEnum[10]],   // 评审通过可发布测试或线上
  5: [DDLStatusEnum[4]],
  6: [DDLStatusEnum[2]],
  7: [DDLStatusEnum[4]],
  8: [],
  9: [],
  10: [DDLStatusEnum[10]]
}

export const DDLQueryEnum = {
  my_to_do_ddl: {
    label: '我的待办',
    key: 'my_to_do_ddl',
    color: 'orange'
  },
  created_by_me: {
    label: '我创建的',
    key: 'created_by_me',
    color: 'secondary'
  },
  my_finished_ddl: {
    label: '已完成',
    key: 'my_finished_ddl',
    color: 'green',
  },

  related_to_me: {
    label: '全部',
    key: 'related_to_me',
    color: 'primary',
  },
}

export const DDLQueryOptions = Object.keys(DDLQueryEnum).map(key => ({label: DDLQueryEnum[key].label, value: key}))

export const DeployEnv = {
  TEST: {label: '测试', value: 1},
  PRD: {label: '生产', value: 2},
  UAT: {label: 'UAT', value: 3},
}

export const DeployEnvEnum = {
  1: {label: '测试', value: 1, icon: 'mdi-alpha-t-box', color: 'secondary'},
  2: {label: '生产', value: 2, icon: 'mdi-alpha-p-box', color: 'primary'},
  3: {label: 'UAT', value: 3, icon: 'mdi-alpha-u-box', color: 'info'},
}

export const DeployStatusEnum = {
  0: {label: "未开始", color: "grey", positive: true, endpoint: true, uat: true, phase: 1},         // endpoint指阶段终点，如审批阶段终点为通过或者失败
  1: {label: "待审批", color: "warning", positive: true, endpoint: false, uat: false, phase: 2},
  2: {label: "审批失败", color: "negative", positive: false, endpoint: true, uat: false, phase: 2},
  3: {label: "待执行", color: "secondary", positive: true, endpoint: false, uat: true, phase: 3},
  4: {label: "执行中", color: "info", positive: true, endpoint: false, uat: true, phase: 3},
  5: {label: "执行成功", color: "positive", positive: true, endpoint: true, uat: true, phase: 3},
  6: {label: "执行失败", color: "negative", positive: false, endpoint: true, uat: true, phase: 3}
}

export const DeployStatus = {
  NOT_START: 0,
  TO_AUDIT: 1,
  AUDIT_FAILED: 2,
  TO_EXE: 3,
  EXECUTING: 4,
  EXE_SUCCESS: 5,
  EXE_FAILED: 6
}

export const DDLHistoryOaStatusEnum = {
  0: {
    label: '创建失败',
    color: 'negative',
    value: 0
  },
  1: {
    label: '待审批',
    color: 'warning',
    value: 1,
  },
  2: {
    label: '审批失败',
    color: 'negative',
    value: 2
  },
  3: {
    label: '审批成功',
    color: 'positive',
    value: 3
  },
  4: {
    label: '已撤销',
    color: 'grey',
    value: 4
  }
}

export const DDLHistoryDeployStatusEnum = {
  1: {
    label: '待执行',
    color: 'warning',
    value: 1,
  },
  2: {
    label: '执行中',
    color: 'info',
    value: 2
  },
  3: {
    label: '执行成功',
    color: 'positive',
    value: 3
  },
  4: {
    label: '执行失败',
    color: 'negative',
    value: 4
  },
}

export const DDLHistoryReviewStatusEnum = {
  0: {
    label: '成功',
    color: 'positive',
    value: 0,
  },
  '-1': {
    label: '失败',
    color: 'negative',
    value: -1
  },
  '-2': {
    label: '异常',
    color: 'negative',
    value: -2
  },
}

export const index_type_options_enum = {
  PRIMARY: {
    label: 'PRIMARY',
    value: 'PRIMARY',
    color: 'primary',
    icon: 'mdi-alpha-p-box',
  },
  UNIQUE: {
    label: 'UNIQUE',
    value: 'UNIQUE',
    color: 'secondary',
    icon: 'mdi-alpha-u-box',
  },
  INDEX: {
    label: 'INDEX',
    value: 'INDEX',
    color: 'info',
    icon: 'mdi-alpha-i-box',
  },
}

export const index_type_options = Object.keys(index_type_options_enum).map(key => (
  {
    label: index_type_options_enum[key].label,
    value: index_type_options_enum[key].value
  }
))


// DDL历史记录枚举
export const DDLHistoryEnum = {
  VERSION: 0,
  REVIEW: 1,
  OA: 2,
  DEPLOY: 3
}
