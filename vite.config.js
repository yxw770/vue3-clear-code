import { fileURLToPath, URL } from "node:url";
const { resolve } = require("path");

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
//https://blog.csdn.net/Old_Soldier/article/details/127192862
import viteCompression from "vite-plugin-compression";
import visualizer from "rollup-plugin-visualizer";
import VitePluginHtmlEnv from "vite-plugin-html-env";
// https://vitejs.dev/config/
export default defineConfig({
  base: "./", // 设置打包路径
  publicDir: "public", // 静态资源服务的文件夹
  cacheDir: "node_modules/.vite", // 存储缓存文件的目录
  plugins: [
    vue(),
    // 压缩
    viteCompression({
      threshold: 1024000, // 对大于 1mb 的文件进行压缩
    }),
    // 打包分析
    visualizer({
      emitFile: false, //是否被触摸
      filename: "test.html", //生成分析网页文件名
      open: true, //在默认用户代理中打开生成的文件
      gzipSize: true, //从源代码中收集 gzip 大小并将其显示在图表中
      brotliSize: true, //从源代码中收集 brotli 大小并将其显示在图表中
    }),
    VitePluginHtmlEnv({
      compiler: true,
      // compiler: false // old
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],

      imports: ["vue", "vue-router", "pinia"],
      // resolvers: [ElementPlusResolver({ importStyle: false })],
      dts: "library/build/vuePlugins/unplugin/auto-imports.d.ts",
      eslintrc: {
        enabled: false, // Default `false`
        filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": resolve(__dirname, "."),
      "@vab": resolve(__dirname, "library"),
      "@gp": resolve("library/plugins/gp"),
    },
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
