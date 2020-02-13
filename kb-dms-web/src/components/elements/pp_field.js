export default {
  name: 'PjmField',
  props: {
    label: String,
    labelClass: {type: String, default: 'text-dark'},
    count: {
      type: [Number, Boolean],
      default: false
    },
    error: Boolean,
    errorLabel: String,
    warning: Boolean,
    warningLabel: String,
    helper: String,
    dark: Boolean,
    labelWidth: {
      type: [Number, String],
      default: 85
    },
    fontSize: {
      type: Number,
      default: 13
    },
    required: Boolean
  },
  data() {
    return {
      input: {}
    }
  },
  computed: {
    hasError() {
      return this.input.error || this.error
    },
    hasWarning() {
      return !this.hasError && (this.input.warning || this.warning)
    },
    childHasLabel() {
      return this.input.floatLabel || this.input.stackLabel
    },
    isDark() {
      return this.input.dark || this.dark
    },
    hasNoInput() {
      return !this.input.$options || this.input.__needsBorder
    },
    counter() {
      if (this.count) {
        const length = this.input.length || '0';
        return Number.isInteger(this.count)
          ? `${length} / ${this.count}`
          : length
      }
    },
    classes() {
      return {
        'q-field-horizontal': true,
        'q-field-floating': this.childHasLabel,
        'q-field-no-label': !this.label && !this.$slots.label,
        'q-field-with-error': this.hasError,
        'q-field-with-warning': this.hasWarning,
        'q-field-dark': this.isDark
      }
    }
  },
  provide() {
    return {
      __field: this
    }
  },
  methods: {
    __registerInput(vm) {
      this.input = vm
    },
    __unregisterInput(vm) {
      if (!vm || vm === this.input) {
        this.input = {}
      }
    },
    __getBottomContent(h) {
      let label;

      if (this.hasError && (label = this.$slots['error-label'] || this.errorLabel)) {
        return h('div', {staticClass: 'q-field-error col'}, label)
      }
      if (this.hasWarning && (label = this.$slots['warning-label'] || this.warningLabel)) {
        return h('div', {staticClass: 'q-field-warning col'}, label)
      }
      if ((label = this.$slots.helper || this.helper)) {
        return h('div', {staticClass: 'q-field-helper col'}, label)
      }
      return h('div', {staticClass: 'col'})
    },
    __hasBottom() {
      return (this.hasError && (this.$slots['error-label'] || this.errorLabel)) ||
        (this.hasWarning && (this.$slots['warning-label'] || this.warningLabel)) ||
        (this.$slots.helper || this.helper) ||
        this.count
    }
  },
  render(h) {
    const label = this.$slots.label || this.label;

    return h('div',
      {
        staticClass: 'q-field row no-wrap',
        'class': this.classes
      },
      [
        h('div',
          {
            staticClass: 'row col no-wrap items-center',
            style: {fontSize: `${this.fontSize}px`, minHeight: '24px'}
          },
          [
            label
              ? h('div', {
                staticClass: 'q-field-label flex no-wrap text-weight-bold ' + (this.hasError || this.hasWarning ? null : this.labelClass),
                style: {width: `${this.labelWidth}px`, minWidth: `${this.labelWidth}px`}
              }, [
                h('div', {
                  staticClass: 'text-red',
                  style: {width: '8px'}
                }, this.required ? '*' : null),
                this.$slots.label || this.label
              ])
              : null,

            h('div',
              {
                staticClass: 'q-field-content col-grow',
                style: {overflow: 'hidden'}
              },
              [
                this.$slots.default,
                this.__hasBottom()
                  ? h('div',
                  {
                    staticClass: 'q-field-bottom row no-wrap',
                    'class': {'q-field-no-input': this.hasNoInput}
                  },
                  [
                    this.__getBottomContent(h),
                    this.counter
                      ? h('div', {staticClass: 'q-field-counter col-auto'}, [this.counter])
                      : null
                  ])
                  : null
              ])
          ])
      ])
  }
}
