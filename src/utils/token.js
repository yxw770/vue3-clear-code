import { getItem, setItem, removeItem } from "./storage";

/**
 * @description 获取token
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
export function getToken() {
  return getItem("player_token");
}
export function getRefreshStatus() {
  return getItem("player_refresh_status");
}

/**
 * @description 存储token
 * @param token
 * @returns {void|*}
 */
export function setToken(token) {
  return setItem("player_token", token);
}
export function setRefreshStatus(status) {
  return setItem("player_refresh_status", status);
}

/**
 * @description 移除token
 * @returns {void|Promise<void>}
 */
export function removeToken() {
  return removeItem("player_token");
}
