<template>
     <div class="main-page">

       <router-view v-slot="{ Component }" :key="$route.fullPath">
         <component :is="Component" />
       </router-view>

  </div>
</template>

<script>
import Header from "@/views/common/header/Index.vue";
import Footer from "@/views/common/footer/Index.vue";

export default defineComponent({
  name:  'APP',
  components: {
    Header,
    Footer
  },
});
</script>

<script setup>
/*****************  外部變量集  start   *****************/

/*****************  外部變量集   end    *****************/

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

</style>