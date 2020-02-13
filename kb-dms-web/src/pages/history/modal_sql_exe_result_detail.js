import ExeResultCatalog from "../home/comp_exe_result_catalog";
import {vm as Vue} from '../../main'

export function show_chat_info_detail_modal(exe_result) {
  Vue.$q.ppDialogBase(
    h => h('div', {
        staticClass: 'relative-position pp-radius-1',
        style: {
          width: '80vw',
          maxHeight: '80vh'
        }
      }, [
        h(ExeResultCatalog, {
          staticClass: 'font-18 q-pa-sm bg-grey-3',
          props: {
            exe_result: exe_result,
            show_tools_bar: false
          }
        }),
      ]
    ),
    {noBackdropDismiss: false, noEscDismiss: false}
  )
}
