import {formatDate} from 'quasar-framework/src/utils/date'

export const format_date = (date, nil = '--') => {
  return formatDate(date, "YYYY-MM-DD HH:mm") || nil
};
export const format_date_simple = (date, nil = '--') => {
  return formatDate(date, "MM-DD HH:mm") || nil
};
export const format_date_full = (date, nil = '--') => {
  return formatDate(date, "YYYY-MM-DD HH:mm:ss") || nil
};
export const format_day = (date, nil = '--') => {
  return formatDate(date, "YYYY-MM-DD") || nil
};
export const format_day_simple = (date, nil = '--') => {
  return formatDate(date, "MM-DD") || nil
};
export const format_time = (date, nil = '--') => {
  return formatDate(date, "HH:mm") || nil
};
export const format_year = (date, nil = '--') => {
  return formatDate(date, "YYYY") || nil
};
export const format_date_human_read = (v) => {

  let now = new Date()
  let target = null

  if (typeof v !== 'number')
    target = new Date(v);
  else if (typeof v === 'string')
    target = Date.parse(v)

  if (v) {
    if (Date.now() - v < 10 * 60 * 1000)
      return '刚刚';
    else if (now.getUTCFullYear() === target.getUTCFullYear()
      && now.getUTCMonth() === target.getUTCMonth()
      && now.getUTCDate() === target.getUTCDate())
      return `今天 ${format_time(v)}`;
    else if (now.getUTCFullYear() === target.getUTCFullYear())
      return formatDate(v, 'MM月DD日 HH:mm');
    else
      return formatDate(v, 'YYYY年MM月DD日 HH:mm')
  }
};
