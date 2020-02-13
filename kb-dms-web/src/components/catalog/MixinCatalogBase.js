export default {
  data: () => ({
    rows: [],
    table_columns: [],
    table_row_key: 'id',
    pagination_ctl: {
      sortBy: null,
      descending: false,
      page: 1,
      rowsNumber: 0,
      rowsPerPage: 10
    },
    table_class: '',
    rowsPerPageLabel: '每页数据',
    noDataLabel: '无数据',
    activate_refresh: true,
    dense: false,
    hideBottom: false
  }),
  computed: {
    rowsNumber: {
      get() {
        return this.pagination_ctl.rowsNumber
      },
      set(v) {
        this.pagination_ctl.rowsNumber = v
      }
    },
    rowsPerPage() {
      return this.pagination_ctl.rowsPerPage;
    },
    page() {
      return this.pagination_ctl.page - 1
    },
    size() {
      return this.pagination_ctl.rowsPerPage
    }
  },
  methods: {
    render_top_scope_slot(h, scope) {
      // scope['top'] = (props) => h('div', null, 'top')
    },
    render_bottom_row_scope_slot(h, scope) {
    },
    render_scope_slot(h, scope) {
    },
    table_props() {
    },
    store_pagination() {
    },
    request({pagination, filter, getCellValue, data}) {
    },
    refresh(data,page) {
      this.__request({
        pagination: {
          page: page ? page : 1,
          rowsNumber: 0,
          rowsPerPage: this.pagination_ctl.rowsPerPage,
          sortBy: this.pagination_ctl.sortBy,
          descending: this.pagination_ctl.descending
        },
        data
      });
    },
    __request(v) {
      this.pagination_ctl.page = v.pagination.page;
      this.pagination_ctl.rowsPerPage = v.pagination.rowsPerPage;
      this.pagination_ctl.sortBy = v.pagination.sortBy
      this.pagination_ctl.descending = v.pagination.descending

      this.request(v)
      this.store_pagination()  // store pagination info
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
        scope['body-cell-' + column.name] = props => h('q-td', {...column.renderData, props: {props}}, [
          column.render
            ? (
              Array.isArray(column.render)
                ? column.render.map(r => r.call(this, h, props))
                : column.render.call(this, h, props)
            )
            : props.value || '--'
        ])
      });
    }
  },
  activated() {
    this.activate_refresh && this.request({});
  },
  deactivated() {
  },
  render(h) {
    return h('q-table', {
      staticClass: 'shadow-0 ' + this.table_class,
      props: {
        ...this.table_props(),
        dense: this.dense,
        color: 'primary',
        data: this.rows,
        columns: this.table_columns,
        rowKey: this.table_row_key,
        pagination: this.pagination_ctl,
        rowsPerPageOptions: [10, 20, 50],
        rowsPerPageLabel: this.rowsPerPageLabel,
        noDataLabel: this.noDataLabel,
        hideBottom: !this.rowsNumber || this.hideBottom,
      },
      scopedSlots: this.__render_scope_slot(h),
      on: {request: this.__request}
    })
  }
}
