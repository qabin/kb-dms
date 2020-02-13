import {vm as Vue} from '../main'

const size = 5;
export const push_cache = (u, cache_key, distinct_key, max_size) => {
  if (u)
    if (u instanceof Array)
      setArray(u, cache_key, distinct_key, max_size);
    else
      setOne(u, cache_key, distinct_key, max_size);
};

const setOne = (u, cache_key, distinct_key, max_size) => {
  if (!u || !cache_key)
    return;

  let list = Vue.$q.localStorage.get.item(cache_key);
  if (!list || list === 'null') {
    list = [u]
  } else if (!list.some(i => distinct_key ? i[distinct_key] === u[distinct_key] : i === u)) {
    list.unshift(u);
    list.splice(max_size ? max_size : size);
  }
  Vue.$q.localStorage.set(cache_key, list);
};

const setArray = (arr, cache_key, distinct_key, max_size) => {
  if (!arr || arr.length < 1 || !cache_key)
    return;

  let list = Vue.$q.localStorage.get.item(cache_key);
  if (!list || list === 'null') {
    list = arr
  } else {
    arr.forEach(i => {
      if (!list.some(u => distinct_key ? u[distinct_key] === i[distinct_key] : i === u)) {
        list.unshift(i);
      }
    });
    list.splice(max_size ? max_size : size);
  }
  Vue.$q.localStorage.set(cache_key, list);
};


export const take_cache = (max = 3, cache_key) => {
  let list = Vue.$q.localStorage.get.item(cache_key);
  return list && list !== 'null' ? list.slice(0, max) : []
};

export const clear_cache=(cache_key)=>{
  Vue.$q.localStorage.remove(cache_key)
}
