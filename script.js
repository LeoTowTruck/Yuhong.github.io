
  document.getElementById("year").textContent = new Date().getFullYear(); // 頁腳自動載入年份

/* 這是兩隻的電話號碼
  function showPhoneOptions() {
    const modal = document.getElementById('phoneModal');
    modal.style.display = 'block';
    modal.classList.add('show');
  }

  function callNumber(number) {
    window.location.href = 'tel:' + number;
    closeModal();
  }

  function closeModal() {
    const modal = document.getElementById('phoneModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
  }

  // 點擊背景關閉
  document.getElementById('phoneModal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal();
    }
  });
*/

 //========================================================================

  // 顯示所有評價
  function displayAllReviews() {
    const reviewsContainer = document.getElementById('reviews-container'); // 獲取評價容器      
    reviews.forEach(review => {
      const reviewElement = document.createElement('div'); // 創建評價元素
      reviewElement.className = 'col-12 col-md-6 col-xl-4 mb-1'; // 設置元素的class，使用Bootstrap的網格系統
      const altText = `拾捌拖吊車客戶評價：${review.alt}`;
      reviewElement.innerHTML = `
        <div class="review">
          <img src="images/reviews/${review.id}.webp" 
            alt="${altText}" 
            aria-label="${review.alt}"
            loading="lazy" 
            class="img-fluid rounded"
          >
        </div>`; // 設置圖片元素
      reviewsContainer.appendChild(reviewElement); // 將評價元素添加到容器中
    });
  }

 //========================================================================

  window.onload = function() {

    AOS.init({
      duration: 800,
    });

    displayAllReviews(); // 初次顯示所有評價

  };


  //========================================================================

  document.addEventListener("DOMContentLoaded", function() {

    // 初始化變量
    let lastScrollY = window.scrollY; // 追蹤上一次滾動的位置
    let hidden = false; // 追蹤導航欄是否隱藏
    const revealOffset = 5; // 設定向上滾動超過 5px 的距離後顯示導航欄
    const navbar = document.querySelector('.navbar'); // 獲取導航欄元素
    const navbarCollapse = document.querySelector('.navbar-collapse'); // 獲取折疊菜單元素
    const btnContainer = document.querySelector('.fixed-buttons-container');
    const navLinks = document.querySelectorAll('.nav-link, .noto-serif-hk-logo'); // 獲取所有導航鏈接和 logo
    const bootstrapCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false }); // 創建 Bootstrap 折疊實例，不自動切換

    // 滾動事件監聽器
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY; // 當前滾動位置
      const scrollDifference = lastScrollY - currentScrollY; // 計算與上次滾動位置的差異

      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        // 如果向下滾動且超過 70px（或 20vh），隱藏導航欄
        navbar.classList.add('hidden'); // 添加隱藏類別
        hidden = true; // 更新隱藏狀態
      } else if ((hidden && scrollDifference > revealOffset) || currentScrollY < 60) {
        // 如果導航欄已隱藏且向上滾動距離超過 revealOffset，或滾動位置小於 60px，顯示導航欄
        navbar.classList.remove('hidden'); // 移除隱藏類別
        hidden = false; // 更新隱藏狀態
        if (window.innerWidth < 992) { // 檢查是否為中小螢幕
          bootstrapCollapse.hide(); // 使用 Bootstrap 折疊 API 隱藏菜單
        }
      }

      // ---  滾動到底部放大按鈕的邏輯 ---
      // 計算是否到達底部 (頁面總高 - 視窗高度 - 滾動距離 < 5px 為誤差範圍)
      const isBottom = (document.documentElement.scrollHeight - window.innerHeight - currentScrollY) < 5;

      if (isBottom) {
          btnContainer.classList.add('is-scrolled');
      } else {
          btnContainer.classList.remove('is-scrolled');
      }
      
      lastScrollY = currentScrollY; // 更新上一次滾動位置
    });

    // 當點擊事件發生時隱藏下拉式選單
    document.addEventListener('click', (event) => {
      if (window.innerWidth < 992) { // 檢查是否為中小螢幕
        bootstrapCollapse.hide(); // 使用 Bootstrap 折疊 API 隱藏菜單
      }
    });

  });

  //========================================================================

  // 添加滾動事件監聽器
  document.addEventListener('scroll', function() {

      // 設定最大放大倍數
      const maxScale = 1.1;

      // 選取所有帶有 image 類的圖片元素
      const images = document.querySelectorAll('.image');

      // 獲取視窗的高度
      const viewportHeight = window.innerHeight;
      
      // 遍歷每一個圖片元素
      images.forEach(image => {

          // 獲取圖片元素相對於視窗的位置
          const rect = image.getBoundingClientRect();

          // 獲取圖片頂部距離視窗頂部的距離
          const imageTop = rect.top;
          
          // 計算縮放比例
          // 當圖片在視窗頂部時，scale 為 maxScale
          // 當圖片在視窗底部時，scale 為 1
          const scale = maxScale - (imageTop / viewportHeight) * (maxScale - 1);
          // 設置圖片的 transform 屬性，確保比例不小於 1
          image.style.transform = `scale(${Math.max(1, scale)})`;
      });
  });

  //========================================================================

    // 當 DOM 內容完全加載完畢後執行此函數
    document.addEventListener('DOMContentLoaded', (event) => {

      // 使用一個 for 迴圈來初始化顯示圖片
      for (let i = 1; i <= 10; i++) {
          // 使用一個 for 迴圈來初始化顯示圖片
          copyFirstPhoto(`.photo_${i}`, `display-photo_${i}`);
          // 為每個 .photo 元素添加鼠標懸停事件監聽器
          addHoverEffect(`.photo_${i}`, `display-photo_${i}`);
      }

      let photos = document.querySelectorAll('.photo img');
      var currentIndex = -1;
      var first_photos = 1;
      var last_photos = 5;
      var timer;

      // 函數用來添加和移除焦點
      function updateFocus() {
          if (first_photos !== -1) {
              if (currentIndex > last_photos) {
                  currentIndex = first_photos;
              }

              document.activeElement.blur(); // 讓當前有焦點的元素失去焦點
              photos.forEach(photo => photo.classList.remove('focused'));  // 移除當前焦點樣式
              
              // 添加焦點樣式到當前元素
              photos[currentIndex].classList.add('focused');

              // 獲取當前圖片的父容器元素
              const currentPhoto = photos[currentIndex].closest('.photo');
              const rescueBlock = currentPhoto.closest('.rescueBlock'); // 獲取到父容器 .rescueBlock
              const displayPhotoDiv = rescueBlock.querySelector('.display-photo'); // 獲取對應的 .display-photo

              // 獲取父容器裡面的圖片元素
              const imgElement = displayPhotoDiv.querySelector('img');

              // 複製當前圖片節點
              const img = photos[currentIndex].cloneNode(true);

              if (imgElement.src !== img.src) {
                  // 清空顯示圖片元素中的內容
                  displayPhotoDiv.innerHTML = '';

                  // 將複製的圖片節點添加到顯示圖片的元素中
                  displayPhotoDiv.appendChild(img);
              }

              // 更新索引，並循環
              currentIndex = currentIndex + 1;
          }
      }



      // 處理圖片點擊事件
      function handleClick(event) {

          // 移除所有圖片的焦點樣式
          photos.forEach(photo => photo.classList.remove('focused')); 
          const clickedIndex = Array.from(photos).indexOf(event.target);
          currentIndex = clickedIndex+1; // 設置為點擊圖片的索引
          clearInterval(timer); // 清除之前設定的定時器
          timer = setInterval(updateFocus, 6000);

      }

      // 為每個圖片添加點擊事件監聽器
      photos.forEach(photo => photo.addEventListener('click', handleClick));

//===================================================================

    // 更新顯示焦點的圖片
    function updateVisibleFocus() {

      // 遍歷所有圖片元素，篩選出在視口中可見的圖片
      const visiblePhotos = Array.from(photos).filter(photo => {
        // 獲取圖片元素的邊界矩形
        const rect = photo.getBoundingClientRect();
        // 檢查圖片是否完全在視口中
        return (
          rect.top >= 160 &&                          // 圖片頂部在視口上方
          rect.left >= 0 &&                           // 圖片左邊在視口左邊
          rect.bottom <= window.innerHeight + 150 &&  // 圖片底部在視口下方
          rect.right <= window.innerWidth             // 圖片右邊在視口右邊
        );
      });

      // 取得可見圖片中最小和最大索引
      first_photos = Array.from(photos).indexOf(visiblePhotos[0]);
      last_photos = Array.from(photos).indexOf(visiblePhotos[visiblePhotos.length - 1]);
      
      // alert(first_photos + " / " + last_photos);

      // 如果視口內已有圖片，不進行任何操作
      if (first_photos <= currentIndex && currentIndex <= last_photos ) {
        return;
      }
      
      // 焦點
      if (visiblePhotos.length > 0) {
        clearInterval(timer); // 清除定時器
        // 獲取第一張可見圖片的索引
        currentIndex = first_photos;
        // 更新焦點，根據 currentIndex 顯示對應的圖片
        updateFocus();  // 立刻執行
        timer = setInterval(updateFocus, 3500);
      }
    }

    let isScrolling; // 用於存儲 setTimeout ID

    window.addEventListener('scroll', function() {
      // 清除之前的滾動計時器
      clearTimeout(isScrolling);

      // 設定新的計時器，在滾動結束後N毫秒執行 updateVisibleFocus()
      isScrolling = setTimeout(function() {
        window.requestAnimationFrame(function() {
          updateVisibleFocus();
        });
      }, 100); // 毫秒的延遲            
    });
  });



  // 通用的函數，用於選取第一張圖片並複製其節點
  const copyFirstPhoto = (sourceSelector, targetId) => {
      // 使用 sourceSelector 選取第一個匹配的圖片元素（假設該 selector 選取的是一個或多個包含圖片的容器）
      const firstPhoto = document.querySelector(sourceSelector + ' img').cloneNode(true);
      // 將複製的圖片節點添加到目標元素中
      document.getElementById(targetId).appendChild(firstPhoto);
  };


  // 通用的函數，用於處理鼠標懸停事件
  const addHoverEffect = (sourceSelector, targetId) => {
    document.querySelectorAll(sourceSelector).forEach(photo => {
      photo.addEventListener('focus', (e) => {
        // 選取.photo 元素中的圖片，並複製其節點
        const img = e.currentTarget.querySelector('img').cloneNode(true);
        
        // 獲取用於顯示圖片的元素
        const displayPhotoDiv = document.getElementById(targetId);
        
        // 清空顯示圖片元素中的內容
        displayPhotoDiv.innerHTML = '';
        
        // 將複製的圖片節點添加到顯示圖片的元素中
        displayPhotoDiv.appendChild(img);
      });

      // 確保元素可以獲得焦點
      photo.tabIndex = 0;
    });
  };


  //========================================================================


  // 評價圖片URL列表
  const reviews = [
    { id: "google-map-a/1", alt: "服務好，態度好，價格合理的店家" },
    { id: "google-map-a/2", alt: "效率很快 司機大哥人很好" },
    { id: "google-map-a/3", alt: "老闆拖車技術很好，也很細心。" },
    { id: "google-map-a/4", alt: "快速技術一流" },
    { id: "google-map-a/5", alt: "五星" },
    { id: "google-map-a/6", alt: "五顆星" },
    { id: "google-map-a/7", alt: "半夜車子拋錨 叫了好多間都嫌晚 只有這個老闆依然出來救援 價格還很合理 辛苦老闆了" },
    { id: "google-map-a/8", alt: "老闆熱心，服務很好" },
    { id: "google-map-a/9", alt: "老闆熱心 價錢公道" },
    { id: "google-map-a/10", alt: "價錢公道 服務好" },
    { id: "google-map-a/11", alt: "道路救援讚！親切、迅速" },
    { id: "google-map-a/12", alt: "拉貨服務很好，老闆很熱情，很有趣，價格也很合理。非常感謝老闆及時救了我的車" },
    { id: "google-map-a/13", alt: "超棒的拖吊服務 歡迎大家有需要可以跟老闆聯絡" },
    { id: "google-map-a/14", alt: "很棒的服務.價錢公道.合理.使命必達.有需要可以跟老闆連絡" },
    { id: "google-map-a/15", alt: "老闆人很好 價錢公道 服務一級棒" },

    { id: "google-map-b/1", alt: "正面評價：守時、品質、專業度和價格" },
    { id: "google-map-b/2", alt: "老闆專業，值得信賴！" },
    { id: "google-map-b/3", alt: "正面評價：守時、品質和專業度" },
    { id: "google-map-b/4", alt: "服務態度好" },
    { id: "google-map-b/5", alt: "優質服務" },
    { id: "google-map-b/6", alt: "服務好，態度好，價格合理的店家。" },
    { id: "google-map-b/7", alt: "服務好，價位公道" },
    { id: "google-map-b/8", alt: "服務好，價錢公道，謝謝協助" },
    { id: "google-map-b/9", alt: "服務很好 價錢公道 是在地最好的吊車公司" },
    { id: "google-map-b/10", alt: "服務好，價錢公道，謝謝協助" },
    { id: "google-map-b/11", alt: "五顆星" },
    { id: "google-map-b/12", alt: "五顆星" },

    { id: "youtube/1", alt: "感恩 救人一命視人猶親 阿彌陀佛！！！祝福也注意安全喔！！！" },
    { id: "youtube/2", alt: "你們真的辛苦了 在救援同時千萬要記得注意自身安全。" },
    { id: "youtube/3", alt: "專業! 安全維護永不嫌多！大家辛苦了加油 " },
    { id: "youtube/4", alt: "老師傅的一些經驗跟技術真的是值得學習的" },
    { id: "youtube/5", alt: "看到大家一直在高速公路上走來走去真的很危險" },
    { id: "youtube/6", alt: "挖靠 太酷了吧！超真實救援耶，一個case感覺搞上整天，辛苦了（敬禮）" },
    { id: "youtube/7", alt: "辛苦了 注意安全！！" },
    { id: "youtube/8", alt: "超棒的！" },
    { id: "youtube/9", alt: "看了真舒服" },
    { id: "youtube/10", alt: "辛苦了" },
    { id: "youtube/11", alt: "辛苦了..." },
    { id: "youtube/12", alt: "辛苦了！！注意安全" },
    { id: "youtube/13", alt: "看了都好緊張~在國道上真的都拿命在拚鑽到車底或站在車旁，只要後面有個不小心的駕駛衝過來真的都沒命在搞⋯真的辛苦了" },
    { id: "youtube/14", alt: "太辛苦了 我爸也是每天開油罐車在高速公路上的 所以我更能體會您們的危險辛苦了！注意安全" },
    { id: "youtube/15", alt: "你們的拖吊車最乾淨，也保養得很好去了日本旅遊才知道台灣的卡車有多髒賺錢之餘也要有職人精神" },
    { id: "youtube/16", alt: "認真的救援人員令人敬佩《習慣黏很緊的令人不齒。路上最討厭這種的。保持適當距離是很基本的" },
    { id: "youtube/17", alt: "人沒事就好了車壞掉了還可以修人懷了就涼涼了個位朋友都要注意安全平安順利哦" },
    { id: "youtube/18", alt: "影片裡很多好人、認真工作的人，看了心情都好了起來。辛苦了" },
    { id: "youtube/19", alt: "新年快樂 行車平安" },
    { id: "youtube/20", alt: "滿滿的人情味" },
    { id: "youtube/21", alt: "你們很辛苦，一定要注意安全！" },
    { id: "youtube/22", alt: "感謝紀錄 請小心安全" },
    { id: "youtube/23", alt: "要怎麼應徵你們這種行業啊？" },
    { id: "youtube/24", alt: "在國道拖車真的是勇士～！英雄" },
    { id: "youtube/25", alt: "在救援同時千萬要記得注意自身安全.辛苦辛苦感恩" },
    { id: "youtube/26", alt: "在這危險的地方還好有你們辛苦了，自己也小哦" },
    { id: "youtube/27", alt: "在快車道上處置還是蠻讓人擔心的，多注意安全！感謝有你們辛苦了" },
    { id: "youtube/28", alt: "一看就知夠專業救援" },
    { id: "youtube/29", alt: "台灣就是有這樣的吊車服務，大家才會安全回家，平安就是福" },
    { id: "youtube/30", alt: "當然專業了，三寶太多 事故就多，不專業忙得過來嗎？" },
    { id: "youtube/31", alt: "人沒事，車再買就好。" },
    { id: "youtube/32", alt: "厲害 讚讚讚" },
    { id: "youtube/33", alt: "無名英雄~~辛苦了" },
    { id: "youtube/34", alt: "專業，有你真好。" },
    { id: "youtube/35", alt: "想學 還收學徒嗎" },
    { id: "youtube/36", alt: "辛苦拖吊車 時刻皮都要繃緊 就怕天兵" },
    { id: "youtube/37", alt: "拖吊車有在顧喔 很漂亮" },
    { id: "youtube/38", alt: "大機器救援大機器，感覺好厲害" },
    { id: "youtube/39", alt: "老師傅厲害 1拖3" },
    { id: "youtube/40", alt: "吊車司機大哥好專業！" },
    { id: "youtube/41", alt: "辛苦了版主！道路救援隊真的很偉大" },
    { id: "youtube/42", alt: "這是怎麼撞啊" },
    { id: "youtube/44", alt: "哇塞，拖車大哥真強拖聯結，真的像開火車" },
    { id: "youtube/45", alt: "拖車司機真的很辛苦也很危險值得敬佩" },
    { id: "youtube/46", alt: "緊張刺激、出生入死~直擊國道車禍後的救援，感恩分享" },
    { id: "youtube/47", alt: "車禍現場拖車處理也是有風險的..辛苦了" },
    { id: "youtube/48", alt: "那天晚上吃晚餐有巧遇拾八學長 人非常親切 也很大方的同意跟他合照" },
    { id: "youtube/49", alt: "小心安全很多車工作時要注意安全" },
    { id: "youtube/50", alt: "這些大哥 都是真功夫欸⋯" },
    { id: "youtube/51", alt: "拖吊很專業.Focus癱瘓大學長真強" },
    { id: "youtube/53", alt: "真的辛苦了！感覺待越久越危險" },
    { id: "youtube/55", alt: "拖吊真的很辛苦，建議穿個綱頭鞋或運動鞋好過穿布鞋，工作難免拿工具或東西不小心滑掉砸到腳真的會痛到噴眼淚出來，要注意安全呀，曾經被小小的活動扳手砸到腳大拇指導致粉碎性骨折經過。" },
    { id: "youtube/56", alt: "在國道上跑來跑去 真替你們捏一把冷汗 不只要注意來車 更要當心把自動輔助駕駛當自動駕駛開的移動棺材！" },
    { id: "youtube/57", alt: "感覺在高速公路上面處理事故時，壓力真的很大尤其車輛在身邊呼嘯時，還有視訊中要躺在車底下危險真的很多，如果下雨天或是晚上時視線跟壓力相信更大" },
    { id: "youtube/58", alt: "拖吊車人員辛苦，感謝有你們幫忙排除車禍！在你的視頻看到很多不同領域的工作！尤其是在高速公路上工作要時時刻刻注意安全！真的給你們大讚" },
    { id: "youtube/59", alt: "預防勝於救援，想想如果好好開車就不會後續麻煩的處理，辛苦所有道路救援人員，雖是你們的職責還是希望都能平安救援" },
    { id: "youtube/60", alt: "原來當拖車司機，需要好多專業知識.. 對每個車種的了解、現場判斷如何拖吊比我想像中的辛苦、厲害" },
    { id: "youtube/61", alt: "真的是國道英雄，拯救大家塞車的狀況，後面在車上聊天還蠻有趣的，祝你們賺大錢，注意自身安全" },
    { id: "youtube/62", alt: "這些救援的 辛苦了 這種肇事的駕駛理應要負更多的道路救援費用 健保不要給付才對" },
    { id: "youtube/54", alt: "那麼剛好，撞車剛好旁邊有拖車" },
    { id: "youtube/63", alt: "希望駕駛人沒事" },

      // 這裡繼續添加超過100條評價圖片URL
  ];

  //========================================================================


  function makeCall() {
    window.location.href = "tel:0981263978";
  }

  function openLine() {

    // 原本的 LINE 網頁跳轉註解掉(Google ads 禁止使用直接跳轉Line介面)
    // window.open("https://line.me/ti/p/idtb0LETDp", "_blank");
    
    // 改成跳轉到本地頁面
    window.location.href = "https://leotowtruck.github.io/Yuhong.github.io/line-tutorial.html";
  }

