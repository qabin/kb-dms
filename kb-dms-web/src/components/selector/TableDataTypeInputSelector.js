const mysql_data_type_list = [
  {
    folder_name: '常用数据类型',
    children: [
      {
        label: 'BIGINT(22)',
        value: 'BIGINT(22)'
      },
      {
        label: 'INT(11)',
        value: 'INT(11)'
      },
      {
        label: 'VARCHAR(1024)',
        value: 'VARCHAR(1024)'
      },
      {
        label: 'DATETIME',
        value: 'DATETIME'
      },
      {
        label: 'DECIMAL()',
        value: 'DECIMAL()'
      },
      {
        label: 'TEXT',
        value: 'TEXT'
      },
    ]
  },
  {
    folder_name: '字符类型',
    children: [
      {
        label: 'VARCHAR()',
        value: 'VARCHAR()'
      },
      {
        label: 'TINYTEXT',
        value: 'TINYTEXT'
      },
      {
        label: 'MEDUIMTEXT',
        value: 'MEDUIMTEXT'
      },
      {
        label: 'TEXT',
        value: 'TEXT'
      },
      {
        label: 'LONGTEXT',
        value: 'LONGTEXT'
      },
    ]
  },
  {
    folder_name: '数字类型',
    children: [
      {
        label: 'INT()',
        value: 'INT()'
      },
      {
        label: 'BIGINT()',
        value: 'BIGINT()'
      },
      {
        label: 'TINYINT()',
        value: 'TINYINT()'
      },
      {
        label: 'DECIMAL()',
        value: 'DECIMAL()'
      },
      {
        label: 'SMALLINT()',
        value: 'SMALLINT()'
      },
      {
        label: 'MEDIUMINT()',
        value: 'MEDIUMINT()'
      },
      {
        label: 'FLOAT()',
        value: 'FLOAT()'
      },
      {
        label: 'DOUBLE()',
        value: 'DOUBLE()'
      },
    ]
  },
  {
    folder_name: '日期类型',
    children: [
      {
        label: 'DATETIME',
        value: 'DATETIME'
      },
      {
        label: 'DATE',
        value: 'DATE'
      },
      {
        label: 'TIME',
        value: 'TIME'
      },
      {
        label: 'YEAR',
        value: 'YEAR'
      },
    ]
  },
  {
    folder_name: '二进制类型',
    children: [
      {
        label: 'TITYBLOB',
        value: 'TITYBLOB'
      },
      {
        label: 'BLOB',
        value: 'BLOB'
      },
      {
        label: 'MEDIUMBLOB',
        value: 'MEDIUMBLOB'
      },
      {
        label: 'LONGBLOB',
        value: 'LONGBLOB'
      },
    ]
  },
]


const sqlserver_data_type_list = [
  {
    folder_name: '常用数据类型',
    children: [
      {
        label: 'int',
        value: 'int'
      },
      {
        label: 'nvarchar(1024)',
        value: 'nvarchar(1024)'
      },
      {
        label: 'datetime',
        value: 'datetime'
      },
      {
        label: 'decimal()',
        value: 'decimal()'
      },
      {
        label: 'text',
        value: 'text'
      },
    ]
  },
  {
    folder_name: '字符类型',
    children: [
      {
        label: 'varchar()',
        value: 'varchar()'
      },
      {
        label: 'nvarchar()',
        value: 'nvarchar()'
      },
      {
        label: 'char()',
        value: 'char()'
      },
      {
        label: 'nchar()',
        value: 'nchar()'
      },
      {
        label: 'text',
        value: 'text'
      },
      {
        label: 'ntext',
        value: 'ntext'
      },
    ]
  },
  {
    folder_name: '数字类型',
    children: [
      {
        label: 'int',
        value: 'int'
      },
      {
        label: 'bigint',
        value: 'bigint'
      },
      {
        label: 'tinyint',
        value: 'tinyint'
      },
      {
        label: 'smallint',
        value: 'smallint'
      },
      {
        label: 'decimal()',
        value: 'decimal()'
      },
      {
        label: 'numeric()',
        value: 'numeric()'
      },
      {
        label: 'smallmoney',
        value: 'smallmoney'
      },
      {
        label: 'money',
        value: 'money'
      },
      {
        label: 'float()',
        value: 'float()'
      },
      {
        label: 'real',
        value: 'real'
      },
    ]
  },
  {
    folder_name: '日期类型',
    children: [
      {
        label: 'datetime',
        value: 'datetime'
      },
      {
        label: 'date',
        value: 'date'
      },
      {
        label: 'time',
        value: 'time'
      },
      {
        label: 'smalldatetime',
        value: 'smalldatetime'
      },
      {
        label: 'datetime2',
        value: 'datetime2'
      },
      {
        label: 'datetimeoffset',
        value: 'datetimeoffset'
      },
    ]
  },
  {
    folder_name: '二进制类型',
    children: [
      {
        label: 'bit',
        value: 'bit'
      },
      {
        label: 'binary()',
        value: 'binary()'
      },
      {
        label: 'varbinary()',
        value: 'varbinary()'
      },
      {
        label: 'image',
        value: 'image'
      },
    ]
  },
]

