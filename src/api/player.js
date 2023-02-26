import request from "@/utils/request";
/**
 * 讀取用戶信息
 */
export function getUserInfo() {
  return request({
    url: "/player/info",
    method: "get",
  });
}
/**
 * 設定促銷碼
 * @param {*} data 
 * @returns 
 */
export function setPromoCode(data) {
  return request({
    url: '/player/setPromoCode',
    method: "post",
    data
  })
}
/**
 * 修改玩家信息
 * @param {*} data 
 * @returns 
 */
export function saveInfo(data) {
  return request({
    url: '/player/saveInfo',
    method: "post",
    data
  })
}
/**
 * 重發驗證電郵
 * @param {*} data 
 * @returns 
 */
export function resendEmail() {
  return request({
    url: '/player/resendEmail',
    method: "post",
  })
}
/**
 * 獲取其他玩家信息
 * @param {*} data 
 * @returns 
 */
export function getPlayerInfo(id) {
  return request({
    url: '/player/info/' + id,
    method: "get",
  })
}
