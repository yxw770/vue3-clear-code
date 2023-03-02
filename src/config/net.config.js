/**
 * @description 导出网络配置
 **/
export const newConfigs = {
  // 默认的接口地址，开发环境和生产环境都会走/vab-mock-server
  // 正式项目可以选择自己配置成需要的接口地址，如"https://api.xxx.com"
  // 问号后边代表开发环境，冒号后边代表生产环境107.182.28.123 cases.godfreyg.com

  baseURL: import.meta.env.VITE_API_BASE_URL,
  // 基礎header認證
  apikey: import.meta.env.VITE_API_KEY,
  // websocket連接地址
  socketHost: import.meta.env.VITE_SOCKET_HOST,
  // websocket連接端口
  socketPort: import.meta.env.VITE_SOCKET_PORT,
  // websocket連接密鑰
  socketKey: import.meta.env.VITE_SOCKET_KEY,
  // websocket連接密鑰
  socketSecret: import.meta.env.VITE_SOCKET_SECRET,

  // 配后端数据的接收方式application/json;charset=UTF-8 或 application/x-www-form-urlencoded;charset=UTF-8
  contentType: "application/json;charset=UTF-8",
  // 最长请求时间
  requestTimeout: 10000,
  // 操作正常code，支持String、Array、int多种类型
  successCode: [1, 200,  3, "200"],
  // 数据状态的字段名称
  statusName: "code",
  // 状态信息的字段名称
  messageName: "msg",

  // 需要加loading层的请求，防止重复提交
  debounce: [
    "/auth/steamLogin",
    "/player/setPromoCode",
    // "/wallet/getRechargeOrder",
    "/roll/joinRollRoom",
    "/player/saveInfo",
    "/player/resendEmail",
    "/bag/item/take",
    "/bag/item/sellAll",
    "/bag/items/sell",
    "/partner/changePromoCode",
    "/partner/withdrawToBalance",
    "/battle/room/joined",
    "/battle/room/leave",
  ],
};
// console.log(process.env.NODE_ENV);
