import {push_cache, take_cache} from './favorite_selection'

const cache_key = 'favorite_user_list';
const distinct_key = 'account';

export const setFavoriteUser = (u) => {
  push_cache(u, cache_key, distinct_key)
};
export const getFavoriteUsers = (max = 3) => {
  return take_cache(max, cache_key)
};
