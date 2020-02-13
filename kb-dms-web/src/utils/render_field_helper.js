export const render_tr = (h, key, value, tooltip = null, value_cls = 'text-tertiary text-left') => {
  return h('tr', null, [
    h('td', {
      staticClass: 'q-pa-xs',
      style: {
        textAlign: 'left',
        whiteSpace: 'nowrap',
      }
    }, [key, tooltip && h('span', {staticClass: 'material-icons q-ml-xs tex-tertiary'}, [
      'help_outline',
      h('q-tooltip', {staticClass: 'text-wrap'}, tooltip.map(t => h('div', {}, t)))
    ])]),
    value
      ? h('td', {
        staticClass: value_cls,
      }, [value])
      : h('td', {
        staticClass: value_cls,
      }, '--')
  ])
}
