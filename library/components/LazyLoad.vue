<template>
  <div class="lazy-img" :class="{ loading: state.status == 0 }">
    <template v-if="state.status == 0">
      <slot name="loading">
        <div class="img__loading">
          <LoadingSpinner></LoadingSpinner>
        </div>
      </slot>
    </template>

    <template v-else-if="state.status == 2">
      <slot name="error">
        <div class="img__loading-fair">
          <div class="img__loading-fair-icon"></div>
          <div class="img__loading-fair-text" @click.stop="handleRetry">
            {{ $t("Retry") }}
          </div>
        </div>
      </slot>
    </template>
    <img
        v-if="state.status != 2"
        v-lazy="{ src: state.options.src, lifecycle: state.options.lifecycle }"
        :class="props.myClass"
        :key="state.index"
        :style="state.status == 0 ? { width: 0, height: 0 } : {}"
    />
  </div>
</template>

<script>
export default defineComponent({
  name: "LazyLoad",
  components: {},
});
</script>

<script setup>
const props = defineProps({
  myClass: String,
  url: {
    type: String,
    required: true,
  },
});

/*****************  動態變量集  start   *****************/
const state = reactive({
  status: -1,
  index: 0,
  options: {
    src: "", //The real image URL
    lifecycle: {
      loading: (el) => {
        state.status = 0;
      },
      error: (el) => {
        state.status = 2;
      },
      loaded: (el) => {
        state.status = 1;
      },
    },
  },
});

/*****************  動態變量集   end    *****************/

/*****************   生命週期   start   *****************/
onMounted(() => {
  state.options.src = props.url;
  if (!props.url) {
    state.status = 2;
  }
});
/*****************   生命週期    end    *****************/

/*****************     程式     start   *****************/
    // 重试
const handleRetry = () => {
      state.status = -1;
      state.index++;
    };
/*****************     程式      end    *****************/

/*****************     監聽     start   *****************/

/*****************     監聽      end    *****************/
</script>

<style lang="scss" scoped>
.img__loading-fair-icon {
  -webkit-mask-image: url(//devcsgo.oss-cn-beijing.aliyuncs.com/common/loading-fair.svg);
  mask-image: url(//devcsgo.oss-cn-beijing.aliyuncs.com/loading-fair.svg);
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: 100%;
  mask-size: 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  background-color: #de437c;
  width: 30px;
  height: 30px;
  display: inline-block;
  transition: background-color 0.3s;
}

.img__loading-fair {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;

  .img__loading-fair-text {
    color: #de437c;
    font-size: 14px;
    margin-top: 10px;
    font-weight: 600;
    cursor: pointer;
  }
}

.lazy-img {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.lazy-img.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
