export default {
  data: () => ({
    opened: false,
    loading: false,
    minWidth: '500px',
    maxWidth: '500px',
    noBackdropDismiss: true
  }),
  methods: {
    /* abstract methods start */
    title(h) {
      return 'title'
    },
    init(model, ...models) {
    },
    submit({done, close}) {
    },
    cancel() {
    },
    hide() {

    },
    render_contents(h) {
      return []
    },
    render_foot_left(h) {

    },
    /* abstract methods end */
    show(model, ...models) {
      this.opened = true;
      this.__init(model, ...models);
    },
    __hide() {
      this.loading = false;
      this.hide()
    },
    __init(model, ...models) {
      this.loading = false;
      this.init(model, ...models);
      this.$v && this.$v.model && this.$v.model.$reset();
    },
    __submit() {
      let done = () => this.loading = false;
      let close = () => this.opened = false;

      if(this.$v != undefined) {
        this.$v && this.$v.model && this.$v.model.$touch();
        if (!this.$v.model.$error) {
          this.loading = true;
          this.submit({done, close})
        } else {
          this.$q.warning('请输入所有必填字段')
        }
      }else {
        this.submit({done, close})
      }
    },
    __render_close_icon(h) {
      return h('q-icon', {
        staticClass: 'absolute-top-right bg-white text-faded cursor-pointer pp-selectable-color-red',
        style: {
          borderRadius: '50%',
          transform: 'translate(40%, -40%)',
          zIndex: '1',
          fontSize: '20px'
        },
        nativeOn: {
          click: this.cancel
        },
        props: {name: 'cancel'},
        directives: [{name: 'close-overlay'}]
      })
    },
    __render_modal_layout(h) {
      return [
        this.__render_title(h),
        h('div', {staticClass: 'full-width bg-grey-4', style: {height: '1px', flexShrink: 0}}),
        this.__render_contents(h),
        this.__render_footer(h)
      ]
    },
    __render_contents(h) {
      return h('div', {
        staticClass: 'col-grow',
        style: {
          padding: '16px 28px',
          margin: '0 4px',
          overflow: 'auto'
        }
      }, [
        this.render_contents(h),
      ])
    },
    __render_title(h) {
      return h('div', {
        staticClass: 'font-14 text-weight-bold',
        style: {padding: '13px 15px'}
      }, [
        this.title(h)
      ])
    },
    __render_footer(h) {
      return h('div', {
        staticClass: 'row items-center justify-end',
        style: {height: '48px', minHeight: '48px', borderTop: '1px solid var(--q-color-grey-4)'}
      }, [
        this.render_foot_left(h),
        h('div', {staticClass: 'col-grow'}),
        h('q-btn', {
          staticClass: 'q-pt-none q-pb-none q-mr-md shadow-0',
          style: {minHeight: '32px', height: '32px', fontSize: '12px', width: '75px'},
          props: {label: '确定', size: 'md', color: 'blue-6', loading: this.loading},
          on: {
            click: this.__submit
          }
        }),
        h('q-btn', {
          staticClass: 'q-pt-none q-pb-none q-mr-md shadow-0',
          style: {minHeight: '32px', height: '32px', fontSize: '12px', width: '75px'},
          props: {label: '取消', flat: true, size: 'md', color: 'faded'},
          on: {
            click: this.cancel
          },
          directives: [{name: 'close-overlay'}]
        })
      ])
    }
  },

  render(h) {
    return h('q-modal', {
      props: {
        contentCss: {
          minWidth: this.minWidth,
          maxWidth: this.maxWidth,
          minHeight: '200px',
          maxHeight: '90vh',
          border: '1px solid var(--q-color-faded)'
        },
        contentClasses: 'column no-wrap',
        value: this.opened,
        noBackdropDismiss: this.noBackdropDismiss
      },
      on: {
        input: (v) => this.opened = v,
        hide: this.__hide
      }
    }, [
      this.__render_close_icon(h),
      this.__render_modal_layout(h)
    ])
  }
}
