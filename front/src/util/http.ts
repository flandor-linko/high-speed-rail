import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
axios.defaults.withCredentials = true; //允许跨域携带cookie信息
axios.defaults.timeout = 10000; //请求超时
// 创建axios实例
let http = axios.create({
  baseURL: "", // api的base_url   import.meta.env.VITE_APP_BASE_API,
});

export default http;
