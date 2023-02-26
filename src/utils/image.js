export function preloadImgs(data, callback) {
  var count = 0;
  data.forEach(element => {
    const img = new Image();
    img.src = element;
    img.onload = function () {
      count++;
      console.log(count, img.src)
      if (count >= data.length) {
        callback()
      }
    }
    img.onerror = function () {
      count++;
      if (count > data.length) {
        callback()
      }
    }
  });

}

/**
 * 保存二維碼
 */
export const saveQrCode = (selector) => {
  const image = document.querySelector(selector)
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, image.width, image.height);
  // Get the base64 encoded data of the image
  const url = canvas.toDataURL("image/png");
  var link = document.createElement("a");
  document.body.appendChild(link); // for Firefox
  link.setAttribute("href", url);
  const fileName = (new Date()).getTime() + '-qr-code.png'
  link.setAttribute("download", fileName);
  link.click();
}