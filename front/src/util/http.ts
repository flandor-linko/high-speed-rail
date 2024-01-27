import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
axios.defaults.withCredentials = true; //允许跨域携带cookie信息
axios.defaults.timeout = 120000; //请求超时
// 创建axios实例
let http = axios.create({
  baseURL: "", // api的base_url   import.meta.env.VITE_APP_BASE_API,
});

http.interceptors.request.use(function (config) {
  if (config.url.indexOf("/demo") > -1) {
    config.url.slice(config.url.indexOf("/demo") + 5, config.url.Length);
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

export default http;
