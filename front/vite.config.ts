import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue'

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
  ],

  //服务器配置
  server: {
    open: "/", // 浏览器自动打开 关闭false
    strictPort: true, //端口占用，自动尝试下一个端口
    //代理配置
    proxy: {
      "/demo": {
        target: "http://121.40.108.95:8080", // api接口代理,
        changeOrigin: true,
      },
    },
    hmr: {
      overlay: false, //报错不显示在页面上
    },
  },
})
