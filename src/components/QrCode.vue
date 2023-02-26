<template>
  <div class="qrcode-container">
    <QRCodeVue3
      :width="props.width"
      :height="props.height"
      :value="props.qrcodeUrl"
      :qr-options="{
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'H',
      }"
      :image-options="{
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 0,
      }"
      :dots-options="{
        type: 'square',
        color: '#e4dcfc',
        gradient: {
          type: 'square',
          rotation: 0,
          colorStops: [
            { offset: 0, color: '#e4dcfc' },
            { offset: 1, color: '#e4dcfc' },
          ],
        },
      }"
      :background-options="{ color: '#141225' }"
      :corners-square-options="{
        type: 'square',
        color: '#a29ab9',
      }"
      :corners-dot-options="{ type: undefined, color: '#a29ab9' }"
    />
  </div>
</template>

<script>
  import QRCodeVue3 from "qrcode-vue3";

  export default defineComponent({
    name: "QrCode",
    components: {
      QRCodeVue3,
    },
  });
</script>

<script setup>
  const props = defineProps({
    qrcodeUrl: String,
    width: Number,
    height: Number,
  });
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
