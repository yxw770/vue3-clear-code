/**
 * @description 导出通用配置
 */
export const settingConifgs = {
  // 标题是否反转
  // 如果为false: "page - title"
  // 如果为ture : "title - page"
  titleReverse: false,
  // 缓存路由的最大数量
  keepAliveMaxNum: 20,
  // 不经过token校验的路由，白名单路由建议配置到与login页面同级，如果需要放行带传参的页面，请使用query传参，配置时只配置path即可
  routesWhiteList: [
    "/",
    "/home",

    "/roll",
    "/roll/active",
    "/roll/finish",
    "/roll/info/:id",
    "/p/:promoCode",
    "/profile/:id",
    "/upgrade",
    "/top-drops",
    "/partner",
    "/cases/open",

    "/battles",
    "/battles/view/:uid",

    "/A/faq",
    "/A/privacy",
    "/A/tos",
    "/A/cardholders-agreement",

    "/404",
    "/403",
    "/callback",
  ],
  // token名称
  tokenName: "token",
  // token在localStorage、sessionStorage、cookie存储的key的名称
  tokenTableName: "godfrey",
  // token存储位置localStorage sessionStorage cookie
  storage: "localStorage",
  // token失效回退到登录页时是否记录本次的路由（是否记录当前tab页）
  recordRoute: true,
  // 是否开启logo，不显示时设置false，请填写src/icon路径下的图标名称
  // 如需使用内置RemixIcon图标，请自行去logo组件切换注释代码(内置svg雪碧图较大，对性能有一定影响)
  logo: "vuejs-fill",
  // 语言类型zh-hk、en
  language: "zh-CN",
  // 消息框消失时间
  messageDuration: 3000,
  // 在哪些环境下显示高亮错误 ['development', 'production']
  errorLog: "development",
  // 是否开启登录拦截
  loginInterception: true,
  // intelligence(前端导出路由)和all(后端导出路由)两种方式
  authentication: "intelligence",
  // 是否支持游客模式，支持情况下，访问白名单，可查看所有asyncRoutes
  supportVisit: false,
  // 是否开启roles字段进行角色权限控制(如果是all模式后端完全处理角色并进行json组装，可设置false不处理路由中的roles字段)
  rolesControl: true,
};
