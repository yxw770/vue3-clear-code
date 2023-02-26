<template>
  <div class="error-container">
    <div class="error__title">404</div>
    <div class="error__sub-title">
      {{ $t('SOMETHING IS WRONG') }}
    </div>
    <div class="error__notice">
      {{ $t('The page you are looking for was moved, removed or might never existed.') }}
    </div>
    <button class="error_btn" @click="back">{{ $t('Go back') }}</button>
  </div>
</template>

<script>
export default defineComponent({
  name: "Error404",
  components: {},
});
</script>

<script setup>
/*****************  動態變量集  start   *****************/
const router = useRouter();
/*****************  動態變量集   end    *****************/

/*****************   生命週期   start   *****************/

/*****************   生命週期    end    *****************/

/*****************     程式     start   *****************/
/**
 * 返回上一頁
 */
const back = () => {

  // 如果有上一層則返回上一層 沒有則返回首頁
  if (router.history.length > 1) {
    router.go(-1);
  } else {
    router.push("/");
  }
};
/*****************     程式      end    *****************/

/*****************     監聽     start   *****************/

/*****************     監聽      end    *****************/
</script>

<style lang="scss" scoped>
.error-container {
  max-width: 1500px;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}

.error__title {
  font-size: 10vw;
  font-weight: 700;
  color: rgb(220 174 100);
}

.error__sub-title {
  margin-top: 1.25rem;
  font-size: 1.61vw;
  font-weight: 700;
  color: rgb(220 174 100);
}

.error__notice {
  color: rgb(106 109 129);
  line-height: 1.25;
  font-size: 0.875rem;
  font-weight: 300;
}

.error_btn {
  margin-bottom: 1.5rem;
  margin-top: 1.25rem;
  font-weight: 900;
  color: #111114;
  background-color: #dcae64;
  box-shadow: 0 2px 5px #08070a;
  transition-property: background-color, box-shadow, -webkit-transform;
  transition-property: background-color, box-shadow, transform;
  transition-property: background-color, box-shadow, transform,
    -webkit-transform;
  transition-duration: 0.2s;
  padding-left: 5em;
  padding-right: 5em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 1.6666666667em 2.5em 1.5em;
  white-space: nowrap;
  text-align: center;
  border-radius: 0.375rem;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition-duration: 0.3s;
  line-height: 1;
  text-transform: uppercase;
  font-size: 0.75rem;
}
</style>
