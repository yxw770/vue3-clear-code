 

<template>
  <div>

    <button
      @click="($event) => { closeToast && closeToast($event) }"
    >
      Click me to close toast
    </button>
  </div>
</template>

<template>
  <div class="toastify-container">
    <p>I am a vue component</p>
    <p>Position: {{ toastProps?.position }}</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { ToastOptions } from 'vue3-toastify';

export default defineComponent({
  name: 'ToastifyBox',
  components: {

  },
  props: {
    closeToast: MouseEvent,
    toastProps: ToastOptions,
  },
});
</script>

<script setup>

/*****************  動態變量集  start   *****************/

/*****************  動態變量集   end    *****************/

/*****************   生命週期   start   *****************/

/*****************   生命週期    end    *****************/

/*****************     程式     start   *****************/

/*****************     程式      end    *****************/

/*****************     監聽     start   *****************/

/*****************     監聽      end    *****************/
</script>

<style lang="scss" scoped></style>