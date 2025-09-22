onmessage = function (e) {

  const gridImages = e.data;

  // 過濾掉空的圖片數據
  const nonEmptyImages = gridImages.filter((imageData) => imageData);

  // 有效的圖片，則進行壓縮處理
  const compressedImagesPromises = nonEmptyImages.map((imageData) => {
    return compressImage(imageData);  // 調用壓縮函數
  });

  // 等待所有圖片處理完成
  Promise.all(compressedImagesPromises)
    .then((compressedImages) => {
      postMessage(compressedImages);  // 返回處理後的圖片數據
    })
    .catch((error) => {
      postMessage({ error: error.message, stack: error.stack });
    });
};


// 壓縮圖片的函數
function compressImage(imageData) {

  // 返回一個 Promise，這樣外部程式可以等待處理完成
  return new Promise((resolve, reject) => {

    // 將傳入的 Uint8List（二進制圖片數據）轉換為 Blob 對象，指定它的 MIME 類型為 image/webp
    const blob = new Blob([imageData], { type: 'image/webp' });

    // 使用 createImageBitmap 方法將 Blob 轉換為圖像對象（imageBitmap）
    createImageBitmap(blob)

      .then((imageBitmap) => {

        // 創建一個 OffscreenCanvas，這是一種可以在背景中處理圖像的 Canvas（不會顯示於頁面上）
        const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);

        // 獲取 Canvas 2D 畫布的上下文，並設定用於繪製圖像
        const ctx = canvas.getContext('2d');

        // 使用 ctx.drawImage 方法將 imageBitmap 畫到 canvas 上
        ctx.drawImage(imageBitmap, 0, 0);

        // 使用 canvas 的 convertToBlob 方法將圖像轉換為 Blob 格式，並設定為 JPEG 格式，質量為 0.8
        canvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 })
          .then((compressedBlob) => {
            // 創建一個 FileReader，用於讀取 Blob 並將其轉換為二進制數據（ArrayBuffer）
            const reader = new FileReader();

            // 當讀取結束時觸發
            reader.onloadend = function () {
              // 這是讀取結果，即 ArrayBuffer 形式的圖片數據
              const resultArrayBuffer = reader.result;
              // 轉換為 Uint8Array 格式並返回給調用者
              resolve(new Uint8Array(resultArrayBuffer));
            };

            // 如果讀取過程中出錯，則呼叫 reject 方法
            reader.onerror = reject;

            // 讀取 Blob 內容並將其轉換為 ArrayBuffer
            reader.readAsArrayBuffer(compressedBlob);
          })
          // 如果在壓縮過程中發生錯誤，會進入此處並呼叫 reject 方法
          .catch(reject);
      })
      // 如果創建圖像對象時出現錯誤，會進入此處並呼叫 reject 方法
      .catch(reject);
  });
}
