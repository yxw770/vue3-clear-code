import GFToastify from "@/components/GFToastify.vue";
import {toast} from "vue3-toastify";
import {getItem} from "@/utils/storage";
import {isJson} from "@/utils/validate";
import {parseMoney, parseNumber, parseTime} from "@/utils";

export let gp = {};

export default function setupPlugin(app) {
    gp = {
        /**
         * @description 全局Message
         * @param {string} message 内容
         * @param {string} type 类型 info,success,error,warning
         *  @param {string} title 标题
         * @param {number|boolean} autoClose 是否自动关闭時間 默认false
         * @param {boolean} hideProgressBar 是否隐藏进度条
         */
        $baseMessage: (
            message,
            type = "info",
            title = null,
            autoClose = false,
            hideProgressBar = true
        ) => {
            toast(GFToastify, {
                theme: "diy",
                icon: false,
                data: {
                    msg: message,
                    title: title,
                },
                type: type,
                autoClose: autoClose,
                dangerouslyHTMLString: true, // can override the global option
                hideProgressBar: hideProgressBar,
            });
        },
        /**
         * @description ping测试
         * @param url
         * @returns {Promise<unknown>}
         */
        $pingTest: (url) => {

            const request_image = function (url) {
                return new Promise(function (resolve, reject) {
                    const img = new Image();
                    img.onload = function () {
                        resolve(img);
                    };
                    img.onerror = function () {
                        reject(url);
                    };
                    img.src = url + '?random-no-cache=' + Math.floor((1 + Math.random()) * 0x10000).toString(16);
                });
            };
            return new Promise(function (resolve, reject) {
                const start = (new Date()).getTime();
                const response = function () {

                    var delta = ((new Date()).getTime() - start);
                    delta *= 1;

                    resolve([delta, url]);
                };
                request_image(url).then(response)
                setTimeout(function () {
                    reject(Error('Timeout'));
                }, 5000);
            })
        },
        /**
         * 獲取圖片地址
         * @param url
         * @param broken_id
         * @returns {*}
         */
        $Img(url, broken_id = 1) {
            if (!url) {
                return require('@/assets/images/common/loading-fair.svg')
            }
            if (url.indexOf("http") !== -1) {
                return url;
            }
            const value = getItem("setting_storage_download_url");
            const storage_download_url = value && isJson(value) ? JSON.parse(value)['storage_download_url'] : '';
            //獲取img 訪問地址
            if (storage_download_url.indexOf("http") === -1) {
                return require('@/assets/images/common/loading-fair.svg')
            }
            return storage_download_url.replace(
                /{\$filepath}/i,
                url
            );
        },
        /**
         * @description 获取steamID32
         * @param steamID64
         * @returns {number}
         */
        $getSteamId32: (steamID64) => {
            return Number(('' + steamID64).slice(-16, 17)) - 6561197960265728
        },
        /**
         * @description 格式化时间
         * @param time 时间戳
         * @param cFormat 格式
         * @returns {string|null}
         */
        $Time: (time, cFormat) => {
            return parseTime(time, cFormat)
        },
        /**
         *  格式化數字
         * @param {*} value 值
         * @param {*} decimals 保留小數位
         * @returns
         */
        $N: (value, decimals) => {
            return parseNumber(value, decimals)
        },
      /**
       * 金錢處理
       * @param {*} value    金額
       * @param {*} decimals 小數位數
       * @returns 金額
       */
      $M: (value, decimals) => {
        return parseMoney(value, decimals)
      }
    };

    Object.keys(gp).forEach((key) => {
        app.provide(key, gp[key]);
        app.config.globalProperties[key] = gp[key];
    });
}
