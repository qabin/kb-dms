export function replaceURLWithHTMLLinks(text) {
  let reg = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g;
  return text.replace(reg, function (a) {
    let url = a.indexOf('http') > -1 ? a : `http://${a}`;
    return `<a href='${url}' target=_blank style="text-decoration:none">${a}</a>`
  });
}
