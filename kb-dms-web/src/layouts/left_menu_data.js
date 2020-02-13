const left_menu_data = [
  {
    label: '首页',
    to: '/index',
    icon: 'home',
  },
  {
    label: '历史',
    to: '/history',
    icon: 'history',
  },
  {
    label: '统计',
    to: '/statistics',
    icon: 'bar_chart',
  }
]


export {left_menu_data}

const route_menu_cache = {};

const cache_route = (path, item) => {
  route_menu_cache[path] = item;
};

export const route2menu = (path) => {
  if (route_menu_cache[path])
    return route_menu_cache[path];
  let res = [];
  let menu_data = left_menu_data;
  for (let i in menu_data) {
    let item = menu_data[i];
    if (item.to === path && !item.ignore) {
      res.push(item);
    } else if (item.children) {
      for (let j in item.children) {
        let child_item = item.children[j];
        if (child_item.to && child_item.to === path) {
          res.push(item);
          res.push(child_item);
        }
      }
    }
  }
  cache_route(path, res);
  return res;
};
