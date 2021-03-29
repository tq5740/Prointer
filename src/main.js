/* eslint-disable no-undef */
// import Vue from "vue";
import router from "@/router";
import App from "@/App.vue";
import api from "@/api/http";
import all from "@/api/allApi";
import "@css/reset.scss";
import { Notification, Loading, MessageBox } from "element-ui";
import { setStorage, getStorage, removeStorage } from "@utils/index";
import commonData from "./store/commonData";

Vue.use(Loading.directive);

Vue.config.productionTip = false;
Vue.prototype.$axios = api;
Vue.prototype.$api = all;
Vue.prototype.$Notif = Notification;
Vue.prototype.$Loading = Loading.service;
Vue.prototype.$MessageBox = MessageBox;
Vue.prototype.$SetStorage = setStorage; // 设置缓存
Vue.prototype.$GetStorage = getStorage; // 获取缓存
Vue.prototype.$RemoveStorage = removeStorage; // 清除缓存
Vue.prototype.$commonData = commonData;

new Vue({
	render: (h) => h(App),
	router,
}).$mount("#app");

if (!!window.ActiveXObject || "ActiveXObject" in window) {
	setStorage("isIE", true);
}
