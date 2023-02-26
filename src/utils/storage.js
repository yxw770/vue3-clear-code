import { settings } from "@/config/index.js";
import cookie from "js-cookie";
const _storage = settings.storage;
const tokenTableName = settings.tokenTableName;
/**
 * @description 移除記錄
 * @returns {void|Promise<void>}
 */
export function removeItem(tableName, custom_storage = _storage) {
  if (custom_storage) {
    if ("localStorage" === custom_storage) {
      return localStorage.removeItem(tokenTableName + "_" + tableName);
    } else if ("sessionStorage" === custom_storage) {
      return sessionStorage.removeItem(tokenTableName + "_" + tableName);
    } else if ("cookie" === custom_storage) {
      return cookie.remove(tokenTableName + "_" + tableName);
    } else {
      return localStorage.removeItem(tokenTableName + "_" + tableName);
    }
  } else {
    return localStorage.removeItem(tokenTableName + "_" + tableName);
  }
}
/**
 * @description 获取項目
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
export function getItem(tableName, custom_storage = _storage) {
  // console.log(localStorage.getItem(tokenTableName), "storage");
  if (custom_storage) {
    if ("localStorage" === custom_storage) {
      return localStorage.getItem(tokenTableName + "_" + tableName);
    } else if ("sessionStorage" === custom_storage) {
      return sessionStorage.getItem(tokenTableName + "_" + tableName);
    } else if ("cookie" === custom_storage) {
      return cookie.get(tokenTableName + "_" + tableName);
    } else {
      return localStorage.getItem(tokenTableName + "_" + tableName);
    }
  } else {
    return localStorage.getItem(tokenTableName + "_" + tableName);

  }
}

/**
 * @description 存储項目
 * @param value
 * @returns {void|*}
 */
export function setItem(tableName, value, custom_storage = _storage) {
  if (custom_storage) {
    if ("localStorage" === custom_storage) {
      let res = localStorage.setItem(tokenTableName + "_" + tableName, value);
      if (["player_token"].includes(tableName)) {
        window.dispatchEvent(
          new CustomEvent(tableName + "-localstorage-changed", {
            detail: {
              storage: getItem(tableName),
            },
          })
        );
      }
      return res;
    } else if ("sessionStorage" === custom_storage) {
      return sessionStorage.setItem(tokenTableName + "_" + tableName, value);
    } else if ("cookie" === custom_storage) {
      return cookie.set(tokenTableName + "_" + tableName, value);
    } else {
      return localStorage.setItem(tokenTableName + "_" + tableName, value);
    }
  } else {
    return localStorage.setItem(tokenTableName + "_" + tableName, value);
  }
}
/**
 * @description 获取数组項目
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
export function getArrItem(tableName, custom_storage = _storage) {
  return JSON.parse(getItem(tableName, custom_storage) || "[]");
}
/**
 * @description 存储数组項目
 * @param value
 * @returns {void|*}
 */
export function setArrItem(tableName, value, custom_storage = _storage) {
  let new_value = JSON.stringify(value);
  return setItem(tableName, new_value, custom_storage);
}

export function toBool(value, default_value = false) {
  if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  } else {
    return default_value;
  }
}
