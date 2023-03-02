<template>
  <div class="spinner">
    <div class="rect1"></div>
    <div class="rect2"></div>
    <div class="rect3"></div>
    <div class="rect4"></div>
    <div class="rect5"></div>
  </div>
</template>

<script>
  export default defineComponent({
    name: "LoadingSpinner",
    components: {},
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
  .spinner {
    margin: 0 auto;
    width: 50px;
    height: 40px;
    text-align: center;
    font-size: 10px;
    display: flex;
    justify-content: space-around;
  }

  .spinner > div {
    background-color: #7279be;
    height: 100%;
    width: 6px;
    display: inline-block;
    -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
    animation: sk-stretchdelay 1.2s infinite ease-in-out;
  }

  .spinner .rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }

  .spinner .rect3 {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }

  .spinner .rect4 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }

  .spinner .rect5 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }

  @-webkit-keyframes sk-stretchdelay {
    0%,
    100%,
    40% {
      -webkit-transform: scaleY(0.4);
    }

    20% {
      -webkit-transform: scaleY(1);
    }
  }

  @keyframes sk-stretchdelay {
    0%,
    100%,
    40% {
      transform: scaleY(0.4);
      -webkit-transform: scaleY(0.4);
    }

    20% {
      transform: scaleY(1);
      -webkit-transform: scaleY(1);
    }
  }
</style>
