import './vkbeautify'

export function string_to_json(v) {
  try {
    return JSON.parse(v)
  } catch (e) {
  }
  return v
}

export function string_to_json_wrap(v) {
  try {
    return JSON.stringify(JSON.parse(v), null, '\t')
  } catch (e) {
  }
  return v
}

export function json_wrap_to_string(v) {
  try {
    return JSON.stringify(JSON.parse(v))
  } catch (e) {
  }
  return v
}


export function string_to_xml_wrap(v) {
  try {
    return vkbeautify.xml(v);
  } catch (e) {
    return v
  }
}

export function xml_wrap_to_string(v) {
  try {
    return vkbeautify.xmlmin(v);
  } catch (e) {
    return v
  }
}

export function is_json(str) {
  if (typeof str == 'string') {
    try {
      let obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }

    } catch (e) {
      return false;
    }
  }
}

export function check_string_type(v) {
  try {
    if (v.startsWith("<!DOCTYPE html")) {
      return 'HTML'
    } else if (v.startsWith("<")) {
      return 'XML'
    } else if (is_json(v)) {
      return 'JSON'
    } else {
      return 'TEXT'
    }
  } catch (e) {
    return 'TEXT'
  }
}

export function wrap_to_string(v, t) {
  let type = t || check_string_type(v)
  switch (type) {
    case 'JSON': {
      return json_wrap_to_string(v)
    }
    case 'XML': {
      return xml_wrap_to_string(v)
    }
    case 'HTML': {
      return xml_wrap_to_string(v)
    }
  }
  return v
}

export function string_to_wrap(v, t) {
  let type = t || check_string_type(v)
  switch (type) {
    case 'JSON': {
      return string_to_json_wrap(v)
    }
    case 'XML': {
      return string_to_xml_wrap(v)
    }
    case 'HTML': {
      return string_to_xml_wrap(v)
    }
  }
  return v
}
