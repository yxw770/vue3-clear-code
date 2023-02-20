const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

module.exports = {
  createUnPlugin: () => [
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      resolvers: [ElementPlusResolver({ importStyle: false })],
      dts: "library/build/vuePlugins/unplugin/auto-imports.d.ts",
    }),
    // Components({
    //   dirs: ["library/components"],
    //   resolvers: [ElementPlusResolver()],
    //   dts: "library/build/vuePlugins/unplugin/components.d.ts",
    // }),
  ],
};
