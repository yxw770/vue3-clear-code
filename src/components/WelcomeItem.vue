<style scoped>
  .item {
    margin-top: 2rem;
    display: flex;
  }

  .details {
    flex: 1;
    margin-left: 1rem;
  }

  i {
    display: flex;
    place-items: center;
    place-content: center;
    width: 32px;
    height: 32px;
    color: var(--color-text);
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 0.4rem;
    color: var(--color-heading);
  }

  @media (min-width: 1024px) {
    .item {
      margin-top: 0;
      padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
    }

    i {
      top: calc(50% - 25px);
      left: -26px;
      position: absolute;
      border: 1px solid var(--color-border);
      background: var(--color-background);
      border-radius: 8px;
      width: 50px;
      height: 50px;
    }

    .item:before {
      content: " ";
      border-left: 1px solid var(--color-border);
      position: absolute;
      left: 0;
      bottom: calc(50% + 25px);
      height: calc(50% - 25px);
    }

    .item:after {
      content: " ";
      border-left: 1px solid var(--color-border);
      position: absolute;
      left: 0;
      top: calc(50% + 25px);
      height: calc(50% - 25px);
    }

    .item:first-of-type:before {
      display: none;
    }

    .item:last-of-type:after {
      display: none;
    }
  }
</style>

<template>
  <div class="item">
    <i>
      <slot name="icon"></slot>
    </i>
    <div class="details">
      <h3>
        <slot name="heading"></slot>
      </h3>
      <button @click="notify">88888</button>
      <LoadingSpinner></LoadingSpinner>
      <Dialog :model-value="false" my-class="test">
        <template #header>
          <h3>123123123</h3>
        </template>
        <template #default>
          <p>123123123</p>
        </template>
      </Dialog>
      <div class="box">
        这里显示图片{{$getSteamId32('76561198862727903')}}
        <LazyLoad
          :url="$Img('storage/upload/62ee932d6cb7e/62ee932d6cb81.png')"
          my-class="box-img"
        >
          <template #loading>loading</template>
        </LazyLoad>
      </div>
      <Auth>
        <template #login>
          <div class="login">
            <button> 登录按钮</button>
          </div>
        </template>
        <template #default>
          <div class="user">
            <p>用户名：xxxxx</p>
          </div>
        </template>
      </Auth>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  // import VueDatePicker from "@vuepic/vue-datepicker";
  // import "@vuepic/vue-datepicker/dist/main.css";
  export default defineComponent({
    name: "",
    components: {
      // VueDatePicker,
    },
  });
</script>

<script setup>
  import GFToastify from "./GFToastify.vue";
  import { toast } from "vue3-toastify";
  import { gp } from "@gp";
  import {getList} from "@/api/test";
  import {useSettingsStore} from "@/store/modules/settings";
  const settingsStore = useSettingsStore();
  settingsStore.getWebsiteSettings()
  const notify = () => {
    gp.$baseMessage("123", import.meta.env.VITE_TEST, "warning", 1000);
    /*toast.warning(GFToastify, {
    theme: 'diy',
    icon: false,
    autoClose: 80000,
    dangerouslyHTMLString: true, // can override the global option
    hideProgressBar: true,
  }); // ToastOptions
  toast.info(GFToastify, {
    theme: 'diy',
    icon: false,
    data: {
      msg: '123123123',
      title: '标题'
    },
    autoClose: 80000,
    dangerouslyHTMLString: true, // can override the global option
    hideProgressBar: true,
  }); // ToastOptions
*/
    // toast(`
    //     <div class="notification noty_body">
    //           <div class="status">error</div>
    //           <div class="hexagon"></div>
    //           <div class="text">Promocode not found.</div>
    //           </div> `, {
    //   dangerouslyHTMLString: true, // can override the global option
    // });
  };
  const doLogin = async (username, password) => {
    // 设置状态为等待
    return await new Promise(function (resolve, reject) {
      setTimeout(() => {
        if (username == "admin" && password == "123456") {
          resolve("登录成功");
        } else {
          reject("登录失败");
        }
      }, 2000);
    });
  };

  const login = async () => {
    const username = "admin";
    const password = "123456";
    const res = await doLogin(username, password);
    gp.$baseMessage("提示", res, "success", 3000);
  };
  login();
</script>

<style lang="scss" scoped>
  .box {
    width: 300px;
    height: 300px;
    border: 1px solid red;
    position: relative;
  }
  :deep(.box) {
    .box-img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: contain;
    }
  }
</style>
