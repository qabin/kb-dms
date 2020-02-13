import {notify_ok} from "../plugins/PpNotify";

export const copy_to_clipboard = (text, msg = true) => {
  const el = document.createElement('div');
  el.innerHTML = text;

  el.style.position = 'fixed';
  el.style.pointerEvents = 'none';
  el.style.opacity = 0;
  document.body.appendChild(el);
  window.getSelection().removeAllRanges();
  let range = document.createRange();
  range.selectNode(el);
  window.getSelection().addRange(range);
  document.execCommand('copy');
  notify_ok('已复制至粘贴板', 1000)
};


const host_reg = new RegExp("^(http:\\/\\/.+?)\\/");

export const copy_url = append_text => {
  let res = host_reg.exec(window.location.href);
  append_text && res && res.length===2 && copy_to_clipboard(res[1] + append_text)
};
