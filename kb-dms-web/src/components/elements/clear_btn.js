const dict_size = {
  xs: {
    fontSize: '12px',
    minWidth: '14px',
    height: '14px',
    width: '14px'
  },
  sm: {
    fontSize: '14px',
    minWidth: '16px',
    height: '16px',
    width: '16px'
  },
  md: {
    fontSize: '18px',
    minWidth: '20px',
    height: '20px',
    width: '20px'
  },
  lg: {
    fontSize: '20px',
    minWidth: '22px',
    height: '22px',
    width: '22px'
  }
};

export default {
  name: 'clear-btn',
  props: {
    disable: Boolean,
    hide: Boolean,
    size: {type: String, required: false, default: 'xs'}
  },
  render(h) {
    if (this.hide)
      return null;
    else {
      let conf = this.disable
        ? {'class': 'cursor-not-allowed'}
        : {'class': 'cursor-pointer pp-selectable-bg-grey-6', on: {click: (e) => this.$emit('click', e)}};
      return h('i', {
        staticClass: 'material-icons bg-grey-5 text-white pp-radius-round',
        style: {padding: '1px', ...dict_size[this.size]},
        ...conf
      }, 'clear')
    }
  }
}
