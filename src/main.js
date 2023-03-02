import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueClipboard } from "@soerenmartius/vue3-clipboard";
import VueLazyLoad from "vue3-lazyload";
import setupPlugin from "../library/plugins/gp";
import { setupI18n } from "./i18n";
import App from "./App.vue";
// import i18n from "./language/i18n";

//import "./assets/main.css";
import "./assets/scss/main.scss";

import Vue3Toasity from "vue3-toastify";
import "@/assets/scss/toastify/index.scss";

import components from "~/library/components/index.js";
import { setupStore } from "./store";
import { setupRouter } from "./router";
import {setupWebsocket} from "@vab/plugins/websockets";
const app = createApp(App);

//初始化緩存
setupStore(app);
//初始化國際化
setupI18n(app);
//初始化複製插件
setupPlugin(app);
//初始化路由
setupRouter(app);

app.use(VueClipboard);

app.use(VueLazyLoad);
app.use(components);
app.use(Vue3Toasity);
app.mount("#app");
//初始化webSocket
setupWebsocket(app)