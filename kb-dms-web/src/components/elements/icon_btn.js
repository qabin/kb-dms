const dict_size = {
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
  name: 'iconButton',
  props: {
    disable: Boolean,
    size: {type: String, required: false, default: 'md'},
    color: {type: String, default: 'primary'},
    select_color: {type: String, default: 'primary'},
    reverse: Boolean,
    flat: Boolean,
    round: Boolean
  },
  render(h) {
    let cls = '';

    if (this.disable)
      cls = 'cursor-not-allowed text-light';
    else if (this.reverse)
      cls = `cursor-pointer text-white bg-${this.color} pp-selectable-bg-${this.select_color}`;
    else if (this.flat)
      cls = `cursor-pointer text-${this.color} pp-selectable-color-${this.select_color}`;
    else
      cls = `cursor-pointer text-${this.color} pp-selectable-color-white pp-selectable-bg-${this.select_color}`;

    if (this.round)
      cls = cls + ' pp-radius-round';
    else
      cls = cls + ' pp-radius';

    return h('i', {
      staticClass: 'material-icons non-selectable',
      'class': cls,
      style: {padding: '1px', ...dict_size[this.size]},
      on: this.disable ? {} : {click: () => this.$emit('click')}
    }, [
      this.$slots.default
    ])
  }
}
