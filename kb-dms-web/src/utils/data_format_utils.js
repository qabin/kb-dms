import jsonlint from '../../jsonlint'


export function string_to_json(v) {
  try {
    return jsonlint.parse(v)
  } catch (e) {
    return v
  }
}

export function header_map_to_arr(v) {
  try {
    v = jsonlint.parse(v)
  } catch (e) {
    v = null
  }
  let headerArr = [];
  if (v) {
    Object.keys(v).map(k => {
      let headerMap = {
        key: k,
        value: v[k],
        description: null
      }
      headerArr.push(headerMap)
    })
    return headerArr
  }
  return []
}


export function header_arr_to_map(v) {
  if (v && v.length > 0) {
    let headerMap = {};
    v.map(h => {
      if (h.key) {
        headerMap[h.key] = h.value
      }
    })
    return headerMap;
  }
  return {};
}


export function string_format(v, args) {
  if (args.length === 0) return v;
  let s = v
  for (let i = 0; i < args.length; i++)
    s = s.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
  return s;
}


export function to_string(v) {
  try {
    return v.toString()
  } catch (e) {
    return v
  }
}
