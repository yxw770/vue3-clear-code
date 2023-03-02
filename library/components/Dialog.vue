<template>
  <div
    class="dialogs-container"
    :class="{ 'blure blure-out': state.closing, blure: state.showDialog }"
    @click="maskClose($event)"
  >
    <Transition name="transition__dialog">
      <div class="dialog-wrapper" v-if="state.showDialog">
        <div class="dialog">
          <div
            ref="msk"
            :class="[{ 'dialog-animate': state.show_shake }, props.myClass]"
            :style="getDialogStyle"
          >
            <div
              class="dialog-close-button"
              data-qa="close-dialog"
              style="--bgColer: #92929d; --cbgColer: #4c4a5c"
              @click="close"
            >
              <span class="close-icon"></span>
            </div>
            <slot name="header"></slot>

            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
  export default defineComponent({
    name: "Dialog",
    components: {},
  });
</script>

<script setup>
  const props = defineProps({
    modelValue: Boolean,
    clickMaskClose: {
      type: Boolean,
      default: true,
    },
    width: String,
    maxHeight: String,
    overflow: String,
    height: String,
    myClass: String,
  });
  const emit = defineEmits(["update:modelValue"]);

  /*****************  動態變量集  start   *****************/
  const state = reactive({
    showDialog: false,
    closing: false,
    // 显示抖动动画
    show_shake: false,
  });
  const msk = ref(null);
  const getDialogStyle = computed(() => {
    return {
      "--dialogWidth": props.width ? props.width : "auto",
      "--dialogHeight": props.height ? props.height : "auto",
      "--dialogMaxHeight": props.maxHeight ? props.maxHeight : "auto",
      "--dialogOverflow": props.overflow ? props.overflow : "unset",
    };
  });
  /*****************  動態變量集   end    *****************/

  /*****************   生命週期   start   *****************/
  onMounted(() => {
    state.showDialog = props.modelValue;
  });
  /*****************   生命週期    end    *****************/

  /*****************     程式     start   *****************/
  // 點擊關閉
  const close = () => {
    state.showDialog = false;
    emit("update:modelValue", false);
    state.closing = true;
    setTimeout(() => {
      state.closing = false;
    }, 500);
  };
  // 點擊陰影關閉
  const maskClose = (ev) => {
    if (!msk.value?.contains(ev.target)) {
      if (props.clickMaskClose) {
        state.showDialog = false;
        emit("update:modelValue", false);
        state.closing = true;
        setTimeout(() => {
          state.closing = false;
        }, 500);
      } else {
        state.show_shake = true;
        setTimeout(() => {
          state.show_shake = false;
        }, 600);
      }
    }
  };
  /*****************     程式      end    *****************/

  /*****************     監聽     start   *****************/
  watch(
    () => props.modelValue,
    (val) => {
      state.showDialog = val;
      if (val) {
        document.body.style.cssText = `overflow: hidden;`;
      } else {
        document.body.style.cssText = ``;
      }
    }
  );
  /*****************     監聽      end    *****************/
</script>

<style lang="scss" scoped>
  .blure {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    -webkit-backdrop-filter: blur(1px);
    backdrop-filter: blur(1px);
    background-color: rgba(0, 0, 0, 0.75);
    animation: animate-color-in 0.3s;
  }

  .blure.blure-out {
    -webkit-backdrop-filter: blur(0);
    backdrop-filter: blur(0);
    background-color: transparent;
    animation-name: animate-color-out;
    animation-duration: 0.5s;
  }

  .transition__dialog-enter-active,
  .transition__dialog-leave-active {
    transition: opacity transform;
    transition-duration: 0.5s;
    transition-timing-function: ease-in-out;
  }

  .transition__dialog-enter-from {
    opacity: 0;
    transform: scale(0.7) translateY(-200px);
  }

  .transition__dialog-leave-to {
    opacity: 0;
    transform: scale(0.7) translateY(200px);
  }

  .dialog-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    z-index: 1000;
    padding: 20px;
    box-sizing: border-box;
  }

  @media screen and (max-width: 768px) {
    .dialog-wrapper {
      padding: 10px;
    }
  }

  .dialog-wrapper:before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
    margin-right: -0.05em;
  }

  .dialog-wrapper .dialog {
    display: inline-block;
    vertical-align: middle;
    position: relative;
    box-sizing: border-box;
    width: 100%;
  }

  @keyframes animate-color-in {
    0% {
      -webkit-backdrop-filter: blur(0);
      backdrop-filter: blur(0);
      background-color: transparent;
    }

    to {
      -webkit-backdrop-filter: blur(1px);
      backdrop-filter: blur(1px);
      background-color: rgba(0, 0, 0, 0.75);
    }
  }

  @keyframes animate-color-out {
    0% {
      -webkit-backdrop-filter: blur(1px);
      backdrop-filter: blur(1px);
      background-color: rgba(0, 0, 0, 0.75);
    }

    to {
      -webkit-backdrop-filter: blur(0);
      backdrop-filter: blur(0);
      background-color: transparent;
    }
  }

  .dialog-close-button {
    position: absolute;
    cursor: pointer;
    z-index: 1;
  }

  .dialog-close-button:hover .close-icon {
    background-color: var(--bgColer);
  }

  .dialog-close-button .close-icon {
    -webkit-mask-image: url(@/assets/images/common/cancel-icon.svg);
    mask-image: url(@/assets/images/common/cancel-icon.svg);
    -webkit-mask-position: center;
    mask-position: center;
    -webkit-mask-size: 100%;
    mask-size: 100%;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    background-color: var(--cbgColer);
    width: 15px;
    height: 15px;
    display: inline-block;
    transition: background-color 0.3s;
  }

  .dialog {
    position: relative;
    width: var(--dialogWidth);
    height: var(--dialogHeight);
    max-height: var(--dialogMaxHeight);
    overflow: var(--dialogOverflow);
    max-width: 90vw;
    background: #100f1f;
    margin: 0 auto;
  }

  @keyframes levelUpDown {
    0% {
      transform: scale(1);
    }

    25% {
      transform: scale(1.4);
    }

    85% {
      transform: scale(1.4);
    }

    to {
      transform: none;
    }
  }

  @keyframes glass-animate {
    0% {
      left: -50%;
    }

    to {
      left: 100%;
    }
  }

  @keyframes stroke-2-animate {
    0% {
      opacity: 0.05;
    }

    50% {
      opacity: 0.35;
    }

    to {
      opacity: 0.05;
    }
  }

  @keyframes stroke-3-animate {
    0% {
      opacity: 0.05;
    }

    50% {
      opacity: 0.1;
    }

    to {
      opacity: 0.05;
    }
  }

  @keyframes dialog-shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }

  .dialog-animate {
    animation: dialog-shake 0.6s;
  }

  .battle-dialog__scroller {
    height: 100%;
    overflow-y: auto;
  }
</style>
