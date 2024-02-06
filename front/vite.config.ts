import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    })
  ],

  //服务器配置
  server: {
    open: "/", // 浏览器自动打开 关闭false
    strictPort: true, //端口占用，自动尝试下一个端口
    //代理配置
    proxy: {
      "/demo": {
        target: "http://121.40.108.95:8080/", // api接口代理,
        // target: "http://124.221.249.140:8080/", //
        // target: "http://43.138.44.106:8080/", //
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/demo/, ""),
      },
    },
    hmr: {
      overlay: false, //报错不显示在页面上
    },
  },
})
