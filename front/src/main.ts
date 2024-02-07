import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from "./router";
// ant-design-vue
import 'ant-design-vue/dist/reset.css';
import * as Icons from '@ant-design/icons-vue';

import http from './util/http';
import Utils from './util/utils';

const res = await http.get("/demo/station/list.json");
if (res && res.data && res.data.status === 200) {
  const stationList = res.data.data.map((station, index) => {
    return {
      stationId: station.id,
      name: station.name,
      color: Utils.colorList[index]
    }
  });
  Utils.stationList = stationList;

}

await Utils.getEquipTypeList();

const app = createApp(App);
for (const i in Icons) {
  // 全局注册一下组件
  app.component(i, Icons[i])
}

app.use(router);

app.mount('#app');