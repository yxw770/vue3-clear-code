// context 函数会返回一个 导入函数 importFn
// 他有一个属性 keys() 获取所有的文件路径
// 通过文件路径数组，通过数组遍历，在使用 importFn 根据路径导入组件对象
// 遍历同时进行全局注册

// context （目标路径，是否加载子目录，加载文件的匹配正则）
const importFn = import.meta.globEager("./*.vue");
// 注册全局组件 将来这样的组件建议在vue 插件中定义

export default {
  install(app) {
    //  把这个组件设置为全局指令
    // console.dir(importFn.keys()) 文件名称数组
    Object.keys(importFn).forEach((key) => {
      // 导入组件
      const component = importFn[key].default;
      // 注册
      app.component(component.name, component);
    });
  },
};
