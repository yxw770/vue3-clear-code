/**
 * 過濾器工具
 */
import fuzzysort from 'fuzzysort'
/**
 * 金錢範圍過濾器
 * @param {*} data  數據
 * @param {*} min   最新金額
 * @param {*} max   最大金額
 */
export function moneyRangeFilter(data, min = '', max = '') {
  const oldData = JSON.parse(JSON.stringify(data))
  if (min == '' && max == '') {
    return oldData
  }
  if (min == '') {
    return oldData.map(item => {
      item.cases = item.cases.filter(item => item.price <= max)
      return item;
    });
  }
  if (max == '') {
    return oldData.map(item => {
      item.cases = item.cases.filter(item => item.price >= min)
      return item;
    });
  }
  return oldData.map(item => {
    item.cases = item.cases.filter(item => item.price >= min && item.price <= max)
    return item;
  });
}

/**
 * 分類過濾器
 * @param {*} data      數據
 * @param {*} cate_id   分類ID
 * @returns 
 */
export function cateFilter(data, cate_id) {
  if (cate_id == 0) {
    return data
  }
  return data.filter(item => item.id == cate_id)
}

/**
 * 任意字符串過濾器 模糊搜索
 * @param {*} data 
 * @param {*} key 
 * @param {*} keywords 
 * @returns 
 */
export function nameFilter(data, key, keywords) {
  if (keywords == '') {
    return data
  }
  const oldData = JSON.parse(JSON.stringify(data))
  return oldData.map(item => {
    item.cases = fuzzysort.go(keywords, item.cases, { key: key }).map(item => item.obj)

    return item;
  });
}

/**
 * 喜歡過濾
 * @param {*} data 
 * @param {*} favorite_list 
 * @param {*} keywords 
 * @returns 
 */
export function favoriteFilter(data, favorite_list, value) {
  if (!value) {
    return data
  }
  console.log(favorite_list)
  const oldData = JSON.parse(JSON.stringify(data))
  return oldData.map(item => {
    item.cases = item.cases.filter(item => favorite_list.includes(item.id))
    return item;
  });
}

/**
 * 排序戰鬥房間
 * @param {*} data 數據
 * @param {*} sort  false:desc,true:asc    次序
 * @param {*} type false:date, true:price  依照什麼排序
 */
export function sortBattleRoom(data, sort, type) {
  const oldData = JSON.parse(JSON.stringify(data))
  if (type) {
    return oldData.sort((a, b) => sort ? a.worth - b.worth : b.worth - a.worth);
  } else {

    return oldData.sort((a, b) => sort ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }


}