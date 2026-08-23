
  //========================================================================
  // 全域圖片載入失敗自動重試機制 (解決 GitHub Pages 偶發 503 / 網路瞬間中斷)
  //========================================================================
  window.addEventListener('error', function (event) {
    const target = event.target;
    if (target && target.tagName === 'IMG') {
      const maxRetries = 3; // 最多重試 3 次
      let retries = parseInt(target.getAttribute('data-retry-count') || '0', 10);

      if (retries < maxRetries) {
        retries += 1;
        target.setAttribute('data-retry-count', retries);

        // 記錄原始網址，避免重複疊加時間戳 query
        const rawSrc = target.getAttribute('data-original-src') || target.src;
        const cleanSrc = rawSrc.replace(/[?&]retry_t=\d+/g, '');
        if (!target.hasAttribute('data-original-src')) {
          target.setAttribute('data-original-src', cleanSrc);
        }

        // 漸進式延遲重試 (第1次 1秒，第2次 2秒，第3次 3秒)
        const delay = retries * 1000;
        setTimeout(() => {
          const sep = cleanSrc.includes('?') ? '&' : '?';
          // 附加快取重試時間戳，強制向 GitHub/伺服器重新請求
          target.src = `${cleanSrc}${sep}retry_t=${Date.now()}`;
        }, delay);
      }
    }
  }, true); // 使用捕獲模式 (Capture Phase) 監聽不冒泡的 img error 事件

  document.addEventListener('DOMContentLoaded', function () {

    // 頁腳年份自動載入
    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    // 初始化所有 Swiper 輪播
    const heroSwiper = new Swiper('.heroSwiper', {
        loop: true,
        speed: 800,
        touchStartPreventDefault: false,
        passiveListeners: true,
        autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        },
        grabCursor: true, // 滑鼠移上去會變成抓取手勢
        pagination: {
        el: '.heroSwiper .swiper-pagination',
        clickable: true,
        },
    });

    const servicesSwiper = new Swiper('.servicesSwiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        touchStartPreventDefault: false,
        passiveListeners: true,
        grabCursor: true,
        pagination: {
          el: '.services-pagination',
          clickable: true,
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 30,
          }
        }
    });

    const aboutSwiper = new Swiper('.aboutSwiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: false,
        touchStartPreventDefault: false,
        passiveListeners: true,
        grabCursor: true,
        pagination: {
          el: '.about-pagination',
          clickable: true,
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 30,
          }
        }
    });
    });

 //========================================================================

  // 初始化評價與分類/載入更多機制
  let currentReviewFilter = 'all';
  let displayedReviewCount = 12;

  function initReviews() {
    const grid = document.getElementById('reviews-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const tabBtns = document.querySelectorAll('.review-tab-btn');

    // 計算各分類數量
    const googleReviews = reviews.filter(r => r.id.startsWith('google-map'));
    const youtubeReviews = reviews.filter(r => r.id.startsWith('youtube'));

    const countAllEl = document.getElementById('count-all');
    const countGoogleEl = document.getElementById('count-google');
    const countYoutubeEl = document.getElementById('count-youtube');

    if (countAllEl) countAllEl.textContent = reviews.length;
    if (countGoogleEl) countGoogleEl.textContent = googleReviews.length;
    if (countYoutubeEl) countYoutubeEl.textContent = youtubeReviews.length;

    function render(isAppend = false) {
      if (!grid) return;

      let filtered = reviews;
      if (currentReviewFilter === 'google') {
        filtered = googleReviews;
      } else if (currentReviewFilter === 'youtube') {
        filtered = youtubeReviews;
      }

      if (!isAppend) {
        grid.innerHTML = '';
        if (filtered.length === 0) {
          grid.innerHTML = `<div class="col-12 text-center text-white-50 py-5">目前沒有相關評價記錄</div>`;
          if (loadMoreBtn && loadMoreBtn.parentElement) loadMoreBtn.parentElement.style.display = 'none';
          return;
        }
      }

      const startIndex = isAppend ? Math.max(0, displayedReviewCount - 12) : 0;
      const sliceToRender = filtered.slice(startIndex, displayedReviewCount);

      sliceToRender.forEach(review => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4';
        const altText = `拾捌拖吊車客戶評價：${review.alt}`;
        col.innerHTML = `
          <div class="p-3 rounded-4 h-100 position-relative overflow-hidden review-card-box" style="background: rgba(14, 16, 22, 0.95); border: 1px solid rgba(255, 220, 53, 0.18); backdrop-filter: blur(12px); transition: all 0.3s ease;">
            <div class="position-absolute top-0 start-0 end-0" style="height: 2px; background: linear-gradient(90deg, #FFDC35 0%, #FFA000 100%);"></div>
            <div class="overflow-hidden rounded-3 mb-3 shadow-sm bg-black bg-opacity-50 d-flex align-items-center justify-content-center p-2" style="min-height: 180px;">
              <img src="images/reviews/${review.id}.webp" 
                alt="${altText}" 
                aria-label="${review.alt}"
                loading="lazy" 
                class="w-100 h-auto object-fit-contain review-img rounded"
                style="max-height: 280px; transition: transform 0.4s ease;"
              >
            </div>
            <div class="text-white-50 small px-1 pt-2" style="font-size: 0.82rem; line-height: 1.5; border-top: 1px solid rgba(255,255,255,0.06);">
              <span class="material-symbols-outlined text-warning align-middle" style="font-size: 14px;">format_quote</span> ${review.alt}
            </div>
          </div>`;
        grid.appendChild(col);
      });

      // 載入更多按鈕顯示控制
      if (loadMoreBtn && loadMoreBtn.parentElement) {
        if (displayedReviewCount >= filtered.length) {
          loadMoreBtn.parentElement.style.display = 'none';
        } else {
          loadMoreBtn.parentElement.style.display = 'block';
        }
      }

      if (isAppend && window.AOS && typeof window.AOS.refresh === 'function') {
        window.AOS.refresh();
      }
    }

    // 綁定 Tab 切換事件
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        tabBtns.forEach(b => {
          b.classList.remove('active', 'text-dark');
          b.classList.add('text-white');
          b.style.background = 'rgba(25, 28, 36, 0.9)';
          b.style.border = '1px solid rgba(255, 220, 53, 0.3)';
        });
        btn.classList.add('active', 'text-dark');
        btn.classList.remove('text-white');
        btn.style.background = '#FFDC35';
        btn.style.border = 'none';

        currentReviewFilter = btn.getAttribute('data-filter');
        displayedReviewCount = 12;
        render(false);
      });
    });

    // 綁定載入更多事件
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        displayedReviewCount += 12;
        render(true);
      });
    }

    render(false);
  }

 //========================================================================

  window.onload = function() {

    AOS.init({
      duration: 800,
    });

    if (typeof initReviews === 'function') {
        initReviews(); // 初始化評價模組
    }

    if (typeof initFAQ === 'function') {
        initFAQ(); // 初始化常見問題模組
    }

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
    
    // 判斷選單是否處於展開狀態的輔助函式
    function isMenuOpen() {
      return navbarCollapse && navbarCollapse.classList.contains('show');
    }

    // 關閉選單的安全函式 (防止重複觸發導致跳動)
    function safeHideMenu() {
      if (window.innerWidth < 992 && isMenuOpen()) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
        bsCollapse.hide();
      }
    }

    // 滾動事件監聽器 (加入 passive: true 提升滑動效能)
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY; // 當前滾動位置
        const scrollDifference = lastScrollY - currentScrollY; // 計算與上次滾動位置的差異

        if (currentScrollY > lastScrollY && currentScrollY > 280) {
            // 下滑隱藏 Navbar，若選單開著則順便收起
            navbar.classList.add('hidden');
            hidden = true;
            safeHideMenu(); 
        } else if ((hidden && scrollDifference > revealOffset) || currentScrollY < 60) {
            // 上滑顯示 Navbar
            navbar.classList.remove('hidden');
            hidden = false;
        }
        lastScrollY = currentScrollY; 
    }, { passive: true });

    // 當點擊導航連結 (例如 #about-us) 時才自動關閉選單，避免全域無差別觸發
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        safeHideMenu();
      });
    });

  });


  //========================================================================
  // 案例展廳互動邏輯 (Swiper 雙重輪播與連動、分類篩選、Modal 彈窗)
  //========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.minimal-filter-tab');
    const caseCards = document.querySelectorAll('.minimal-case-card');
    
    // Modal 核心元素
    const modal = document.getElementById('minimalCaseModal');
    const modalBackdrop = document.getElementById('minimalModalBackdrop');
    const modalCloseBtn = document.getElementById('minimalModalClose');
    
    // 文字屬性元素
    const modalCategoryTag = document.getElementById('modalCategoryTag');
    const modalTitle = document.getElementById('modalTitle');
    const modalLocation = document.getElementById('modalLocation');
    const modalEquipment = document.getElementById('modalEquipment');
    const modalDesc = document.getElementById('modalDesc');

    // 儲存 Swiper 實例
    let modalMainSwiper = null;
    let modalThumbsSwiper = null;

    // 1. 分類篩選
    function applyFilter(filter) {
      filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === filter) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      caseCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });

      if (window.AOS) {
        window.AOS.refresh();
      }
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        applyFilter(filter);
      });
    });

    // 2. 初始化 Modal 的 Swiper 輪播
    function initModalSwipers() {
      if (modalMainSwiper) modalMainSwiper.destroy(true, true);
      if (modalThumbsSwiper) modalThumbsSwiper.destroy(true, true);

      // 下方縮圖 Swiper
      modalThumbsSwiper = new Swiper('.modalThumbsSwiper', {
        spaceBetween: 8,
        slidesPerView: 'auto', // 依縮圖寬度彈性排列
        freeMode: true,
        watchSlidesProgress: true, // 必須開啟，主圖才能追蹤縮圖進度
        touchStartPreventDefault: false,
        passiveListeners: true,
      });

      // 上方主圖 Swiper (連動縮圖)
      modalMainSwiper = new Swiper('.modalMainSwiper', {
        spaceBetween: 10,
        speed: 500,
        grabCursor: true,
        touchStartPreventDefault: false,
        passiveListeners: true,
        navigation: {
          nextEl: '.modalMainSwiper .swiper-button-next',
          prevEl: '.modalMainSwiper .swiper-button-prev',
        },
        thumbs: {
          swiper: modalThumbsSwiper,
          slideThumbActiveClass: 'swiper-slide-thumb-active' // 確保 Class 名稱完全匹配
        },
      });
    }

    // 3. 打開案例彈窗
    function openCaseModal(card) {
      if (!modal) return;

      const title = card.getAttribute('data-title');
      const catName = card.getAttribute('data-category-name');
      const loc = card.getAttribute('data-location');
      const eq = card.getAttribute('data-equipment');
      const desc = card.getAttribute('data-desc');
      const photosRaw = card.getAttribute('data-photos');

      let currentCardPhotos = [];
      try {
        currentCardPhotos = JSON.parse(photosRaw) || [];
      } catch (e) {
        currentCardPhotos = [];
      }

      // 寫入文字資訊
      if (modalTitle) modalTitle.textContent = title || '';
      if (modalCategoryTag) modalCategoryTag.textContent = catName || '';
      if (modalLocation) modalLocation.textContent = loc || '';
      if (modalEquipment) modalEquipment.textContent = eq || '';
      if (modalDesc) modalDesc.textContent = desc || '';

      // 動態建立大圖與縮圖的 Swiper Slide 結構
      const mainWrapper = document.getElementById('modalSwiperWrapper');
      const thumbsWrapper = document.getElementById('modalThumbsWrapper');

      if (mainWrapper && thumbsWrapper) {
        mainWrapper.innerHTML = '';
        thumbsWrapper.innerHTML = '';

        currentCardPhotos.forEach((photo) => {
          // 大圖 Slide
          const mainSlide = document.createElement('div');
          mainSlide.className = 'swiper-slide';
          mainSlide.innerHTML = `<img src="${photo.src}" alt="${photo.alt || title}">`;
          mainWrapper.appendChild(mainSlide);

          // 縮圖 Slide
          const thumbSlide = document.createElement('div');
          thumbSlide.className = 'swiper-slide minimal-thumb-item';
          thumbSlide.innerHTML = `<img src="${photo.src}" alt="${photo.alt || title}">`;
          thumbsWrapper.appendChild(thumbSlide);
        });
      }

      // 鎖定背景並顯示 Modal
      document.body.style.overflow = 'hidden';
      const modalDialog = modal.querySelector('.minimal-modal-dialog');
      if (modalDialog) {
        modalDialog.style.transform = '';
      }
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');

      // 關鍵：必須在 Modal 展開（容器有寬度）後初始化 Swiper
      setTimeout(() => {
        initModalSwipers();
      }, 50);
    }

    // 關閉 Modal (支援手機端平滑向右滑出)
    function closeModal() {
      if (!modal) return;
      const modalDialog = modal.querySelector('.minimal-modal-dialog');
      const isMobile = window.innerWidth <= 768;

      if (isMobile && modalDialog) {
        modalDialog.style.transform = 'translate3d(100%, 0, 0)';
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
          if (modalDialog) modalDialog.style.transform = '';
          document.body.style.overflow = '';
        }, 320);
      } else {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }

    // 綁定卡片點擊與鍵盤開啟
    caseCards.forEach(card => {
      card.addEventListener('click', () => openCaseModal(card));
      card.tabIndex = 0;
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCaseModal(card);
        }
      });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // 支援 Esc 鍵關閉 Modal
    document.addEventListener('keydown', (e) => {
      if (!modal || !modal.classList.contains('active')) return;
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    //========================================================================
    // 手機端右滑關閉手勢 (Swipe Right to Close)
    //========================================================================
    const modalDialog = modal ? modal.querySelector('.minimal-modal-dialog') : null;
    if (modalDialog) {
      let startX = 0;
      let startY = 0;
      let currentX = 0;
      let isSwiping = false;
      let isIntentionalHorizontal = false;

      modalDialog.addEventListener('touchstart', (e) => {
        if (window.innerWidth > 768 || !modal.classList.contains('active')) return;
        // 如果使用者觸摸的是 Swiper 輪播內部，讓 Swiper 優先處理照片切換
        if (e.target.closest('.modalMainSwiper') || e.target.closest('.modalThumbsSwiper')) {
          return;
        }

        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        currentX = startX;
        isSwiping = false;
        isIntentionalHorizontal = false;
      }, { passive: true });

      modalDialog.addEventListener('touchmove', (e) => {
        if (window.innerWidth > 768 || !modal.classList.contains('active')) return;
        if (e.target.closest('.modalMainSwiper') || e.target.closest('.modalThumbsSwiper')) {
          return;
        }

        const touch = e.touches[0];
        const diffX = touch.clientX - startX;
        const diffY = touch.clientY - startY;

        // 判斷是否為明確的水平右滑手勢
        if (!isIntentionalHorizontal && Math.abs(diffX) > 10) {
          if (diffX > 0 && diffX > Math.abs(diffY) * 1.2) {
            isIntentionalHorizontal = true;
            isSwiping = true;
            modalDialog.classList.add('swiping');
          }
        }

        if (isSwiping && diffX > 0) {
          currentX = touch.clientX;
          // 1:1 跟隨手指往右平移
          modalDialog.style.transform = `translate3d(${diffX}px, 0, 0)`;
        }
      }, { passive: true });

      const handleTouchEnd = () => {
        if (!isSwiping) return;
        modalDialog.classList.remove('swiping');
        const diffX = currentX - startX;
        const threshold = window.innerWidth * 0.28; // 滑動超過螢幕寬度的 28% 即判定關閉

        if (diffX > threshold) {
          // 超過門檻，觸發向右滑出關閉
          closeModal();
        } else {
          // 未達門檻，彈性回彈至原位
          modalDialog.style.transform = 'translate3d(0, 0, 0)';
          setTimeout(() => {
            if (modal.classList.contains('active')) {
              modalDialog.style.transform = '';
            }
          }, 320);
        }

        isSwiping = false;
        isIntentionalHorizontal = false;
      };

      modalDialog.addEventListener('touchend', handleTouchEnd, { passive: true });
      modalDialog.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    }

    // 4. 支援點擊導航欄 #operations 自動跳轉並啟用吊掛分類
    const checkHashNavigation = () => {
      const hash = window.location.hash;
      if (hash === '#operations') {
        applyFilter('operations');
      }
    };

    window.addEventListener('hashchange', checkHashNavigation);
    checkHashNavigation();
  });

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

  //========================================================================
  // 常見問題 (FAQ) 折疊展開、分類篩選與即時搜尋功能
  //========================================================================
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    const categoryBtns = document.querySelectorAll('.faq-category-btn');
    const searchInput = document.getElementById('faq-search-input');
    const clearSearchBtn = document.getElementById('faq-search-clear');
    const noResultsEl = document.getElementById('faq-no-results');
    const resetFilterBtn = document.getElementById('faq-reset-filter-btn');

    if (!faqItems.length) return;

    let activeCategory = 'all';
    let searchQuery = '';

    // 1. FAQ 折疊/展開事件綁定
    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-question-btn');
      if (!btn) return;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.classList.contains('active');

        // 如需單一展開模式，可先收起其他項；此處提供平滑單項/多項自由展開體驗
        if (isOpen) {
          item.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // 2. 篩選與搜尋過濾器邏輯
    function filterFaq() {
      let visibleCount = 0;
      const normalizedQuery = searchQuery.trim().toLowerCase();

      faqItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category') || '';
        const questionText = item.querySelector('.faq-question-text')?.textContent?.toLowerCase() || '';
        const answerText = item.querySelector('.faq-answer-content')?.textContent?.toLowerCase() || '';
        
        const matchCategory = (activeCategory === 'all' || itemCategory === activeCategory);
        const matchSearch = (!normalizedQuery || questionText.includes(normalizedQuery) || answerText.includes(normalizedQuery));

        if (matchCategory && matchSearch) {
          item.style.display = 'block';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });

      // 顯示/隱藏無搜尋結果區塊
      if (noResultsEl) {
        if (visibleCount === 0) {
          noResultsEl.classList.remove('d-none');
        } else {
          noResultsEl.classList.add('d-none');
        }
      }
    }

    // 3. 分類按鈕切換
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => {
          b.classList.remove('active');
        });

        btn.classList.add('active');

        activeCategory = btn.getAttribute('data-category') || 'all';
        filterFaq();
      });
    });

    // 4. 關鍵字搜尋輸入
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (clearSearchBtn) {
          if (searchQuery.length > 0) {
            clearSearchBtn.classList.remove('d-none');
          } else {
            clearSearchBtn.classList.add('d-none');
          }
        }
        filterFaq();
      });
    }

    // 5. 清除搜尋
    if (clearSearchBtn && searchInput) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.add('d-none');
        searchInput.focus();
        filterFaq();
      });
    }

    // 6. 重設所有搜尋與分類
    if (resetFilterBtn) {
      resetFilterBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchQuery = '';
        }
        if (clearSearchBtn) clearSearchBtn.classList.add('d-none');
        
        activeCategory = 'all';
        categoryBtns.forEach((b, idx) => {
          if (idx === 0) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });
        filterFaq();
      });
    }

    // 預設展開第 1 個 FAQ 項目方便車主快速閱讀
    if (faqItems[0]) {
      faqItems[0].classList.add('active');
      const firstBtn = faqItems[0].querySelector('.faq-question-btn');
      if (firstBtn) firstBtn.setAttribute('aria-expanded', 'true');
    }
  }


