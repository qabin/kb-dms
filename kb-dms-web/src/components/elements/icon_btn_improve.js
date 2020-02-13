const dict_size = {
  xs: {
    fontSize: '12px',
    minWidth: '14px',
    height: '14px',
    width: '14px'
  },
  sm: {
    fontSize: '15px',
    minWidth: '17px',
    height: '17px',
    width: '17px'
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
  },
  xl: {
    fontSize: '24px',
    minWidth: '26px',
    height: '26px',
    width: '26px'
  }
};

const bg_map = {
  primary: 'pp-selectable-bg-blue-5',
  secondary: 'pp-selectable-bg-teal',
  faded: 'pp-selectable-bg-grey-5',
  light: 'bg-grey-2',
  negative: 'bg-red-1',
  warning: 'bg-amber-1'
};


export default {
  name: 'iconButtonImprove',
  props: {
    value: Boolean,
    disable: Boolean,
    size: {type: String, required: false, default: 'md'},
    color: {type: String, default: 'primary', validator: s => ['primary', 'secondary', 'faded', 'light', 'negative', 'warning'].includes(s)},
    tooltip: String,
    round: Boolean
  },
  render(h) {
    let conf;

    if (this.disable)
      conf = {'class': 'cursor-not-allowed text-light'};
    else if (this.value) {
      conf = {
        'class': `cursor-pointer text-white bg-${this.color}`,
        on: {
          click: e => {
            this.$emit('input', false);
            this.$emit('click', e)
          }
        }
      }
    }
    else if (this.round) {
      conf = {
        'class': `cursor-pointer text-white bg-${this.color} pp-selectable-opacity-5`,
        on: {
          click: e => {
            this.$emit('input', false);
            this.$emit('click', e)
          }
        }
      }
    } else
      conf = {
        'class': `cursor-pointer text-${this.color} ${bg_map[this.color]} pp-selectable-color-white`,
        on: {
          click: e => {
            this.$emit('input', true);
            this.$emit('click', e)
          }
        }
      };

    return h('i', {
      staticClass: `material-icons non-selectable q-icon ${this.round ? 'pp-radius-round' : 'pp-radius'}`,
      style: {padding: '1px', ...dict_size[this.size], transition: 'all 0.15s'},
      ...conf
    }, [
      this.$slots.default,
      this.tooltip ? h('q-tooltip', {props: {offset: [0, 5]}}, this.tooltip) : null
    ])
  }
}
