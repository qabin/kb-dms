import SelectorMixin from '../selector/MixinSelectorBase'
export default {
  name: 'ppTimePicker',
  mixins: [SelectorMixin],
  data: () => ({
    popup_fit: false,
    colorArray:[
      '#e0e0e0', '#f8bbd0', '#ffcdd2', '#e1bee7', '#90caf9', '#fff59d ','#c8e6c9 ',
      '#bdbdbd', '#f48fb1', '#ef9a9a', '#ce93d8', '#42a5f5', '#fff176 ','#a5d6a7 ',
      '#616161', '#f06292', '#e57373', '#ba68c8', '#2196f3', '#ffee58 ','#81c784 ',
      '#424242', '#e91e63', '#ef5350', '#ab47bc', '#2196f3', '#ffeb3b ','#66bb6a ',
      '#212121', '#d81b60', '#f44336', '#9c27b0', '#1565c0', '#ffeb3b ','#4caf50 ',
    ]
  }),
  methods: {
    render_field_content(h) {
      return h('div', {  staticClass: 'flex no-wrap items-center full-width q-pl-xs q-pr-xs'})
    },
    __render_placeholder(h) {
      return typeof this.placeholder === 'function'
        ? this.placeholder(h)
        : h('span', {
          style: {color: '#979797', fontSize: this.fontSize, padding: '0 4px'}
        },[h('q-icon',{
              style:'color:#000',
              props:{name:'format_color_text'}
            })
         ]);
    },
    render_ftColor_card(h,color){
      return h('button',{
        staticClass:'cursor-pointer',
        style:{width:'10px',height:'10px', outline:'none',margin:'0 5px', border:'none',backgroundColor:color},
        on:{
          click:(v)=>{
            document.execCommand('foreColor', false,color );
            this.$refs.popup.hide()
          }
        }
      })
    },
    __render_list(h) {
      return h('div', {
          style:{padding:'6px'}
      }, [
        h('div',{ style:{width:'154px',margin:'auto'}},[
          this.colorArray.map(color => this.render_ftColor_card(h,color))
        ]),
        h('q-collapsible',{staticClass:'font-12',props:{label:'更多颜色'}
         },[
            h('q-color-picker', {
              props:{
                formatModel:'hex'
              },
              on: {
                change: v => {
                  this.$emit('click',v)
                }
              }
            })
        ]),
      ])
    },
  }
}
