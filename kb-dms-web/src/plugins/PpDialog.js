import {QModal} from 'quasar-framework/dist/quasar.mat.esm'


export default ({Vue}) => {

  const baseDialog = (renderFunc,
                      modal_props = {noBackdropDismiss: true, noEscDismiss: true}) => {
    const node = document.createElement('div');
    document.body.appendChild(node);

    new Vue({
      el: node,
      methods: {
        close() {
          this.$refs.modal.hide();
          setTimeout(() => this.$destroy(), 1000)
        }
      },
      render(h) {
        return h(QModal, {
          ref: 'modal',
          props: {
            contentCss: {minWidth: '300px', maxWidth: '90vw', minHeight: '100px', maxHeight: '90vh'},
            contentClasses: 'column no-wrap font-14 text-dark',
            ...modal_props
          }
        }, [renderFunc ? renderFunc(h, this) : null])
      },
      mounted() {
        this.$refs.modal.show();
      }
    })
  };


  Vue.prototype.$q.ppDialogBase = baseDialog;


  Vue.prototype.$q.ppDialog = (headerRender, contentRender, okCallBack, cancelCallBack) => baseDialog((h, modalVm) => ([
      //header
      h('div', {
        staticClass: 'bg-grey-3',
        style: {
          height: '40px',
          borderBottom: '1px solid var(--q-color-grey-5)',
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px'
        }
      }, [
        h('div', {
          staticClass: 'font-16 text-dark flex no-wrap items-center',
          style: {textAlign: 'start', padding: '12px 16px', width: '450px'}
        }, [headerRender ? headerRender(h, modalVm) : null]),
      ]),

      //content
      h('div', {staticClass: 'col-grow', style: {overflow: 'auto'}}, [
        contentRender ? contentRender(h, modalVm) : null
      ]),

      //footer
      h('div', {staticClass: 'row reverse', style: {height: '40px', minHeight: '40px'}}, [
        h('q-btn', {
          staticClass: 'text-faded q-pt-none q-mt-xs q-pb-none q-mb-xs q-mr-sm',
          style: {minHeight: '32px', height: '32px', fontSize: '13px'},
          props: {label: '取消', flat: true, size: 'md'},
          on: {
            click: () => {
              cancelCallBack && cancelCallBack(() => modalVm.close());
            }
          }
        }),
        h('q-btn', {
          staticClass: 'text-primary q-pt-none q-mt-xs q-pb-none q-mb-xs q-mr-sm',
          style: {minHeight: '32px', height: '32px', fontSize: '13px'},
          props: {label: '确定', flat: true, size: 'md'},
          on: {
            click: () => {
              okCallBack && okCallBack(() => modalVm.close());
            }
          }
        }),
      ])
    ])
  );

  Vue.prototype.$q.ppAlert = (contentRender, okCallBack, cancelCallBack) => baseDialog((h, modalVm) => ([
      //content
      h('div', {staticClass: 'col-grow flex no-wrap scroll', style: {padding: '24px'}}, [
        h('q-icon', {
          staticClass: 'text-amber q-mr-sm ',
          style: {fontSize: '34px'},
          props: {
            name: 'error'
          }
        })
        ,
        h('div', {staticClass: 'flex no-wrap items-center'}, [
          !contentRender
            ? null
            : typeof contentRender === 'function' ? contentRender(h, modalVm)
            : typeof contentRender === 'string' ? h('div', contentRender) : contentRender
        ])
      ]),

      //separator
      h('div', {staticClass: 'pp-separator-5-h'}),
      //footer
      h('div', {
        staticClass: 'row reverse',
        style: {height: '40px', minHeight: '40px'}
      }, [
        h('q-btn', {
          staticClass: 'text-faded q-pt-none q-mt-xs q-pb-none q-mb-xs q-mr-sm',
          style: {minHeight: '32px', height: '32px', fontSize: '13px'},
          props: {label: '取消', flat: true},
          on: {
            click: () => {
              cancelCallBack && cancelCallBack(() => modalVm.close());
            }
          }
        }),
        h('q-btn', {
          staticClass: 'text-primary q-pt-none q-mt-xs q-pb-none q-mb-xs q-mr-sm',
          style: {minHeight: '32px', height: '32px', fontSize: '13px'},
          props: {label: '确定', flat: true},
          on: {
            click: () => {
              okCallBack && okCallBack(() => modalVm.close());
            }
          }
        })
      ])
    ])
  );
  Vue.prototype.$q.ppAlertWithComment = (contentRender, okCallBack, cancelCallBack) => baseDialog((h, modalVm) => {
      let comment = '';
      return [
        //content
        h('div', {staticClass: 'col-grow flex no-wrap scroll', style: {padding: '24px'}}, [
          h('q-icon', {
            staticClass: 'text-amber q-mr-sm ',
            style: {fontSize: '34px'},
            props: {
              name: 'error'
            }
          })
          ,
          h('div', {staticClass: 'flex no-wrap items-center'}, [
            !contentRender
              ? null
              : typeof contentRender === 'function' ? contentRender(h, modalVm)
              : typeof contentRender === 'string' ? h('div', contentRender) : contentRender
          ])
        ]),
        h('q-input', {
          staticClass: 'text-dark shadow-0 pp-radius-3 pp-border-4 exclude_selectable',
          style: {minWidth: '400px', margin: '0 32px 32px 32px'},
          props: {
            color: 'white',
            type: 'textarea',
            inverted: true,
            maxHeight: 50,
            value: comment,
            placeholder: '备注',
          },
          on: {
            input: v => comment = v
          }
        }),
        //separator
        h('div', {staticClass: 'pp-separator-5-h'}),
        //footer
        h('div', {
          staticClass: 'row reverse',
          style: {height: '40px', minHeight: '40px'}
        }, [
          h('q-btn', {
            staticClass: 'text-faded q-pt-none q-mt-xs q-pb-none q-mb-xs q-mr-sm',
            style: {minHeight: '32px', height: '32px', fontSize: '13px'},
            props: {label: '取消', flat: true},
            on: {
              click: () => {
                cancelCallBack && cancelCallBack(() => modalVm.close());
              }
            }
          }),
          h('q-btn', {
            staticClass: 'text-primary q-pt-none q-mt-xs q-pb-none q-mb-xs q-mr-sm',
            style: {minHeight: '32px', height: '32px', fontSize: '13px'},
            props: {label: '确定', flat: true},
            on: {
              click: () => {
                okCallBack && okCallBack(
                  () => {
                    modalVm.close();
                    comment = ''
                  },
                  comment);
              }
            }
          })
        ])
      ]
    }
  );

  Vue.prototype.$q.ppAlertPromise = (contentRender, submitValidate) => new Promise((s, j) => baseDialog(
    (h, modalVm) => ([
      //content
      h('div', {staticClass: 'col-grow flex no-wrap scroll', style: {padding: '24px'}}, [
        h('q-icon', {
          staticClass: 'text-amber q-mr-lg ',
          style: {fontSize: '34px'},
          props: {
            name: 'error'
          }
        })
        ,
        h('div', {staticClass: 'flex no-wrap items-center'}, [
          !contentRender
            ? null
            : typeof contentRender === 'function' ? contentRender(h, modalVm)
            : typeof contentRender === 'string' ? h('div', contentRender) : contentRender
        ])
      ]),

      //footer
      h('div', {
        staticClass: 'row reverse',
        style: {height: '40px', minHeight: '40px', borderTop: '1px solid var(--q-color-grey-4)'}
      }, [
        h('q-btn', {
          staticClass: 'text-faded q-pt-none q-mt-xs q-pb-none q-mb-xs q-mr-sm',
          style: {minHeight: '32px', height: '32px', fontSize: '13px'},
          props: {label: '取消', flat: true},
          on: {
            click: () => {
              modalVm.close();
              j()
            }
          }
        }),
        h('q-btn', {
          staticClass: 'text-primary q-pt-none q-mt-xs q-pb-none q-mb-xs q-mr-sm',
          style: {minHeight: '32px', height: '32px', fontSize: '13px'},
          props: {label: '确定', flat: true},
          on: {click: () => submitValidate ? submitValidate().then(() => s(modalVm.close)).catch(s => s && modalVm.$q.warning(s, 3000)) : s(modalVm.close)}
        })
      ])
    ])
  ));

};
