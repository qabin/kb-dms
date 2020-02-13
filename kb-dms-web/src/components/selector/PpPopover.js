import {
  positionValidator,
  offsetValidator,
  parsePosition,
  setPosition
} from 'quasar-framework/src/utils/popup'
import {frameDebounce} from 'quasar-framework/src/utils/debounce'
import {getScrollTarget} from 'quasar-framework/src/utils/scroll'
import {width} from 'quasar-framework/src/utils/dom'
import {listenOpts} from 'quasar-framework/src/utils/event'

export default {
  name: 'QPopover',
  props: {
    anchor: {type: String, validator: positionValidator},
    self: {type: String, validator: positionValidator},
    fit: Boolean,
    maxHeight: String,
    touchPosition: Boolean,
    anchorClick: {type: Boolean, default: true},
    offset: {type: Array, validator: offsetValidator},
    disable: Boolean,
    value: Boolean
  },
  data() {
    return {
      showing: false
    }
  },
  watch: {
    $route() {
      this.hide()
    },
    value(val) {
      if (this.disable && val) {
        this.$emit('input', false);
        return
      }
      this.$nextTick(() => this.value !== this.showing && this[val ? 'show' : 'hide']())
    }
  },
  computed: {
    anchorOrigin() {
      return parsePosition(this.anchor || `bottom ${this.$q.i18n.rtl ? 'right' : 'left'}`)
    },
    selfOrigin() {
      return parsePosition(this.self || `top ${this.$q.i18n.rtl ? 'right' : 'left'}`)
    }
  },
  render(h) {
    return h('div', {
      staticClass: 'q-popover scroll',
      on: {click: (e) => e.stopPropagation()}
    }, [
      this.$slots.default
    ])
  },
  created() {
    this.__updatePosition = frameDebounce((_, event, animate) => this.reposition(event, animate))
  },
  mounted() {
    this.$nextTick(() => {
      this.anchorEl = this.$el.parentNode;
      this.anchorEl.removeChild(this.$el);
      if (this.anchorEl.classList.contains('q-btn-inner') || this.anchorEl.classList.contains('q-if-inner')) {
        this.anchorEl = this.anchorEl.parentNode
      }
      if (this.anchorClick) {
        this.anchorEl.classList.add('cursor-pointer');
        this.anchorEl.addEventListener('click', this.toggle)
      }
    });
    this.value && this.show()
  },
  beforeDestroy() {
    if (this.anchorClick && this.anchorEl) {
      this.anchorEl.removeEventListener('click', this.toggle)
    }
    if (this.showing) {
      this.showPromise && this.showPromiseReject();
      this.hidePromise && this.hidePromiseReject();
      this.$emit('input', false);
      this.__hide && this.__hide()
    }
  },
  methods: {
    toggle(evt) {
      return this[this.showing ? 'hide' : 'show'](evt)
    },
    show(evt) {
      if (this.disable || this.showing) {
        return this.showPromise || Promise.resolve(evt)
      }

      this.hidePromise && this.hidePromiseReject();
      this.showing = true;
      this.value === false && this.$emit('input', true);

      this.showPromise = new Promise((resolve, reject) => {
        this.showPromiseResolve = () => {
          this.showPromise = null;
          this.$emit('show', evt);
          resolve(evt)
        };
        this.showPromiseReject = () => {
          this.showPromise = null;
          reject(null)
        }
      });

      this.__show(evt);
      return this.showPromise || Promise.resolve(evt)
    },
    __show(evt) {
      document.body.appendChild(this.$el);
      document.body.addEventListener('click', this.__bodyHide, true);
      this.scrollTarget = getScrollTarget(this.anchorEl);
      this.scrollTarget.addEventListener('scroll', this.__updatePosition, listenOpts.passive);
      window.addEventListener('resize', this.__updatePosition, listenOpts.passive);
      this.__updatePosition(0, evt, true);

      this.showPromise && this.showPromiseResolve()
    },


    hide(evt) {
      if (this.disable || !this.showing) {
        return this.hidePromise || Promise.resolve(evt)
      }

      this.showPromise && this.showPromiseReject();
      this.showing = false;
      this.value === true && this.$emit('input', false);

      this.hidePromise = new Promise((resolve, reject) => {
        this.hidePromiseResolve = () => {
          this.hidePromise = null;
          this.$emit('hide', evt);
          resolve();
        };
        this.hidePromiseReject = () => {
          this.hidePromise = null;
          reject(null);
        }
      });

      this.__hide(evt);
      return this.hidePromise || Promise.resolve(evt)
    },

    __hide() {
      this.scrollTarget.removeEventListener('scroll', this.__updatePosition, listenOpts.passive);
      window.removeEventListener('resize', this.__updatePosition, listenOpts.passive);

      document.body.removeEventListener('click', this.__bodyHide, true);
      document.body.removeChild(this.$el);

      this.hidePromise && this.hidePromiseResolve()
    },

    __bodyHide(evt) {
      if (evt && evt.target && (this.$el.contains(evt.target) || this.anchorEl.contains(evt.target) || this.__in_pop(evt.target))) {
        return
      }
      this.hide(evt)
    },
    __in_pop(target) {
      let tar_rect = target.getBoundingClientRect();
      let pop_rect = this.$el.getBoundingClientRect();
      return tar_rect.left > pop_rect.left && tar_rect.right < pop_rect.right && tar_rect.top > pop_rect.top && tar_rect.bottom < pop_rect.bottom
    },
    reposition(event, animate) {
      if (this.fit) {
        this.$el.style.minWidth = width(this.anchorEl) + 'px'
      }
      const {top, bottom} = this.anchorEl.getBoundingClientRect();

      if (bottom < 0 || top > window.innerHeight) {
        return this.hide()
      }

      setPosition({
        event,
        animate,
        el: this.$el,
        offset: this.offset,
        anchorEl: this.anchorEl,
        anchorOrigin: this.anchorOrigin,
        selfOrigin: this.selfOrigin,
        maxHeight: this.maxHeight,
        anchorClick: this.anchorClick,
        touchPosition: this.touchPosition
      })
    }
  }
}
