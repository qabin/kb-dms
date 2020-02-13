export default {
  data: () => ({
    rows: [],
    rowsNumber: 0,
    table_columns: [],
    table_row_key: 'id',
    table_class: '',
    noDataLabel: '无数据',
    dense: true
  }),
  methods: {
    render_top_scope_slot(h, scope) {
    },
    render_bottom_row_scope_slot(h, scope) {
    },
    render_scope_slot(h, scope) {
    },
    table_props() {
    },
    request({pagination, filter, getCellValue, data}) {
    },
    refresh(data) {
      this.__request({data});
    },
    __request(v) {
      this.request(v)
    },
    __render_scope_slot(h) {
      let scope = {};
      this.render_top_scope_slot(h, scope);
      this.__render_body_cel_scope_slot(h, scope);
      this.__render_bottom_row_scope_slot(h, scope);
      this.render_scope_slot(h, scope);
      return scope;
    },
    __render_bottom_row_scope_slot(h, scope) {
      if (!this.rowsNumber)
        scope['bottom-row'] = (props) => h('div', {
          staticClass: 'text-light font-13 q-pa-sm',
          style: {height: '50px'}
        }, this.noDataLabel);
      else
        this.render_bottom_row_scope_slot(h, scope)
    },
    __render_body_cel_scope_slot(h, scope) {
      this.table_columns.forEach(column => {
        scope['body-cell-' + column.name] = props => h('q-td', {...column.renderData, props: props}, [
          column.render
            ? (
              Array.isArray(column.render)
                ? column.render.map(r => r.call(this, h, props))
                : column.render.call(this, h, props)
            )
            : props.value || '--'
        ])
      });
    },
    render_table(h) {
      return h('q-table', {
        staticClass: 'shadow-0 overflow-hidden ' + this.table_class,
        props: {
          ...this.table_props(),
          dense: this.dense,
          color: 'primary',
          data: this.rows,
          columns: this.table_columns,
          rowKey: this.table_row_key,
          rowsPerPageLabel: this.rowsPerPageLabel,
          noDataLabel: this.noDataLabel,
          hideBottom: true,
        },
        scopedSlots: this.__render_scope_slot(h),
        on: {request: this.__request}
      })
    },
  },
  activated() {
    this.refresh();
  },
  deactivated() {
  },
  render(h) {
    return this.render_table(h)
  }
}
