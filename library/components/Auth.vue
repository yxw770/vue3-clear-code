<template>
  <div class="auth-container">
    <slot v-if="getStatus == 2"></slot>
    <slot name="login" v-else></slot>
  </div>
</template>

<script>

export default defineComponent({
  // 权限组件
  name: 'Auth',
  components: {},
});
</script>

<script setup>

import {usePlayerStore} from "@/store/modules/player";

/*****************  外部變量集  start   *****************/
const playerStore = usePlayerStore();
/*****************  外部變量集   end    *****************/

/*****************  動態變量集  start   *****************/

/*****************  動態變量集   end    *****************/

/*****************   生命週期   start   *****************/

/*****************   生命週期    end    *****************/

/*****************     程式     start   *****************/
const getStatus = computed(() => {
  // 1. 未登录
  // 2. 已登录
  if (playerStore.token) {
    return 2;
  } else {
    return 1;
  }
});
/*****************     程式      end    *****************/

/*****************     監聽     start   *****************/

/*****************     監聽      end    *****************/
</script>

<style lang="scss" scoped>

</style>