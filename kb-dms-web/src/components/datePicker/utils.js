export const datePropValidator = (date) => {
  if (typeof date === 'number') {
    return true
  }
  return isNaN(Date.parse(date)) === false
};

export const compare_month = (left, right) => {
  if (left.getFullYear() !== right.getFullYear())
    return left.getFullYear() - right.getFullYear();

  if (left.getMonth() !== right.getMonth())
    return left.getMonth() - right.getMonth();

  return 0
};


export const compare_day = (left, right) => {
  if (left.getFullYear() !== right.getFullYear())
    return left.getFullYear() - right.getFullYear();

  if (left.getMonth() !== right.getMonth())
    return left.getMonth() - right.getMonth();

  if (left.getDate() !== right.getDate())
    return left.getDate() - right.getDate();

  return 0
};


export const compare_hour = (left, right) => {
  let res = compare_day(left, right);
  if (res !== 0)
    return res;

  if (left.getHours() !== right.getHours())
    return left.getHours() - right.getHours();

  return 0
};


export const compare_minutes = (left, right) => {
  let res = compare_hour(left, right);

  if (res !== 0)
    return res;

  if (left.getMinutes() !== right.getMinutes())
    return left.getMinutes() - right.getMinutes();

  return 0
};

