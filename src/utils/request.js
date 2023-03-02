import { usePlayerStore } from "@/store/modules/player";
import axios from "axios";
import { settings } from "@/config";

import qs from "qs";
import router from "@/router";
import { isArray } from "@/utils/validate";
// import { addErrorLog, needErrorLog } from "@vab/plugins/errorLog";
import { refreshToken } from "@/api/auth";

import { gp } from "@gp";
import { getItem } from "./storage";
import { hasLoginInit } from "@vab/plugins/websockets";
import { useSettingsStore } from "@/store/modules/settings";
import { getRefreshToken, getToken } from "@/utils/token";

import { translate } from "@/i18n";
// let loadingInstance;

// let refreshToking = false;

/**
 * 刷新token状态
 */
let refreshStatus = false;

let requests = [];

// 操作正常Code数组
const codeVerificationArray = isArray(settings.successCode)
  ? [...settings.successCode]
  : [...[settings.successCode]];

const CODE_MESSAGE = {
  200: "服務器成功返回請求數據",
  201: "新建或修改數據成功",
  202: "一個請求已經進入後台排隊(異步任務)",
  204: "刪除數據成功",
  400: "發出信息有誤",
  401: "用戶沒有權限(令牌失效、用戶名、密碼錯誤、登錄過期)",
  402: "令牌過期",
  403: "用戶得到授權，但是訪問是被禁止的",
  404: "訪問資源不存在",
  406: "請求格式不可得",
  410: "請求資源被永久刪除，且不會被看到",
  500: "服務器發生錯誤",
  502: "網關錯誤",
  503: "服務不可用，服務器暫時過載或維護",
  50003: "服務不可用，服務器暫時過載或維護",
  504: "網關超時",
};

/**
 * axios请求拦截器配置
 * @param config
 * @returns {any}
 */
const requestConf = (config) => {
  const settingsStore = useSettingsStore();

  const token = getToken();
  config.failReload = config.failReload || false;
  // 规范写法 不可随意自定义
  if (token && token !== "null")
    config.headers["Authorization"] = `Bearer ${token}`;
  config.headers["apikey"] = settings.apikey;
  config.headers["lang"] = (
    settingsStore.getLanguage || settings.language
  ).toLowerCase();
  if (
    config.data &&
    config.headers["Content-Type"] ===
      "application/x-www-form-urlencoded;charset=UTF-8"
  )
    config.data = qs.stringify(config.data);
  /*    if (settings.debounce.some((item) => config.url.includes(item))) {
              gp.$baseLoading();
              loadingInstance = true;
          }*/
  return config;
};

/**
 * 刷新刷新令牌
 * @param config 过期请求配置
 * @returns {any} 返回结果
 */
const tryRefreshToken = async (config) => {
  if (!refreshStatus) {
    refreshStatus = true;
    const old_token = getRefreshToken();
    if (!old_token) {
      return;
    }
    let player = decodeURIComponent(
      encodeURIComponent(window.atob(old_token.split(".")[1]))
    );

    let player_id = JSON.parse(player).sub;
    try {
      const res = await refreshToken({
        player_id: player_id,
        refresh_token: old_token,
      });
      if (!res) {
        refreshStatus = false;

        return;
      }
      let token = res.data?.token || "";
      if (token) {
        const playerStore = usePlayerStore();

        playerStore.setToken(token);
        refreshStatus = false;

        // 已经刷新了token，将所有队列中的请求进行重试
        requests.forEach((cb) => cb(token));
        requests = [];
        hasLoginInit();

        return instance(requestConf(config));
      }
    } catch (error) {
      requests = [];
      console.error("refreshToken error =>", error);
      refreshStatus = false;

      // router.push({ path: "/login", replace: true }).then(() => {  });
    }
  } else {
    return new Promise((resolve) => {
      // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
      requests.push(() => {
        resolve(instance(requestConf(config)));
      });
    });
  }
};

/**
 * axios响应拦截器
 * @param config 请求配置
 * @param data response数据
 * @param status HTTP status
 * @param statusText HTTP status text
 * @returns {Promise<*|*>}
 */
const handleData = async ({ config, data, status, statusText }) => {
  // if (loadingInstance) gp.$baseLoading((loadingInstance = !loadingInstance));

  // 若data.code存在，覆盖默认code
  let code =
    data && data[settings.statusName] ? data[settings.statusName] : status;

  if (codeVerificationArray.indexOf(data[settings.statusName]) + 1) code = 200;

  switch (code) {
    case 200:
      return data;
    case 401:
    case 70003:
    case 60004:
    case 70002:
    case 70007:
    case 70006:
    case 70005:
    case 70008:
      if (getToken()) logout();
      break;
    case 70004:
      return await tryRefreshToken(config);
    case 403:
      router.push({ path: "/403" }).then(() => {});
      break;
  }

  var errMsg = `${
    data && data[messageName]
      ? data[messageName]
      : CODE_MESSAGE[code]
      ? CODE_MESSAGE[code]
      : statusText
  }`;
  // 是否显示高亮错误(与errorHandler钩子触发逻辑一致)
  gp.$baseMessage(errMsg, "error");
  return Promise.reject(data);

  // if (needErrorLog())
  //   addErrorLog({ message: errMsg, stack: data, isRequest: true });
  // return Promise.reject(data);
};

const logout = () => {
  const { resetAll } = usePlayerStore();
  resetAll().then(() => {
    router.push({ path: "/", replace: true }).then(() => {
      gp.$baseMessage(translate("退出成功"), "success");
    });
  });
};

/**
 * @description axios初始化
 */
const instance = axios.create({
  baseURL: settings.baseURL,
  timeout: settings.requestTimeout,
  headers: {
    "Content-Type": settings.contentType,
  },
  retry: 3,
  retryDelay: 3000,
});
/**
 * @description axios请求拦截器
 */
instance.interceptors.request.use(requestConf, (error) => {
  return Promise.reject(error);
});

/**
 * @description axios响应拦截器
 */
instance.interceptors.response.use(
  (response) => {
    return handleData(response);
  },
  (error) => {
    const { response } = error;
    refreshStatus = false;

    if (response === undefined) {
      const config = error.config;
      if (error.message === "cancel request") return {};
      if (!config || !config.retry) {
        /* if (loadingInstance)
                     gp.$baseLoading((loadingInstance = !loadingInstance));*/

        gp.$baseMessage(translate("網絡連接失敗，請稍後重試"), "error");
        return {};
      }
      config.__retryCount = config.__retryCount || 0;
      // 檢查我們是否已經超過了總重試次數
      if (config.__retryCount >= config.retry) {
        // 返回錯誤信息
        /*   if (loadingInstance)
                       gp.$baseLoading((loadingInstance = !loadingInstance));*/
        gp.$baseMessage(translate("網絡連接失敗，請稍後重試"), "error");
        if (config.failReload) {
          setTimeout(() => {
            router.go(0).then(() => {});
          }, 1500);
        }
        return Promise.reject(error);
      }
      // 重試次數+1
      config.__retryCount++;
      //創建延時器等待發送重試請求
      const backoff = new Promise((resolve) => {
        setTimeout(() => {
          return resolve(error);
        }, config.retryDelay || 1);
      });

      // 返回調用AXIOS來重試請求
      return backoff.then(() => {
        return instance(requestConf(config));
      });
    } else {
      return handleData(response);
    }
  }
);

export default instance;
