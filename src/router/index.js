import { createRouter, createWebHistory } from "vue-router";
import { setupPermissions } from "./baseMiddleware";
// 默認路由
export const constantRoutes = [
  {
    //主页
    path: "/",
    name: "index",
    component: () => import("@/views/home/Enter.vue"),
  },

  {
    path: "/:pathMatch(.*)",
    name: "error page",
    component: () => import("@/views/common/error/404.vue"),
    meta: {
      title: "404",
    },
  },
];
// 異步路由
export const asyncRoutes = [
  // {
  //   //callback
  //   path: "/callback",
  //   name: "callback",
  //   component: callback,
  // },
  // {
  //   //callback
  //   path: "/p/:promoCode",
  //   name: "Invite",
  //   component: invite,
  // },
  // {
  //   //个人信息
  //   path: "/profile/:id",
  //   name: "profile",
  //   meta: {
  //     title: "Profile",
  //   },
  //   component: profile,
  // },
];
// 路由實例
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
});
/**
 * @description 添加路由規則
 * @author godfrey yxw770@gmail.com
 * @param {*} routes
 */

function addRouter(routes) {
  routes.forEach((route) => {
    if (!router.hasRoute(route.name)) router.addRoute(route);
    if (route.children) addRouter(route.children);
  });
}
/**
 * @description 重置路由
 * @author godfrey yxw770@gmail.com
 * @export
 * @param {*} [routes=constantRoutes]
 */
export function resetRouter(routes = constantRoutes) {
  routes.map((route) => {
    if (route.children) {
      route.children = fatteningRoutes(route.children);
    }
  });
  router.getRoutes().forEach((route) => {
    const routeName = route["name"];
    router.hasRoute(routeName) && router.removeRoute(routeName);
  });

  addRouter(routes);
  // console.log(JSON.stringify(routes));
}

function fatteningRoutes(routes) {
  return routes.flatMap((route) => {
    return route.children ? fatteningRoutes(route.children) : route;
  });
}
/**
 * @description 設定路由中間件
 * @author godfrey yxw770@gmail.com
 * @export
 * @param {*} app
 * @return {*}
 */
export function setupRouter(app) {
  // addRouter(asyncRoutes);
  resetRouter([...constantRoutes, ...asyncRoutes]);
  setupPermissions(router);
  app.use(router);

  return router;
}
export default router;
