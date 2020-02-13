export default {
  name: 'button_upload_file',
  props: {},
  methods: {
    upload(e) {
      if (e && e.target && e.target.files && e.target.files.length > 0) {
        let vm = this
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        let reader = new FileReader(); //新建一个FileReader
        reader.readAsText(e.target.files[0], "UTF-8"); //读取文件
        reader.onload = function (evt) { //读取完文件之后会回来这里
          let fileString = evt.target.result; // 读取文件内容
          if (fileString) {
            vm.$emit('uploaded', fileString)
          }
        }
        e.target.value = null
      }
    }
  },
  render(h) {
    return h('input', {
      staticClass: 'q-uploader-input absolute-full cursor-pointer',
      attrs: {type: 'file', multiple: false},
      on: {change: this.upload}
    })
  }
}
