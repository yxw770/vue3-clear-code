import {translate} from "@/i18n";

/**
 * 金錢處理
 * @param {*} value  金額
 * @param {*} decimals 小數位數
 * @returns 金額
 */
export const parseMoney = (value, decimals = 2) => {
  value = parseFloat(value);
  if (!isFinite(value) || (!value && value !== 0)) return "";
  const currency = currency != null ? currency : "$";
  decimals = decimals != null ? decimals : 2;
  var stringified = Math.abs(value).toFixed(decimals);
  var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  var i = _int.length % 3;
  var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? "," : "") : "";
  var _float = decimals ? stringified.slice(-1 - decimals) : "";
  var sign = value < 0 ? "-" : "";
  return (
    sign +
    currency +
    head +
    _int.slice(i).replace(/(\d{3})(?=\d)/g, "$1,") +
    _float
  );
};
/**
 *  格式化數字
 * @param {*} value
 * @param {*} decimals
 * @returns
 */
export const parseNumber = (value, decimals = 2) => {
  value = parseFloat(value);
  if (!isFinite(value) || (!value && value !== 0)) return "";
  decimals = decimals != null ? decimals : 2;
  var stringified = Math.abs(value).toFixed(decimals);
  var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  var i = _int.length % 3;
  var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? "," : "") : "";
  var _float = decimals ? stringified.slice(-1 - decimals) : "";
  var sign = value < 0 ? "-" : "";
  return parseFloat(
    sign + head + _int.slice(i).replace(/(\d{3})(?=\d)/g, "$1,") + _float
  );
};
/**
 * @description 格式化时间
 * @param time
 * @param cFormat
 * @returns {string|null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }

    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }

    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  return format.replace(/{([ymdhisa])+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
}

/**
 * @description 格式化时间精准到几秒
 * @param timestamp
 * @returns {*}
 */
export const parseDate = (timestamp) => {
  //    時間差 = 現在時間-過去時間
  const time = Date.now() - new Date(timestamp);
  /*
    1秒 1000
    1分鐘 1000 * 60 60000
    1小時 1000 * 60 * 60 3600000
    1日 1000 * 60 * 60 * 24 86400000
    1月 1000 * 60 * 60 * 24 * 30 2592000000
    1年 1000 * 60 * 60 * 24 * 365 31536000000
  */

  const times = [31536000000, 2592000000, 86400000, 3600000, 60000, 1000];
  const units = [
    translate(" years ago"),
    translate(" months ago"),
    translate(" days ago"),
    translate(" hours ago"),
    translate(" minutes ago"),
    translate(" seconds ago"),
  ];
  for (let i = 0; i < times.length; i++) {
    const res = time / times[i];
    if (res >= 1) {
      return Math.round(res) + units[i];
    }
  }
};