const mysql_filter_data_type_list = [
  {
    folder_name: '搜索结果',
    children: [
      {
        label: 'VARCHAR()',
        value: 'VARCHAR()'
      },
      {
        label: 'TINYTEXT',
        value: 'TINYTEXT'
      },
      {
        label: 'MEDUIMTEXT',
        value: 'MEDUIMTEXT'
      },
      {
        label: 'TEXT',
        value: 'TEXT'
      },
      {
        label: 'LONGTEXT',
        value: 'LONGTEXT'
      },
      {
        label: 'INT()',
        value: 'INT()'
      },
      {
        label: 'BIGINT()',
        value: 'BIGINT()'
      },
      {
        label: 'TINYINT()',
        value: 'TINYINT()'
      },
      {
        label: 'DECIMAL()',
        value: 'DECIMAL()'
      },
      {
        label: 'SMALLINT()',
        value: 'SMALLINT()'
      },
      {
        label: 'MEDIUMINT()',
        value: 'MEDIUMINT()'
      },
      {
        label: 'FLOAT()',
        value: 'FLOAT()'
      },
      {
        label: 'DOUBLE()',
        value: 'DOUBLE()'
      },
      {
        label: 'DATETIME',
        value: 'DATETIME'
      },
      {
        label: 'DATE',
        value: 'DATE'
      },
      {
        label: 'TIME',
        value: 'TIME'
      },
      {
        label: 'YEAR',
        value: 'YEAR'
      },
      {
        label: 'TITYBLOB',
        value: 'TITYBLOB'
      },
      {
        label: 'BLOB',
        value: 'BLOB'
      },
      {
        label: 'MEDIUMBLOB',
        value: 'MEDIUMBLOB'
      },
      {
        label: 'LONGBLOB',
        value: 'LONGBLOB'
      },
    ]
  },
]

import extend from "quasar-framework/src/utils/extend"

export default {
  name: 'table_data_type_input_selector',
  props: {
    datasource_type: {
      require: true,
      type: [Number],
    }
  },
  watch: {
    datasource_type: {
      immediate: true,
      handler: function (nv, ov) {
        if (nv) {
          if (nv === 1) {
            this.rows = mysql_data_type_list
          } else if (nv === 2) {
            this.rows = sqlserver_data_type_list
          }
        }
      }
    },
    kw: {
      immediate: true,
      handler: function (nv, ov) {
        if (nv) {
          let filter_list = extend(true, [], mysql_filter_data_type_list)
          filter_list[0].children = filter_list[0].children.filter(f => f.label.toUpperCase().indexOf(nv.toUpperCase()) !== -1)
          this.rows = filter_list;
        } else {
          if (this.datasource_type === 1) {
            this.rows = mysql_data_type_list
          } else if (this.datasource_type === 2) {
            this.rows = sqlserver_data_type_list
          }
        }
      }
    }
  },
  data: () => ({
    rows: [],
    kw: null
  }),
  methods: {
    render_data_type_item(h, c) {
      return h('div', {
        staticClass: 'flex font-13 items-center no-wrap ellipsis text-tertiary q-mr-xs cursor-pointer pp-selected-bg-grey-2-hover',
        style: {
          padding: '5px'
        },
        on: {
          click: () => {
            this.$emit('select', c.value)
          }
        }
      }, [
        c.label
      ])
    },
    render_folder_item(h, f) {
      return h('div', {
          staticClass: 'col-grow  scroll'
        },
        [
          h('div', {
            staticClass: 'row font-14 items-center bg-grey-3 text-left ellipsis text-tertiary text-weight-medium',
            style: {
              padding: '5px'
            }
          }, [f.folder_name]),
          f.children.map(c => [this.render_data_type_item(h, c)])
        ])
    },

    render_search(h) {
      return h('q-input', {
        staticClass: 'shadow-0',
        props: {
          value: this.kw,
          placeholder: '按关键字搜索',
          hideUnderline: true,
          color: 'primary',
          before: [{icon: 'search'}],
        },
        on: {input: (v) => this.kw = v}
      })
    },
    render_folder_catalog(h) {
      return h('div', {
        staticClass: 'col-grow  scroll',
        style: {
          minWidth: '150px'
        }
      }, [
        this.render_search(h),
        this.rows.map(f => [this.render_folder_item(h, f)])
      ])
    },

  },
  render(h) {
    return this.render_folder_catalog(h)
  }
}
