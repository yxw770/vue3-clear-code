/**
 * @description 全局插件工具庫
 */

import Toast, { useToast } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
// import { useLoaderStore } from "@/store/modules/loader";
import { useViewStore } from "@/store/modules/view";

export let gp = {};

export function setupPlugin(app) {

  const options = {
    // You can set your default options here
    showCloseButtonOnHover: true,
  };
  app.use(Toast, options);
  const toast = useToast();
  /**
   * @description 信息彈窗
   * @author godfrey yxw770@gmail.com
   * @param {*} message
   * @param {string} [type="info"] success, error, default, info and warning
   */
  const $baseMessage = (message, type = "info", timeout = 5000) => {
    // or with options

    // console.log(type);
    toast(message, { type: type, timeout: timeout });
  };

  const view = useViewStore();
  /**
   * @description 加載層
   * @author godfrey yxw770@gmail.com
   * @param {string} [state=true]
   */
  const $baseLoading = (state = true) => {
    view.setLoaderStatus(state);
  };

  const $returnFloat = (value) => {
    let value1 = Math.round(parseFloat(value) * 100) / 100;
    let xsd = value1.toString().split(".");
    if (xsd.length == 1) {
      value1 = value1.toString() + ".00";
      return value1;
    }
    if (xsd.length > 1) {
      if (xsd[1].length < 2) {
        value1 = value1.toString() + "0";
      }
      return value1;
    }
  };

  const $pingTest = (url) => {

    var request_image = function (url) {
      // var reg = new RegExp('(http|https)://[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\\.?', 'g');
      // var ret = reg.exec(url)
      // if (ret == null) {
      //   reject(url);
      //   return;
      // }
      // console.log(ret, 'reg')

      return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () { resolve(img); };

        img.onerror = function () { reject(url); };
        img.src = url + '?random-no-cache=' + Math.floor((1 + Math.random()) * 0x10000).toString(16);
      });
    };
    return new Promise(function (resolve, reject) {
      var start = (new Date()).getTime();
      var response = function () {

        var delta = ((new Date()).getTime() - start);
        delta *= 1;

        resolve([delta, url]);
      };
      request_image(url).then(response)
      // request_image(url).then(response).catch(response);
      // Set a timeout for max-pings, 5s.
      setTimeout(function () { reject(Error('Timeout')); }, 5000);
    })
    // .then(function (result) {
    //   return result;
    // }).catch(function () {
    //   return 9999;
    // });
  }

  const $arraySort = (array, type = "asc") => {

    return array.sort((n1, n2) => {
      if (type == 'asc') {
        return n1 - n2;
      } else {
        return n2 - n1;

      }
    });
  }
  //初始化音樂組件
  let audio = null;
  const $AudioPlay = (path, volume = 1, need_reset = true) => {
    // const path = require("../../assets/music/case-tick.mp3");
    if (audio != null && need_reset) {
      audio.pause();
      audio = null;
    }
    audio = new Audio(path);
    audio.volume = volume;
    audio.play();
    // const audio = new Audio();
    // audio.src = "./assets/sound/open.mp3";
    // audio.loop = true;
    // audio.play();
  };
  app.provide("$arraySort", $arraySort);
  app.provide("$baseMessage", $baseMessage);
  app.provide("$baseLoading", $baseLoading);
  app.provide("$returnFloat", $returnFloat);
  app.provide("$pingTest", $pingTest);
  app.provide("$AudioPlay", $AudioPlay);

  gp.$arraySort = $arraySort;
  gp.$pingTest = $pingTest;
  gp.$returnFloat = $returnFloat;
  gp.$baseMessage = $baseMessage;
  gp.$baseLoading = $baseLoading;
  gp.$AudioPlay = $AudioPlay;
}
