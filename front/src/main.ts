import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from "./router";
// ant-design-vue
import 'ant-design-vue/dist/reset.css';
import * as Icons from '@ant-design/icons-vue';

const app = createApp(App);
for (const i in Icons) {
    // 全局注册一下组件
    app.component(i, Icons[i])
}

app.use(router);

app.mount('#app');