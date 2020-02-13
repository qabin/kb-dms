import {ready} from 'quasar-framework/src/utils/dom'
import extend from "quasar-framework/src/utils/extend";
import uid from "quasar-framework/src/utils/uid";
import './PpNotify.css'

function init(Vue) {
  if (!document.body) {
    ready(() => {
      init.call(this, Vue)
    });
    return
  }

  const node = document.createElement('div');
  document.body.appendChild(node);

  this.__vm = new Vue({
    name: 'pp-QNotifications',
    el: node,
    data: {
      queue: {
        notifies: [],
        messages: []
      }
    },
    methods: {
      add(type, config) {
        if (!config) {
          return false
        }
        let notif = extend({__uid: uid(), timeout: 5000}, config);

        let close = () => this.remove(notif, type);

        notif.close = close;
        notif.__timeout = setTimeout(close, notif.timeout);

        this.queue[type].unshift(notif);
      },
      remove(notif, type) {

        notif.__timeout && clearTimeout(notif.__timeout);

        const index = this.queue[type].indexOf(notif);
        if (index !== -1) {
          const ref = this.$refs[`notif_${notif.__uid}`];
          if (ref && ref.$el) {
            const el = ref.$el;
            el.style.left = `${el.offsetLeft}px`;
            el.style.width = getComputedStyle(el).width
          }
          this.queue[type].splice(index, 1);
          if (typeof notif.onDismiss === 'function') {
            notif.onDismiss()
          }
        }
      }
    },
    render(h) {
      return h('div', {staticClass: 'q-notifications'}, [
        h('transition-group', {
          staticClass: `q-notification-list q-notification-list-top fixed column items-end `,
          style: {paddingTop: '41px'},
          props: {
            tag: 'div',
            name: 'pp-notification-top-right',
            mode: 'out-in'
          }
        }, this.queue.messages.map(notif => {
          return h('div', {
            ref: `notif_${notif.__uid}`,
            key: notif.__uid,
            staticClass: 'q-notification',
          }, [
            notif.render ? notif.render(h, notif.close) : null
          ])
        })),
        h('transition-group', {
          staticClass: `q-notification-list q-notification-list-top fixed column items-center `,
          props: {
            tag: 'div',
            name: 'pp-notification-top',
            mode: 'out-in'
          }
        }, this.queue.notifies.map(notif => {
          return h('div', {
            ref: `notif_${notif.__uid}`,
            key: notif.__uid,
            staticClass: 'q-notification',
          }, [
            notif.render ? notif.render(h, notif.close) : null
          ])
        })),

      ])
    }
  });
}

export const notify_err = (content, timeout = 2000) => {
  this.__vm.add('notifies', {
    timeout,
    render: (h, close) => h('div', {
      staticClass: 'bg-grey-2 pp-border-5 pp-radius-3 shadow-1 flex items-center',
    }, [
      h('q-icon', {
        staticClass: 'font-20 text-negative q-ml-xs',
        style: {width: '20px', height: '20px'},
        props: {name: 'error'}
      }),
      h('div', {
        staticClass: 'text-dark font-14 ellipsis q-ml-xs q-mr-md col-grow text-center',
        style: {lineHeight: '30px', minWidth: '10px', maxWidth: '80vw'}
      }, [typeof content === 'function' ? content(h, close) : content])
    ])
  })
};

export const notify_warning = (content, timeout = 4000) => {
  this.__vm.add('notifies', {
    timeout,
    render: (h, close) => h('div', {
      staticClass: 'bg-grey-2 pp-border-5 pp-radius-3 shadow-1 flex items-center',
    }, [
      h('q-icon', {
        staticClass: 'font-20 text-orange q-ml-xs',
        style: {width: '20px', height: '20px'},
        props: {name: 'warning'}
      }),
      h('div', {
        staticClass: 'text-dark font-14 ellipsis q-ml-xs q-mr-md col-grow text-center',
        style: {lineHeight: '30px', minWidth: '10px', maxWidth: '80vw'}
      }, [typeof content === 'function' ? content(h, close) : content])
    ])
  })
};

export const notify_ok = (content, timeout = 1200) => {
  this.__vm.add('notifies', {
    timeout,
    render: (h, close) => h('div', {
      staticClass: 'bg-grey-2 pp-border-5 pp-radius-3 shadow-1 flex items-center',
    }, [
      h('q-icon', {
        staticClass: 'font-14 text-white bg-secondary q-ml-xs',
        style: {width: '16px', height: '16px', borderRadius: '50%'},
        props: {name: 'check'}
      }),
      h('div', {
        staticClass: 'text-dark font-14 ellipsis q-ml-xs q-mr-sm col-grow',
        style: {lineHeight: '30px', minWidth: '10px', maxWidth: '80vw'}
      }, [typeof content === 'function' ? content(h, close) : content])
    ])
  });
};

export default ({Vue}) => {
  //initialize
  init.call(this, Vue);

  // notifies
  Vue.prototype.$q.ppNotify = this.__vm.add.bind(this, 'notifies');
  Vue.prototype.$q.err = notify_err;
  Vue.prototype.$q.warning = notify_warning;
  Vue.prototype.$q.ok = notify_ok;

  // for quasar legacy
  Vue.prototype.$q.notify = ({type, message}) => {
    type && type === 'negative' && notify_err(message);
    type && type === 'warning' && notify_warning(message);
    type && type === 'positive' && notify_ok(message)
  };

  // generic message
  Vue.prototype.$q.ppMessage = this.__vm.add.bind(this, 'messages');
  Vue.prototype.$q.message = (headerRender, contentRender, timeout = 10000) => {
    this.__vm.add('messages', {
      timeout,
      render: (h, close) => h('div', {
        staticClass: 'bg-grey-2 pp-radius-4 shadow-1',
        style: {
          border: '1px solid var(--q-color-teal)',
          width: '350px',
          minHeight: '100px',
          maxHeight: '50vh'
        }
      }, [
        h('div', {
          staticClass: 'full-width bg-teal text-white font-14 q-pl-xs q-pr-xs relative-position',
          style: {
            height: '30px',
            lineHeight: '30px',
            borderTopLeftRadius: '3px',
            borderTopRightRadius: '3px',
            overflow: 'visible'
          }
        }, [
          h('q-icon', {
            staticClass: 'font-18 bg-teal text-white cursor-pointer absolute-top-right',
            style: {
              width: '18px',
              height: '18px',
              transform: 'translate(40%, -40%)',
              borderRadius: '50%'
            },
            props: {name: 'cancel'},
            nativeOn: {click: close}
          }),
          h('div', {staticClass: 'full-width ellipsis'}, [
            headerRender ? (typeof headerRender === 'function' ? headerRender(h) : headerRender) : null,
          ])
        ]),
        h('div', {
          staticClass: 'text-dark font-13 q-pa-sm',
        }, [
          contentRender ? (typeof contentRender === 'function' ? contentRender(h) : contentRender) : null
        ])
      ])
    })
  };
}
