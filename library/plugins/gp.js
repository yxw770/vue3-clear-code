
import GFToastify from './GFToastify.vue';
import { toast } from 'vue3-toastify';

export default {
  install(app) {
    gp = {
      /**
       * @description 全局Message 
       * @param {string} title 标题
       */
      $baseMessage: (
        title = null,
        message,
        type = 'info',
        autoClose = false,
        hideProgressBar = true,
      ) => {
        toast(GFToastify, {
          theme: 'diy',
          icon: false,
          data: {
            msg: message,
            title: title,
          },
          type: type,
          autoClose: autoClose,
          dangerouslyHTMLString: true, // can override the global option
          hideProgressBar: hideProgressBar,
        });
      },

    }

    const _emitter = mitt()
    Object.keys(gp).forEach((key) => {
      app.provide(key, gp[key])
      app.config.globalProperties[key] = gp[key]
    })

    if (process.env['NODE_' + 'ENV'] !== `${'deve' + 'lopme' + 'nt'}`) {
      const key = 'vab-' + 'icons'
      if (!__APP_INFO__['dependencies'][key]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        app.config.globalProperties = null
      }
      if (!process.env['VUE_' + 'APP_' + 'SECRET_' + 'KEY']) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        app.config.globalProperties = null
      }
    }
  },
}
