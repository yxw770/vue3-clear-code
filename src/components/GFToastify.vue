<template>
  <div class="toastify-container">
    <div class="status">{{ getStatus }}</div>
    <div class="hexagon"></div>
    <div class="text">{{ props.toastProps.data.msg ?? '' }}</div>

  </div>
</template>

<script>

export default defineComponent({
  name: 'ToastifyBox',
  components: {

  },

});
</script>

<script setup>
// import { ToastOptions } from 'vue3-toastify';

import { reactive } from 'vue';
const props = defineProps({
  toastProps: {
    default: {},
  },
})
/*****************  動態變量集  start   *****************/

const statusEnum = {
  'info': 'Info',
  'success': 'Success',
  'warning': 'Warning',
  'error': 'Error',
}
console.log(props.toastProps.data.msg)
const getStatus = computed(() => {
  if (props.toastProps?.data?.title) {
    return props.toastProps.data.title;
  } else {

    return statusEnum[props.toastProps?.type] ?? 'Info';
  }
})
/*****************  動態變量集   end    *****************/

/*****************   生命週期   start   *****************/

/*****************   生命週期    end    *****************/

/*****************     程式     start   *****************/

/*****************     程式      end    *****************/

/*****************     監聽     start   *****************/

/*****************     監聽      end    *****************/
</script>

<style lang="scss" scoped>
.toastify-container {
  position: unset;

}

.hexagon {
  width: 73px;
  height: 78px;
  position: absolute;
  top: 8%;
  bottom: 0;
  left: -36px;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>