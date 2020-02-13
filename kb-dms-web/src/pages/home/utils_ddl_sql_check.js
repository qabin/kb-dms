import {check_is_keywords} from "../../utils/utils_mysql_keywords_check";

export function table_name_check(v) {
  if (v) {
    let regExp = /^[a-z][a-z0-9_]*$/g
    if (!regExp.test(v)) {
      return {
        error: true,
        msg: '表名仅支持英文小写字母，数字，以及下划线，且以英文字母开头!'
      }
    } else {
      if (check_is_keywords(v)) {
        return {
          error: true,
          msg: '表名不能为MySQL保留关键字!'
        }
      }
    }
  }else{
    return {
      error: true,
      msg: '表名不能为空!'
    }
  }
  return {
    error: false,
    msg: null
  }
}

export function table_remarks_check(v) {
  if (!v) {
    return {
      error: true,
      msg: '备注信息不能为空!'
    }
  }
  return {
    error: false,
    msg: null
  }
}


export function table_column_name_check(v) {
  if (v) {
    let regExp = /^[a-z][a-z0-9_]*$/g
    if (!regExp.test(v)) {
      return {
        error: true,
        msg: '字段名仅支持英文小写字母，数字，以及下划线，且以英文字母开头!'
      }
    } else {
      if (check_is_keywords(v)) {
        return {
          error: true,
          msg: '字段名不能为MySQL保留关键字!'
        }
      }
    }
  } else {
    return {
      error: true,
      msg: '字段名不能为空!'
    }
  }
  return {
    error: false,
    msg: null
  }
}

export function index_column_name_check(v) {
  if (v) {
    let regExp = /^[a-z][a-z0-9_]*$/g
    if (!regExp.test(v)) {
      return {
        error: true,
        msg: '字段名仅支持英文小写字母，数字，以及下划线，且以英文字母开头!'
      }
    } else {
      if (check_is_keywords(v)) {
        return {
          error: true,
          msg: '字段名不能为MySQL保留关键字!'
        }
      }
    }
  } else {
    return {
      error: true,
      msg: '字段名不能为空!'
    }
  }
  return {
    error: false,
    msg: null
  }
}
