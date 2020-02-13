export const base_status_enum = {
  1: {
    label: "激活",
  },
  "-1": {
    label: "失效",
  },
};


export const datasource_type_enum = {
  1: {
    label: "Mysql",
    color: 'primary',
    icon:'mdi-alpha-m-box',
  },
  2: {
    label: "SqlServer",
    color: 'info',
    icon:'mdi-alpha-s-box',
  },
};

export const datasource_type_options = [
  {
    label: 'Mysql',
    value: 1,
  },
  {
    label: 'SqlServer',
    value: 2
  }
]
