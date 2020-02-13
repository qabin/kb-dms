export function get_index_of_arr(value, arr) {
  try {
    let i = arr.length;
    while (i--) {
      if (arr[i] === value) {
        return i;
      }
    }
    return -1;
  } catch (e) {
    return -1
  }
}

export function remove_item_from_arr(value, arr) {
  try {
    let i = arr.length;
    while (i--) {
      if (arr[i] === value) {
        arr.splice(i, 1)
        return
      }
    }
  } catch (e) {
  }
}


export function replace_item_for_arr(old_value, new_value, arr) {
  let index = get_index_of_arr(old_value, arr)
  if (index !== -1) {
    arr.splice(index, 1, new_value)
  }
}
