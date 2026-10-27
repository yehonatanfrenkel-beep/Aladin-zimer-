/**
 * אלאדין - בקתות ומערות בחד-נס | Main JavaScript
 * Lightweight, zero-dependency script for interactive features
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Scroll Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Mobile Drawer Navigation
  const mobileToggle = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const drawerClose = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-nav a');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // 3. Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 4. Room-Specific Slideshow Gallery (Swipe + Arrows + Touch)
  const roomGalleries = {
    aladdin1: {
      name: 'מערת אלאדין 1 – מערת אבן יוקרתית',
      slides: [
        { src: 'images/aladdin1_main.webp', caption: 'מערת אלאדין 1 – מבט פנורמי על הסוויטה, הג\'קוזי הענק וקמין העצים' },
        { src: 'images/aladdin1_jacuzzi.webp', caption: 'ג\'קוזי ענק פנורמי מול חלון המשקיף לנופי הכנרת והגולן' },
        { src: 'images/aladdin1_bed.webp', caption: 'מיטת קינג-סייז מלכותית באווירת מערה אותנטית עם נישות נרות' }
      ]
    },
    aladdin2: {
      name: 'מערת אלאדין 2 – תאורת אווירה ומרפסת נוף',
      slides: [
        { src: 'images/aladdin2_main.webp', caption: 'מערת אלאדין 2 – ג\'קוזי עגול ענק עם תאורת כרומותרפיה מתחלפת' },
        { src: 'images/aladdin2_jacuzzi.webp', caption: 'ג\'קוזי זוגי מפואר לאור נרות ורומנטיקה' },
        { src: 'images/aladdin2_bed.webp', caption: 'מיטה זוגית נעימה, קמין עצים ועיצוב אינטימי' },
        { src: 'images/aladdin2_room.webp', caption: 'חלל הסוויטה המרווח, פינת ישיבה אינטימית ומטבחון מאובזר' }
      ]
    },
    cabins: {
      name: 'בקתות העץ השוויצריות',
      slides: [
        { src: 'images/cabins_main.webp', caption: 'בקתת עץ שוויצרית כפרית מוקפת בוסתן ירוק ופרטיות' },
        { src: 'images/cabins_living.webp', caption: 'סלון כפרי מרווח ומדרגות עץ אל קומת הגלריה' },
        { src: 'images/cabins_shanti.webp', caption: 'קומת גלריה ייחודית עם פינת שאנטי מרגיעה ומזרנים מפנקים' },
        { src: 'images/cabins_jacuzzi.webp', caption: 'ג\'קוזי זוגי מפנק מול חלון עץ כפרי' }
      ]
    },
    pool: {
      name: 'גלריית תמונות',
      slides: [
        { src: 'images/pool_06.webp', caption: 'פינות ישיבה מוצלות תחת פרגולות מול נוף הכנרת' },
        { src: 'images/pool_deck.webp', caption: 'בריכת שחייה צוננת מוקפת דק עץ ומיטות שיזוף' },
        { src: 'images/slide_4.webp', caption: 'נוף פנורמי מרהיב אל הכנרת והרי הגולן' }
      ]
    }
  };

  const slideshowModal = document.getElementById('slideshowModal');
  const slideshowBackdrop = document.getElementById('slideshowBackdrop');
  const slideshowClose = document.getElementById('slideshowClose');
  const slideshowRoomName = document.getElementById('slideshowRoomName');
  const slideshowCounter = document.getElementById('slideshowCounter');
  const slideshowImg = document.getElementById('slideshowImg');
  const slideshowImgBox = document.querySelector('.slideshow-img-box');
  const slideshowCaption = document.getElementById('slideshowCaption');
  const slideshowStage = document.getElementById('slideshowStage');
  const slideshowPrev = document.getElementById('slideshowPrev');
  const slideshowNext = document.getElementById('slideshowNext');
  const slideshowDots = document.getElementById('slideshowDots');

  // Cache of preloaded image URLs
  const preloadedImages = new Set();

  function preloadImage(url) {
    if (!url || preloadedImages.has(url)) return;
    preloadedImages.add(url);
    const img = new Image();
    img.src = url;
  }

  function preloadRoom(roomKey) {
    if (!roomGalleries[roomKey]) return;
    roomGalleries[roomKey].slides.forEach(s => preloadImage(s.src));
  }

  // Preload on user touch / hover of room cards before they even click
  document.querySelectorAll('.room-gallery-trigger').forEach(trigger => {
    const rKey = trigger.getAttribute('data-room');
    if (rKey) {
      trigger.addEventListener('mouseenter', () => preloadRoom(rKey), { once: true, passive: true });
      trigger.addEventListener('touchstart', () => preloadRoom(rKey), { once: true, passive: true });
    }
  });

  // Preload all gallery images during idle time so transitions are always instant
  const scheduleIdlePreload = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
  scheduleIdlePreload(() => {
    Object.keys(roomGalleries).forEach(preloadRoom);
  });

  let currentRoomKey = null;
  let currentSlideIndex = 0;
  let slideChangeSeq = 0;

  function renderSlide(index, animate = true) {
    if (!currentRoomKey || !roomGalleries[currentRoomKey]) return;
    const room = roomGalleries[currentRoomKey];
    const total = room.slides.length;

    if (index < 0) {
      currentSlideIndex = total - 1;
    } else if (index >= total) {
      currentSlideIndex = 0;
    } else {
      currentSlideIndex = index;
    }

    const slide = room.slides[currentSlideIndex];
    const targetSrc = slide.src;
    const targetCaption = slide.caption;
    const targetSeq = ++slideChangeSeq;

    // Update textual meta and indicators immediately for crisp responsiveness
    if (slideshowCounter) slideshowCounter.textContent = `${currentSlideIndex + 1} / ${total}`;
    if (slideshowCaption) slideshowCaption.textContent = targetCaption;
    if (slideshowDots) {
      const dots = slideshowDots.querySelectorAll('.slideshow-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlideIndex);
      });
    }

    // Preload next and previous slide immediately
    preloadImage(room.slides[(currentSlideIndex + 1) % total].src);
    preloadImage(room.slides[(currentSlideIndex - 1 + total) % total].src);

    if (!slideshowImg) return;

    // Check if target image is already loaded in browser cache
    const preloader = new Image();
    preloader.src = targetSrc;

    function applyNewImage() {
      slideshowImg.src = targetSrc;
      slideshowImg.alt = targetCaption;
      if (slideshowImgBox) slideshowImgBox.classList.remove('is-loading');
      requestAnimationFrame(() => {
        slideshowImg.classList.remove('fade-out');
      });
    }

    if (preloader.complete && preloader.naturalWidth > 0) {
      // Image is already cached in memory
      if (animate) {
        slideshowImg.classList.add('fade-out');
        setTimeout(() => {
          if (slideChangeSeq !== targetSeq) return;
          applyNewImage();
        }, 60);
      } else {
        applyNewImage();
      }
    } else {
      // Image is still downloading over network (fresh cache on mobile)
      // Fade out the old image to 0 immediately so user NEVER sees the old image on the new slide!
      slideshowImg.classList.add('fade-out');
      if (slideshowImgBox) slideshowImgBox.classList.add('is-loading');

      preloader.onload = () => {
        if (slideChangeSeq !== targetSeq) return;
        applyNewImage();
      };
      preloader.onerror = () => {
        if (slideChangeSeq !== targetSeq) return;
        if (targetSrc.includes('.webp')) {
          slideshowImg.src = targetSrc.replace('.webp', '.jpg');
        }
        if (slideshowImgBox) slideshowImgBox.classList.remove('is-loading');
        slideshowImg.classList.remove('fade-out');
      };
    }
  }

  function nextSlide() {
    renderSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    renderSlide(currentSlideIndex - 1);
  }

  function openSlideshow(roomKey, startIndex = 0) {
    if (!roomGalleries[roomKey]) return;
    currentRoomKey = roomKey;
    const room = roomGalleries[roomKey];
    if (slideshowRoomName) slideshowRoomName.textContent = room.name;

    // Immediately preload all images for this room
    preloadRoom(roomKey);

    // Build dots
    if (slideshowDots) {
      slideshowDots.innerHTML = '';
      room.slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slideshow-dot' + (i === startIndex ? ' active' : '');
        dot.setAttribute('aria-label', `תמונה ${i + 1}`);
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          renderSlide(i);
        });
        slideshowDots.appendChild(dot);
      });
    }

    renderSlide(startIndex, false);
    if (slideshowModal) {
      slideshowModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Push history state so mobile / browser Back button closes gallery without leaving the website
      try {
        history.pushState({ aladinGalleryOpen: true }, '');
      } catch (err) {}

    }
  }

  function closeSlideshow(fromPopState = false) {
    if (slideshowModal && slideshowModal.classList.contains('active')) {
      slideshowModal.classList.remove('active');
      document.body.style.overflow = '';
      currentRoomKey = null;

      // If closed via UI (not via browser back button), pop the history state
      if (!fromPopState) {
        try {
          if (history.state && history.state.aladinGalleryOpen) {
            history.back();
          }
        } catch (err) {}
      }
    }
  }

  // Handle browser / mobile back button
  window.addEventListener('popstate', () => {
    if (slideshowModal && slideshowModal.classList.contains('active')) {
      closeSlideshow(true);
    }
  });

  // Attach triggers
  document.querySelectorAll('.room-gallery-trigger').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const roomKey = el.getAttribute('data-room');
      const startIndex = parseInt(el.getAttribute('data-index') || '0', 10);
      if (roomKey) openSlideshow(roomKey, startIndex);
    });
  });

  if (slideshowClose) slideshowClose.addEventListener('click', () => closeSlideshow(false));
  if (slideshowBackdrop) slideshowBackdrop.addEventListener('click', () => closeSlideshow(false));
  if (slideshowNext) slideshowNext.addEventListener('click', nextSlide);
  if (slideshowPrev) slideshowPrev.addEventListener('click', prevSlide);

  // Click / tap outside the image closes the gallery
  if (slideshowModal) {
    slideshowModal.addEventListener('click', (e) => {
      if (isSwiping) return;
      // If clicked inside the image or navigation controls, do not close
      if (
        e.target.closest('#slideshowImg') ||
        e.target.closest('.slideshow-arrow') ||
        e.target.closest('.slideshow-header') ||
        e.target.closest('.slideshow-dot') ||
        e.target.closest('.slideshow-caption')
      ) {
        return;
      }
      // Any click outside the image closes the gallery!
      closeSlideshow(false);
    });
  }

  // Touch Swipe on stage
  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  if (slideshowStage) {
    slideshowStage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
      isSwiping = false;
    }, { passive: true });

    slideshowStage.addEventListener('touchmove', (e) => {
      const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
      if (dx > 10 || dy > 10) {
        isSwiping = true;
      }
    }, { passive: true });

    slideshowStage.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 35) {
        isSwiping = true;
        if (dx < 0) {
          // Swiped left -> Next slide
          nextSlide();
        } else {
          // Swiped right -> Previous slide
          prevSlide();
        }
      }
      setTimeout(() => { isSwiping = false; }, 80);
    }, { passive: true });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (slideshowModal && slideshowModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft') nextSlide();
      if (e.key === 'ArrowRight') prevSlide();
      if (e.key === 'Escape') closeSlideshow(false);
    } else if (e.key === 'Escape') {
      closeDrawer();
    }
  });

  // Optional: Auto-open gallery via URL param e.g. ?gallery=cabins or ?gallery=aladdin1
  const urlParams = new URLSearchParams(window.location.search);
  const autoGallery = urlParams.get('gallery');
  if (autoGallery && roomGalleries[autoGallery]) {
    openSlideshow(autoGallery, 0);
  }

  // 5. Contact & Booking Form to WhatsApp
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const room = document.getElementById('formRoom').value;
      const dates = document.getElementById('formDates').value.trim();
      const notes = document.getElementById('formNotes').value.trim();

      let msg = `שלום רונית, שמי ${name} (${phone}).\n`;
      if (room) msg += `מעוניינ/ת בפרטים לגבי: ${room}.\n`;
      if (dates) msg += `תאריכים משוערים: ${dates}.\n`;
      if (notes) msg += `הערות ובקשות: ${notes}\n`;
      msg += `הגעתי דרך האתר החדש של אלאדין בחד-נס.`;

      const encodedMsg = encodeURIComponent(msg);
      window.open(`https://wa.me/972505316869?text=${encodedMsg}`, '_blank');
    });
  }

  // 6. Dynamic Year
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 7. Accessibility Toolbar & Modal (תקן ישראלי 5568 AA)
  const a11yTriggerBtn = document.getElementById('a11yTriggerBtn');
  const a11yModal = document.getElementById('a11yModal');
  const a11yCloseBtn = document.getElementById('a11yCloseBtn');
  const a11yBackdrop = document.getElementById('a11yBackdrop');
  const a11yBtnContrast = document.getElementById('a11yBtnContrast');
  const a11yBtnFontIncrease = document.getElementById('a11yBtnFontIncrease');
  const a11yBtnHighlightLinks = document.getElementById('a11yBtnHighlightLinks');
  const a11yBtnReadableFont = document.getElementById('a11yBtnReadableFont');
  const a11yBtnReset = document.getElementById('a11yBtnReset');

  function openA11yModal() {
    if (a11yModal) {
      a11yModal.classList.add('active');
      a11yModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (a11yCloseBtn) a11yCloseBtn.focus();
    }
  }

  function closeA11yModal() {
    if (a11yModal && a11yModal.classList.contains('active')) {
      a11yModal.classList.remove('active');
      a11yModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (a11yTriggerBtn) a11yTriggerBtn.focus();
    }
  }

  if (a11yTriggerBtn) a11yTriggerBtn.addEventListener('click', openA11yModal);
  if (a11yCloseBtn) a11yCloseBtn.addEventListener('click', closeA11yModal);
  if (a11yBackdrop) a11yBackdrop.addEventListener('click', closeA11yModal);

  // Footer triggers for accessibility statement
  document.querySelectorAll('.a11y-open-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openA11yModal();
    });
  });

  // State persistence in localStorage
  const A11Y_STORAGE_KEY = 'aladin_a11y_prefs';
  let a11yPrefs = {
    contrast: false,
    largeFont: false,
    highlightLinks: false,
    readableFont: false
  };

  try {
    const saved = localStorage.getItem(A11Y_STORAGE_KEY);
    if (saved) {
      a11yPrefs = Object.assign(a11yPrefs, JSON.parse(saved));
    }
  } catch (err) {}

  function applyA11yPrefs() {
    document.body.classList.toggle('a11y-contrast', !!a11yPrefs.contrast);
    document.body.classList.toggle('a11y-large-font', !!a11yPrefs.largeFont);
    document.body.classList.toggle('a11y-highlight-links', !!a11yPrefs.highlightLinks);
    document.body.classList.toggle('a11y-readable-font', !!a11yPrefs.readableFont);

    if (a11yBtnContrast) {
      a11yBtnContrast.classList.toggle('active', !!a11yPrefs.contrast);
      a11yBtnContrast.setAttribute('aria-pressed', String(!!a11yPrefs.contrast));
    }
    if (a11yBtnFontIncrease) {
      a11yBtnFontIncrease.classList.toggle('active', !!a11yPrefs.largeFont);
      a11yBtnFontIncrease.setAttribute('aria-pressed', String(!!a11yPrefs.largeFont));
    }
    if (a11yBtnHighlightLinks) {
      a11yBtnHighlightLinks.classList.toggle('active', !!a11yPrefs.highlightLinks);
      a11yBtnHighlightLinks.setAttribute('aria-pressed', String(!!a11yPrefs.highlightLinks));
    }
    if (a11yBtnReadableFont) {
      a11yBtnReadableFont.classList.toggle('active', !!a11yPrefs.readableFont);
      a11yBtnReadableFont.setAttribute('aria-pressed', String(!!a11yPrefs.readableFont));
    }

    try {
      localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(a11yPrefs));
    } catch (err) {}
  }

  // Toggle handlers
  if (a11yBtnContrast) {
    a11yBtnContrast.addEventListener('click', () => {
      a11yPrefs.contrast = !a11yPrefs.contrast;
      applyA11yPrefs();
    });
  }
  if (a11yBtnFontIncrease) {
    a11yBtnFontIncrease.addEventListener('click', () => {
      a11yPrefs.largeFont = !a11yPrefs.largeFont;
      applyA11yPrefs();
    });
  }
  if (a11yBtnHighlightLinks) {
    a11yBtnHighlightLinks.addEventListener('click', () => {
      a11yPrefs.highlightLinks = !a11yPrefs.highlightLinks;
      applyA11yPrefs();
    });
  }
  if (a11yBtnReadableFont) {
    a11yBtnReadableFont.addEventListener('click', () => {
      a11yPrefs.readableFont = !a11yPrefs.readableFont;
      applyA11yPrefs();
    });
  }
  if (a11yBtnReset) {
    a11yBtnReset.addEventListener('click', () => {
      a11yPrefs = { contrast: false, largeFont: false, highlightLinks: false, readableFont: false };
      applyA11yPrefs();
    });
  }

  // Apply on initial load
  applyA11yPrefs();

  // Escape key listener for a11y modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && a11yModal && a11yModal.classList.contains('active')) {
      closeA11yModal();
    }
  });

  // 8. FAQ Accordion Single-Open Enhancement
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item && other.open) {
            other.removeAttribute('open');
          }
        });
      }
    });
  });
});
