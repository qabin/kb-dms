export default {
  name: 'comp_dash_card_simple',
  props: {
    icon: {type: String, required: false},
    number: {type: Number, default: 0},
    description: {type: String},
    tooltip: {type: String, default: null},
    borderColor: {type: String, default: 'blue-5'}
  },
  data: () => ({}),
  render(h) {
    return h('div', {
      staticClass: 'row items-center pp-border-5 font-12',
      style: {
        height: '90px',
        width: '20vw',
        borderLeft: `3px solid var(--q-color-${this.borderColor})`,
        padding: '10px',
        marginLeft:'5px',
        marginRight:'5px'
      }
    }, [
      h('div', {style: {width: '100%'}}, [
        h('div', {
          staticClass:'items-center'
        }, [
          h('span', {
          staticClass: 'text-bold text-blue-5',
          style: {fontSize: '28px'}
        }, this.number)]),
        h('div', {staticClass: 'font-14'}, [this.description, this.tooltip != null && h('q-icon', {
          staticClass: 'q-ml-xs cursor-pointer',
          props:{
            name:'help_outline',
            size:'16px'
          }
        }, [
          h('q-tooltip', {staticClass: 'text-wrap', props: {offset: [0, -50]}}, this.tooltip)
        ])])
      ])
    ])
  }
}
