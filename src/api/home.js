import request from "@/utils/request";
/**
 * 獲取盲盒列表
 */
export function getBlindBox() {
  return request({
    url: "/getBlindBox",
    method: "get",
  });
}
/**
 * 獲取頂部信息
 */
export function getHeaderInfos() {
  return request({
    url: "/home/getHeaderInfos",
    method: "get",
  });
}
