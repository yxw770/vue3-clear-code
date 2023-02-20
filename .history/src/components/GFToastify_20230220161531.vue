<template>
  <div class="toastify-container">
    <div class="status">error</div>
    <div class="hexagon"></div>
    <div class="text">Promocode not found.</div>

  </div>
</template>

<script>

export default defineComponent({
  name: 'ToastifyBox',
  components: {

  },
  props: {
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

<style lang="scss" scoped>
.toastify-container {
  position: relative;
}

.hexagon {
  width: 73px;
  height: 78px;
  position: absolute;
  top: -30%;
  bottom: 0;
  left: -88px;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>