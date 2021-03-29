/* eslint-disable no-undef */
import { Notification } from "element-ui";
// import axios from "axios";
import qs from "qs";
import { token } from "@utils/index"; // removeStorage
// import router from "@/router";

axios.interceptors.request.use((req) => {
	if (!req.url.includes("thirdpartyController")) {
		req.headers.Authorization = token();
		req.headers.ApiKey = "QahEUxu30WC09JJpRPFSsssiEHyHzPdV";
	}
	if (req.method == "post") {
		if ("params" in req.data && Object.keys(req.data.params).length !== 0) {
			let obj = req.data.params;
			req.data.params = JSON.stringify(obj);
		}
		req.data =
			req.data instanceof FormData ? req.data : qs.stringify(req.data);
	}
	if ((req.method === "get" || req.method === "delete") && req.params) {
		let url = req.url;
		url += "?";
		let keys = Object.keys(req.params);
		for (let key of keys) {
			url += `${key}=${encodeURIComponent(req.params[key])}&`; // 避开axios转码，单独转码
		}
		url = url.substring(0, url.length - 1);
		req.params = {};
		req.url = url;
	}
	return req;
});
let firstError = true;
axios.interceptors.response.use(
	(res) => {
		const url = res.config.url, data = res.data;
		if (Object.prototype.toString.call(data) === "[object Object]") {
			if (
				("code" in data &&
					data.code !== 200 &&
					!url.includes("refresh_device_info") &&
					!url.includes("file_pages")) ||
				("success" in data && !data.success) ||
				("statusCode" in data && data.statusCode == 2001 && firstError)
			) {
				Notification({
					type: `error`,
					title: "提示",
					message: data.msg,
					customClass: "zZindex",
				});
				firstError = false;
			}
		}
		if (url.includes("printManage/download")) {
			return res;
		}
		return data;
	},
	(err) => {
		let url = JSON.parse(JSON.stringify(err)).config.url;
		if (
			!url.includes("printManage/fileUpload") &&
			!url.includes("print/file_pages") && 
			!url.includes("print/job") && 
			!url.includes("delTempImg")
		) {
			Notification({
				type: `error`,
				title: "提示",
				message: "网络或服务器异常",
				customClass: "zZindex",
			});
		}
		return err;
	}
);
const productionBase = "http://106.59.192.215:8080";
const http = {
	get(url, data, headers = {}) {
		return axios.get(
			url,
			{ params: { ...data, time: new Date().getTime() } },
			headers
		);
	},
	post(url, data, headers = {}) {
		return axios.post(url, data, headers);
	},
	del(url, data) {
		return axios.delete(url, { params: data });
	},
	base() {
		return process.env.NODE_ENV === "production"
			? productionBase + "/jplat-file-client/"
			: "jplat-file-client/";
	},
	baseUrl() {
		return productionBase;
	},
};

export default http;
