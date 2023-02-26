// import router from "@/index";
// import { usePlayerStore } from "@/store/modules/player";
// import { useRoutesStore } from "@/store/modules/routes";
// import { asyncRoutes, constantRoutes, resetRouter } from "@/router";
import { settings } from "@/config";
import { gp } from "@gp";
// import { useSettingsStore } from "@/store/modules/settings";
// import { useHeaderInfosStore } from "@/store/modules/headerInfos";
// import { getItem } from "@/utils/storage";
// import { guestInit } from "@vab/plugins/websockets";

/**
 * @description 路由中間件
 * @author godfrey yxw770@gmail.com
 * @date 2023/24/02
 * @export
 * @param {*} router
 */
export function setupPermissions(router) {
  router.beforeEach(async (to, from, next) => {
    // const { token, getUserInfo } = usePlayerStore();
    // const { getWebsiteSettings, selectDownloadUrl } = useSettingsStore();
    //初始化網站設定信息
    // let website_config = getItem("website_config");
    let flag = 0;
    console.log(router.options.routes);
    next();
    return;
    // if (
    //   !(
    //     website_config &&
    //     website_config != "undefined" &&
    //     JSON.parse(website_config)["version_timestamp"]
    //   )
    // ) {
    //   flag = 1;
    //   await getWebsiteSettings(true);
    // } else {
    //   getWebsiteSettings();
    // }
    /*   const headerStore = useHeaderInfosStore();

    headerStore.init();
    if (flag) {
      await selectDownloadUrl();
    } else {
      selectDownloadUrl();
    } */
    let hasToken = token;
    //未啟動登錄攔截則token存在
    if (!loginInterception) hasToken = true;
    // console.log(routes.length, 3333);
    // hasToken = true;
    // console.log(hasToken == "null", 88888);
    if (hasToken && hasToken != "null") {
      //已登錄狀態

      if (routes.length) {
        next();
      } else {
        try {
          await getUserInfo();
          await setRoutes(authentication);
          next({ ...to, replace: true });
        } catch (err) {
          console.error("錯誤攔截:", err);
          let code = err.code;
          let whiteCodeList = [70003, 70004, 70007];
          if (code && whiteCodeList.includes(code)) {
            next({ path: "/" });
          } else {
            next({ path: "/404" });
          }

          // if ((JSON.parse(err).code = 70003)) {
          //   next({ path: "/" });
          // } else {
          //   next({ path: "/404" });
          // }
          // await resetAll();
        }
      }
    } else {
      //未登錄狀態
      let flag = 0;
      routesWhiteList.forEach((item) => {
        if (item.indexOf(":") != -1) {
          //動態路由
          let new_path = item.replace("/", "\\/");
          new_path = new_path.replace(/(:[A-Za-z0-9]+)/g, "([^/]+?)\\/?");
          let pattern = "^" + new_path + "$";
          var r = new RegExp(pattern);
          if (r.test(to.path)) {
            flag = 1;
          }
        } else if (item == to.path) {
          flag = 1;
        }
      });
      if (flag == 1) {
        // 設定遊客路由（不需要可以删除）
        if (supportVisit && !routes.length) {
          next({ path: to.path, replace: true });
        } else {
          guestInit();
          next();
        }
      } else {
        gp.$baseMessage("請您先登錄", "error");
        next({ path: from.path });
      }
    }
  });
  router.afterEach((to) => {
    const setting = useSettingsStore();
    if (typeof to.meta.title !== "undefined") {
      let pageTitle = to.meta.title + " - " + setting.seo_title;
      document.title = pageTitle;
    }
  });
}
