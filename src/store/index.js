/**
 * @description 导入所有 pinia 模块
 */

const pinia = createPinia();

export function setupStore(app) {
  app.use(pinia);
}

export default pinia;
