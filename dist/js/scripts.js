const modules_flsModules = {};

let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    setTimeout((() => {
      lockPaddingElements.forEach((lockPaddingElement => {
        lockPaddingElement.style.paddingRight = "";
      }));
      document.body.style.paddingRight = "";
      document.documentElement.classList.remove("lock");
    }), delay);
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    }));
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.classList.add("lock");
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
function functions_FLS(message) {
  setTimeout((() => {
    if (window.FLS) console.log(message);
  }), 0);
}

let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout((() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout((() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};

function getHash() {
  if (location.hash) { return location.hash.replace('#', ''); }
}

function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter(function (item) {
    return item.dataset[dataSetValue];
  });

  if (media.length) {
    const breakpointsArray = media.map(item => {
      const params = item.dataset[dataSetValue];
      const paramsArray = params.split(",");
      return {
        value: paramsArray[0],
        type: paramsArray[1] ? paramsArray[1].trim() : "max",
        item: item
      };
    });

    const mdQueries = uniqArray(
      breakpointsArray.map(item => `(${item.type}-width: ${item.value}px),${item.value},${item.type}`)
    );

    const mdQueriesArray = mdQueries.map(breakpoint => {
      const [query, value, type] = breakpoint.split(",");
      const matchMedia = window.matchMedia(query);
      const itemsArray = breakpointsArray.filter(item => item.value === value && item.type === type);
      return { itemsArray, matchMedia };
    });

    return mdQueriesArray;
  }
}

function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}

//========================================================================================================================================================

const iconMenu = document.querySelector('.header__burger');
const headerBody = document.querySelector('.header-menu__body');

if (iconMenu) {
  iconMenu.addEventListener("click", function (e) {
    e.stopPropagation();

    document.documentElement.classList.toggle("menu-open");
  });
}

//========================================================================================================================================================

const sliders = document.querySelectorAll('.ticker-slider');

if (sliders) {
  sliders.forEach(slider => {
    const wrapper = slider.querySelector('.ticker-wrapper');
    const slides = slider.querySelectorAll('.ticker-slide');

    if (!wrapper || slides.length === 0) return;

    const isIntroSlider = slider.classList.contains('block-intro__slider');

    function shouldAnimate() {
      if (isIntroSlider) {
        return window.innerWidth > 759;
      }
      return true;
    }

    let position = 0;
    let animationId;
    const speed = 0.5;
    let isPaused = false;
    let isAnimating = false;

    function cloneSlides() {
      const cloneCount = 4;
      for (let i = 0; i < cloneCount; i++) {
        slides.forEach(slide => {
          const clone = slide.cloneNode(true);
          wrapper.appendChild(clone);
        });
      }
    }

    function removeClones() {
      const allSlides = slider.querySelectorAll('.ticker-slide');
      allSlides.forEach((slide, index) => {
        if (index >= slides.length) {
          slide.remove();
        }
      });
      position = 0;
      wrapper.style.transform = `translateX(0px)`;
    }

    function animate() {
      if (!isAnimating) return;

      if (!isPaused) {
        position -= speed;

        const totalWidth = wrapper.scrollWidth;
        if (Math.abs(position) >= totalWidth / 2) {
          position = 0;
        }

        wrapper.style.transform = `translateX(${position}px)`;
      }
      animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
      if (isAnimating) return;

      removeClones();
      cloneSlides();

      isAnimating = true;

      const allSlides = slider.querySelectorAll('.ticker-slide');
      allSlides.forEach(slide => {
        slide.addEventListener('mouseenter', () => {
          isPaused = true;
        });

        slide.addEventListener('mouseleave', () => {
          isPaused = false;
        });
      });

      animate();
    }

    function stopAnimation() {
      isAnimating = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      removeClones();
      const allSlides = slider.querySelectorAll('.ticker-slide');
      allSlides.forEach(slide => {
        slide.removeEventListener('mouseenter', () => { });
        slide.removeEventListener('mouseleave', () => { });
      });
      isPaused = false;
    }

    function checkAndToggle() {
      if (shouldAnimate()) {
        if (!isAnimating) {
          startAnimation();
        }
      } else {
        if (isAnimating) {
          stopAnimation();
        }
      }
    }

    checkAndToggle();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        checkAndToggle();
      }, 250);
    });
  });
}

//========================================================================================================================================================

if (document.querySelector('.block-buy__slider')) {
  let buyswiper = null;
  const slider = document.querySelector('.block-buy__slider');
  const breakpoint = 1919;

  function initSwiper() {
    if (window.innerWidth <= breakpoint && !buyswiper) {
      buyswiper = new Swiper(slider, {
        observer: true,
        observeParents: true,
        slidesPerView: 'auto',
        spaceBetween: 10,
        speed: 400,
        preloadImages: true,
        pagination: {
          el: '.block-buy__pagination',
          clickable: true,
        },
        breakpoints: {
          1279: {
            spaceBetween: 24,
          },
        },
      });
    } else if (window.innerWidth > breakpoint && buyswiper) {
      buyswiper.destroy(true, true);
      buyswiper = null;
    }
  }

  initSwiper();

  window.addEventListener('resize', () => {
    initSwiper();
  });
}

if (document.querySelector('.block-reviews__slider')) {
  const reviewswiper = new Swiper('.block-reviews__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 'auto',
    spaceBetween: 24,
    speed: 400,
    preloadImages: true,
    pagination: {
      el: '.block-reviews__pagination',
      clickable: true,
    },
    breakpoints: {
      1920: {
        slidesPerView: 4,
      },
    },
  });
}

//========================================================================================================================================================

//Звездный рейтинг
function formRating() {
  const ratings = document.querySelectorAll('[data-rating]');
  if (ratings) {
    ratings.forEach(rating => {
      const ratingValue = +rating.dataset.ratingValue;
      const ratingSize = +rating.dataset.ratingSize ? +rating.dataset.ratingSize : 5;
      formRatingInit(rating, ratingSize);
      ratingValue ? formRatingSet(rating, ratingValue) : null;
      document.addEventListener('click', formRatingAction);
    });
  }

  function formRatingAction(e) {
    const targetElement = e.target;
    if (targetElement.closest('.rating__input')) {
      const currentElement = targetElement.closest('.rating__input');
      const ratingValue = +currentElement.value;
      const rating = currentElement.closest('.rating');
      const ratingSet = rating.dataset.rating === 'set';
      ratingSet ? formRatingGet(rating, ratingValue) : null;
    }
  }

  function formRatingInit(rating, ratingSize) {
    let ratingItems = ``;
    for (let index = 0; index < ratingSize; index++) {
      index === 0 ? ratingItems += `<div class="rating__items">` : null;
      ratingItems += `
                <label class="rating__item">
                    <input class="rating__input" type="radio" name="rating" value="${index + 1}">
                </label>`;
      index === ratingSize ? ratingItems += `</div">` : null;
    }
    rating.insertAdjacentHTML("beforeend", ratingItems);
  }

  function formRatingGet(rating, ratingValue) {
    const resultRating = ratingValue;
    formRatingSet(rating, resultRating);
  }

  function formRatingSet(rating, value) {
    const ratingItems = rating.querySelectorAll('.rating__item');
    const resultFullItems = parseInt(value);
    const resultPartItem = value - resultFullItems;

    rating.hasAttribute('data-rating-title') ? rating.title = value : null;

    ratingItems.forEach((ratingItem, index) => {
      ratingItem.classList.remove('rating__item--active');
      ratingItem.querySelector('span') ? ratingItems[index].querySelector('span').remove() : null;

      if (index <= (resultFullItems - 1)) {
        ratingItem.classList.add('rating__item--active');
      }
      if (index === resultFullItems && resultPartItem) {
        ratingItem.insertAdjacentHTML("beforeend", `<span style="width:${resultPartItem * 100}%"></span>`);
      }
    });
  }

  function formRatingSend() {
  }
}
formRating();

//========================================================================================================================================================

//Наблюдатель
class ScrollWatcher {
  constructor(props) {
    let defaultConfig = {
      logging: true,
    }
    this.config = Object.assign(defaultConfig, props);
    this.observer;
    !document.documentElement.classList.contains('watcher') ? this.scrollWatcherRun() : null;
  }
  scrollWatcherUpdate() {
    this.scrollWatcherRun();
  }
  scrollWatcherRun() {
    document.documentElement.classList.add('watcher');
    this.scrollWatcherConstructor(document.querySelectorAll('[data-watch]'));
  }
  scrollWatcherConstructor(items) {
    if (items.length) {
      let uniqParams = uniqArray(Array.from(items).map(function (item) {
        if (item.dataset.watch === 'navigator' && !item.dataset.watchThreshold) {
          let valueOfThreshold;
          if (item.clientHeight > 2) {
            valueOfThreshold =
              window.innerHeight / 2 / (item.clientHeight - 1);
            if (valueOfThreshold > 1) {
              valueOfThreshold = 1;
            }
          } else {
            valueOfThreshold = 1;
          }
          item.setAttribute(
            'data-watch-threshold',
            valueOfThreshold.toFixed(2)
          );
        }
        return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : '0px'}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
      }));
      uniqParams.forEach(uniqParam => {
        let uniqParamArray = uniqParam.split('|');
        let paramsWatch = {
          root: uniqParamArray[0],
          margin: uniqParamArray[1],
          threshold: uniqParamArray[2]
        }
        let groupItems = Array.from(items).filter(function (item) {
          let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
          let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : '0px';
          let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
          if (
            String(watchRoot) === paramsWatch.root &&
            String(watchMargin) === paramsWatch.margin &&
            String(watchThreshold) === paramsWatch.threshold
          ) {
            return item;
          }
        });

        let configWatcher = this.getScrollWatcherConfig(paramsWatch);

        this.scrollWatcherInit(groupItems, configWatcher);
      });
    }
  }
  getScrollWatcherConfig(paramsWatch) {
    let configWatcher = {}
    if (document.querySelector(paramsWatch.root)) {
      configWatcher.root = document.querySelector(paramsWatch.root);
    }
    configWatcher.rootMargin = paramsWatch.margin;
    if (paramsWatch.margin.indexOf('px') < 0 && paramsWatch.margin.indexOf('%') < 0) {
      return
    }
    if (paramsWatch.threshold === 'prx') {
      paramsWatch.threshold = [];
      for (let i = 0; i <= 1.0; i += 0.005) {
        paramsWatch.threshold.push(i);
      }
    } else {
      paramsWatch.threshold = paramsWatch.threshold.split(',');
    }
    configWatcher.threshold = paramsWatch.threshold;

    return configWatcher;
  }
  scrollWatcherCreate(configWatcher) {
    console.log(configWatcher);
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        this.scrollWatcherCallback(entry, observer);
      });
    }, configWatcher);
  }
  scrollWatcherInit(items, configWatcher) {
    this.scrollWatcherCreate(configWatcher);
    items.forEach(item => this.observer.observe(item));
  }
  scrollWatcherIntersecting(entry, targetElement) {
    if (entry.isIntersecting) {
      if (!targetElement.classList.contains('_watcher-view')) {
        if (targetElement.hasAttribute('data-watch-duration')) {
          const duration = targetElement.dataset.watchDuration;
          targetElement.style.transition = `all ${duration}`;
        }
        if (targetElement.hasAttribute('data-watch-delay')) {
          const delay = parseInt(targetElement.dataset.watchDelay);
          setTimeout(() => {
            targetElement.classList.add('_watcher-view');
          }, delay);
        } else {
          targetElement.classList.add('_watcher-view');
        }
      }
    } else {
      if (targetElement.hasAttribute('data-watch-duration')) {
        const duration = targetElement.dataset.watchDuration;
        targetElement.style.transition = `all ${duration}`;
      }
      targetElement.classList.contains('_watcher-view') ? targetElement.classList.remove('_watcher-view') : null;
    }
  }
  scrollWatcherOff(targetElement, observer) {
    observer.unobserve(targetElement);
  }
  scrollWatcherCallback(entry, observer) {
    const targetElement = entry.target;
    this.scrollWatcherIntersecting(entry, targetElement);
    targetElement.hasAttribute('data-watch-once') && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
    document.dispatchEvent(new CustomEvent("watcherCallback", {
      detail: {
        entry: entry
      }
    }));
  }
}
modules_flsModules.watcher = new ScrollWatcher({});

//Прокрутка к блоку
let gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
  const targetBlockElement = document.querySelector(targetBlock);

  if (!targetBlockElement) {
    console.warn(`Element ${targetBlock} not found`);
    return;
  }

  let headerItem = '';
  let headerItemHeight = 0;

  if (noHeader) {
    headerItem = 'header.header';
    const headerElement = document.querySelector(headerItem);
    if (headerElement) {
      if (!headerElement.classList.contains('_header-scroll')) {
        headerElement.style.cssText = `transition-duration: 0s;`;
        headerElement.classList.add('_header-scroll');
        headerItemHeight = headerElement.offsetHeight;
        headerElement.classList.remove('_header-scroll');
        setTimeout(() => {
          headerElement.style.cssText = ``;
        }, 0);
      } else {
        headerItemHeight = headerElement.offsetHeight;
      }
    }
  }

  if (document.documentElement.classList.contains("menu-open")) {
    if (typeof menuClose === 'function') {
      menuClose();
    }
  }

  if (typeof SmoothScroll !== 'undefined') {
    let options = {
      speedAsDuration: true,
      speed: speed,
      header: headerItem,
      offset: offsetTop,
      easing: 'easeOutQuad',
    };
    new SmoothScroll().animateScroll(targetBlockElement, '', options);
  } else {
    let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + window.scrollY;

    if (headerItemHeight) {
      targetBlockElementPosition -= headerItemHeight;
    }

    if (offsetTop) {
      targetBlockElementPosition -= offsetTop;
    }

    window.scrollTo({
      top: targetBlockElementPosition,
      behavior: "smooth"
    });
  }
};
function pageNavigation() {
  document.addEventListener("click", pageNavigationAction);
  document.addEventListener("watcherCallback", pageNavigationAction);

  function pageNavigationAction(e) {
    if (e.type === "click") {
      const targetElement = e.target;
      const gotoLink = targetElement.closest('[data-goto]');

      if (gotoLink) {
        const gotoLinkSelector = gotoLink.dataset.goto || '';
        const noHeader = gotoLink.hasAttribute('data-goto-header');
        const gotoSpeed = gotoLink.dataset.gotoSpeed ? parseInt(gotoLink.dataset.gotoSpeed) : 500;
        const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;

        if (window.modules_flsModules && modules_flsModules.fullpage) {
          const fullpageSection = document.querySelector(`${gotoLinkSelector}`)?.closest('[data-fp-section]');
          const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;

          if (fullpageSectionId !== null) {
            modules_flsModules.fullpage.switchingSection(fullpageSectionId);
            if (document.documentElement.classList.contains("menu-open") && typeof menuClose === 'function') {
              menuClose();
            }
          }
        } else {
          gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
        }

        e.preventDefault();
      }
    } else if (e.type === "watcherCallback" && e.detail) {
      const entry = e.detail.entry;
      const targetElement = entry.target;

      if (targetElement.dataset.watch === 'navigator') {
        document.querySelectorAll('[data-goto]._navigator-active').forEach(el => {
          el.classList.remove('_navigator-active');
        });

        const navigatorLinks = findNavigatorLinks(targetElement);
        navigatorLinks.forEach(link => {
          if (entry.isIntersecting) {
            link.classList.add('_navigator-active');
          } else {
            link.classList.remove('_navigator-active');
          }
        });
      }
    }
  }

  function findNavigatorLinks(element) {
    const links = [];

    if (element.id) {
      const idLinks = document.querySelectorAll(`[data-goto="#${element.id}"]`);
      links.push(...idLinks);
    }

    if (element.classList.length) {
      element.classList.forEach(className => {
        const classLinks = document.querySelectorAll(`[data-goto=".${className}"]`);
        links.push(...classLinks);
      });
    }

    return links;
  }
}
pageNavigation();

//========================================================================================================================================================

const buttons = document.querySelectorAll('.block-symptoms__more-button');

if (buttons) {
  buttons.forEach(button => {
    button.addEventListener('click', function (e) {
      if (window.innerWidth <= 992) {
        const parent = this.closest('.block-symptoms__more');
        if (parent) {
          parent.classList.toggle('active');
        }
      }
    });
  });
}

//========================================================================================================================================================

//Спойлер
function spollers() {
  const spollersArray = document.querySelectorAll("[data-spollers]");
  if (spollersArray.length > 0) {
    const spollersRegular = Array.from(spollersArray).filter((function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
    }));
    if (spollersRegular.length) initSpollers(spollersRegular);

    spollersArray.forEach(spollersBlock => {
      const mediaQuery = spollersBlock.dataset.spollers;
      if (mediaQuery) {
        const [width, type] = mediaQuery.split(",");
        const size = parseInt(width);
        const trimmedType = type ? type.trim() : '';

        if (trimmedType === "min") {
          if (window.innerWidth >= size) {
            if (!spollersBlock.classList.contains("_spoller-init")) {
              initSpollers([spollersBlock]);
            }
          } else {
            if (spollersBlock.classList.contains("_spoller-init")) {
              spollersBlock.classList.remove("_spoller-init");
              showAllContent(spollersBlock);
              spollersBlock.removeEventListener("click", setSpollerAction);
            }
          }
        }
        else if (trimmedType === "max" && window.innerWidth <= size) {
          if (!spollersBlock.classList.contains("_spoller-init")) {
            initSpollers([spollersBlock]);
          }
        } else if (trimmedType === "max" && window.innerWidth > size) {
          if (spollersBlock.classList.contains("_spoller-init")) {
            spollersBlock.classList.remove("_spoller-init");
            showAllContent(spollersBlock);
            spollersBlock.removeEventListener("click", setSpollerAction);
          }
        }
      }
    });

    function showAllContent(spollersBlock) {
      const allTexts = spollersBlock.querySelectorAll('.block-compound-spollers__text');
      allTexts.forEach(text => {
        text.hidden = false;
        text.style.display = 'block';
        text.style.height = 'auto';
        text.style.opacity = '1';
      });

      const allTitles = spollersBlock.querySelectorAll('[data-spoller]');
      allTitles.forEach(title => {
        title.classList.remove('_spoller-active');
        const parent = title.parentElement;
        if (parent) {
          parent.classList.remove('_spoller-active');
        }
      });

      const allSlides = spollersBlock.querySelectorAll('.block-compound-spollers__slide');
      allSlides.forEach(slide => {
        slide.classList.remove('_spoller-active');
      });
    }

    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach((spollersBlock => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("_spoller-init");
          initSpollerBody(spollersBlock);
          spollersBlock.addEventListener("click", setSpollerAction);

          initCloseButtons(spollersBlock);
        } else {
          spollersBlock.classList.remove("_spoller-init");
          initSpollerBody(spollersBlock, false);
          spollersBlock.removeEventListener("click", setSpollerAction);
        }
      }));
    }

    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
      if (spollerTitles.length) {
        spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
        spollerTitles.forEach((spollerTitle => {
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex");
            if (!spollerTitle.classList.contains("_spoller-active")) {
              if (spollerTitle.nextElementSibling) {
                spollerTitle.nextElementSibling.hidden = true;
              }
            }
          } else {
            spollerTitle.setAttribute("tabindex", "-1");
            if (spollerTitle.nextElementSibling) {
              spollerTitle.nextElementSibling.hidden = false;
            }
          }
        }));
      }
    }

    function initCloseButtons(spollersBlock) {
      const closeButtons = spollersBlock.querySelectorAll('.cabinet-orders-spollers__button');

      closeButtons.forEach(button => {
        button.removeEventListener('click', closeSpollerHandler);
        button.addEventListener('click', closeSpollerHandler);
      });
    }

    function closeSpollerHandler(e) {
      e.preventDefault();
      e.stopPropagation();

      const button = e.currentTarget;
      const spollersBlock = button.closest('[data-spollers]');
      const spollerItem = button.closest('.cabinet-orders-spollers__item');

      if (spollersBlock && spollerItem) {
        const spollerTitle = spollerItem.querySelector('[data-spoller]');

        if (spollerTitle && spollerTitle.classList.contains('_spoller-active')) {
          const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

          spollerTitle.classList.remove('_spoller-active');
          const parent = spollerTitle.parentElement;
          if (parent) {
            parent.classList.remove('_spoller-active');
          }
          spollerItem.classList.remove('_spoller-active');

          const contentBlock = spollerTitle.nextElementSibling;
          _slideUp(contentBlock, spollerSpeed);
        }
      }
    }

    function setSpollerAction(e) {
      const el = e.target;
      const spollerTitle = el.closest("[data-spoller]");
      if (!spollerTitle) return;

      if (el.closest('a') && !spollerTitle.closest('a')) {
        return;
      }

      const spollerItem = spollerTitle.closest(".spollers__item, .cabinet-orders-spollers__item, .menu-catalog__item");
      const spollersBlock = spollerTitle.closest("[data-spollers]");

      if (!spollersBlock) return;

      const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
      const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

      if (!spollersBlock.querySelectorAll("._slide").length) {
        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) {
          hideSpollersBody(spollersBlock);
        }

        spollerTitle.classList.toggle("_spoller-active");
        const parent = spollerTitle.parentElement;
        if (parent) {
          parent.classList.toggle('_spoller-active');
        }
        if (spollerItem) spollerItem.classList.toggle("_spoller-active");

        const contentBlock = spollerTitle.nextElementSibling;
        if (contentBlock) {
          _slideToggle(contentBlock, spollerSpeed);
        }

        e.preventDefault();
      }
    }

    function hideSpollersBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
      const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
      if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
        const spollerItem = spollerActiveTitle.closest(".spollers__item, .cabinet-orders-spollers__item, .menu-catalog__item");

        spollerActiveTitle.classList.remove("_spoller-active");
        const parent = spollerActiveTitle.parentElement;
        if (parent) {
          parent.classList.remove('_spoller-active');
        }
        if (spollerItem) spollerItem.classList.remove("_spoller-active");
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
      }
    }

    const spollersClose = document.querySelectorAll("[data-spoller-close]");
    if (spollersClose.length) {
      document.addEventListener("click", (function (e) {
        const el = e.target;
        if (!el.closest("[data-spollers]")) {
          spollersClose.forEach((spollerClose => {
            const spollersBlock = spollerClose.closest("[data-spollers]");
            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
            spollerClose.classList.remove("_spoller-active");
            const parent = spollerClose.parentElement;
            if (parent) {
              parent.classList.remove('_spoller-active');
            }

            const spollerItem = spollerClose.closest(".spollers__item, .cabinet-orders-spollers__item, .menu-catalog__item");
            if (spollerItem) spollerItem.classList.remove("_spoller-active");

            _slideUp(spollerClose.nextElementSibling, spollerSpeed);
          }));
        }
      }));
    }
  }
}

function initSlideSpollers() {
  const isMobile = window.innerWidth < 1280;

  const slides = document.querySelectorAll('.block-compound-spollers__slide');

  slides.forEach(slide => {
    slide.removeEventListener('click', handleSlideClick);

    if (!isMobile) {
      slide.addEventListener('click', handleSlideClick);
    }
  });

  document.querySelectorAll('.block-compound-spollers').forEach(spollerContainer => {
    if (!isMobile) {
      updatePagination(spollerContainer);
    } else {
      const allTexts = spollerContainer.querySelectorAll('.block-compound-spollers__text');
      allTexts.forEach(text => {
        text.hidden = false;
        text.style.display = 'block';
        text.style.height = 'auto';
        text.style.opacity = '1';
      });

      const pagination = spollerContainer.querySelector('.block-compound-spollers__pagination');
      if (pagination) {
        pagination.innerHTML = '';
      }
    }
  });
}

function handleSlideClick(e) {
  if (window.innerWidth < 1280) {
    e.preventDefault();
    return;
  }

  const slide = e.currentTarget;
  const spollerTitle = slide.querySelector('[data-spoller]');

  if (!spollerTitle) return;

  const spollersBlock = slide.closest('[data-spollers]');
  if (!spollersBlock) return;

  const oneSpoller = spollersBlock.hasAttribute('data-one-spoller');
  const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

  if (oneSpoller && !spollerTitle.classList.contains('_spoller-active')) {
    const allActiveSlides = spollersBlock.querySelectorAll('.block-compound-spollers__slide._spoller-active');
    allActiveSlides.forEach(activeSlide => {
      const activeTitle = activeSlide.querySelector('[data-spoller]');
      if (activeTitle) {
        activeTitle.classList.remove('_spoller-active');
        const parent = activeTitle.parentElement;
        if (parent) {
          parent.classList.remove('_spoller-active');
        }
        activeSlide.classList.remove('_spoller-active');
        const content = activeTitle.nextElementSibling;
        if (content && content.hidden !== undefined) {
          _slideUp(content, spollerSpeed);
        }
      }
    });
  }

  spollerTitle.classList.toggle('_spoller-active');
  // Добавляем/удаляем класс у родителя
  const parent = spollerTitle.parentElement;
  if (parent) {
    parent.classList.toggle('_spoller-active');
  }
  slide.classList.toggle('_spoller-active');

  const contentBlock = spollerTitle.nextElementSibling;
  if (contentBlock) {
    _slideToggle(contentBlock, spollerSpeed);
  }

  const spollersContainer = slide.closest('.block-compound-spollers');
  if (spollersContainer) {
    updatePagination(spollersContainer);
  }

  e.preventDefault();
}

function updatePagination(spollersContainer) {
  if (window.innerWidth < 1280) {
    const pagination = spollersContainer.querySelector('.block-compound-spollers__pagination');
    if (pagination) {
      pagination.innerHTML = '';
    }
    return;
  }

  const slides = spollersContainer.querySelectorAll('.block-compound-spollers__slide');
  const pagination = spollersContainer.querySelector('.block-compound-spollers__pagination');

  if (!pagination || !slides.length) return;

  pagination.innerHTML = '';

  let activeIndex = 0;
  slides.forEach((slide, index) => {
    if (slide.classList.contains('_spoller-active')) {
      activeIndex = index;
    }
  });

  slides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.classList.add('pagination__dot');
    if (index === activeIndex) {
      dot.classList.add('_active');
    }

    dot.addEventListener('click', function () {
      if (window.innerWidth < 1280) return;

      const spollerTitle = slide.querySelector('[data-spoller]');
      if (spollerTitle) {
        if (!slide.classList.contains('_spoller-active')) {
          const spollersBlock = slide.closest('[data-spollers]');
          const oneSpoller = spollersBlock ? spollersBlock.hasAttribute('data-one-spoller') : false;
          const spollerSpeed = spollersBlock ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

          if (oneSpoller) {
            const allActiveSlides = spollersBlock.querySelectorAll('.block-compound-spollers__slide._spoller-active');
            allActiveSlides.forEach(activeSlide => {
              const activeTitle = activeSlide.querySelector('[data-spoller]');
              if (activeTitle) {
                activeTitle.classList.remove('_spoller-active');
                const parent = activeTitle.parentElement;
                if (parent) {
                  parent.classList.remove('_spoller-active');
                }
                activeSlide.classList.remove('_spoller-active');
                const content = activeTitle.nextElementSibling;
                if (content && content.hidden !== undefined) {
                  _slideUp(content, spollerSpeed);
                }
              }
            });
          }

          spollerTitle.classList.add('_spoller-active');
          const parent = spollerTitle.parentElement;
          if (parent) {
            parent.classList.add('_spoller-active');
          }
          slide.classList.add('_spoller-active');
          const contentBlock = spollerTitle.nextElementSibling;
          if (contentBlock) {
            _slideDown(contentBlock, spollerSpeed);
          }

          updatePagination(spollersContainer);
        }
      }
    });

    pagination.appendChild(dot);
  });
}

function initSpollersWithSlides() {
  if (typeof spollers === 'function') {
    spollers();
  }

  initSlideSpollers();
}

initSpollersWithSlides();

window.addEventListener('resize', function () {
  initSpollersWithSlides();
});

if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        const hasNewSlides = Array.from(mutation.addedNodes).some(node =>
          node.classList && node.classList.contains('block-compound-spollers__slide')
        );
        if (hasNewSlides) {
          const container = document.querySelector('.block-compound__wrapper');
          if (container) {
            const spollersContainer = container.querySelector('.block-compound-spollers');
            if (spollersContainer) {
              updatePagination(spollersContainer);
            }
          }
          initSlideSpollers();
        }
      }
    });
  });

  const container = document.querySelector('.block-compound__wrapper');
  if (container) {
    observer.observe(container, { childList: true, subtree: true });
  }
}

//========================================================================================================================================================

//Форма
function formFieldsInit(options = { viewPass: true, autoHeight: false }) {
  document.body.addEventListener("focusin", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.add('_form-focus');
        targetElement.parentElement.classList.add('_form-focus');
      }
      formValidate.removeError(targetElement);
    }
  });

  document.body.addEventListener("focusout", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.remove('_form-focus');
        targetElement.parentElement.classList.remove('_form-focus');
      }
      if (targetElement.hasAttribute('data-required')) {
        formValidate.validateInput(targetElement);
      }
    }
  });

  document.addEventListener('input', function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (targetElement.hasAttribute('data-required') && targetElement.classList.contains('_form-error')) {
        formValidate.validateInput(targetElement);
      }
    }
  });

  document.addEventListener('change', function (e) {
    const targetElement = e.target;
    if (targetElement.type === 'checkbox' && targetElement.hasAttribute('data-required')) {
      formValidate.validateInput(targetElement);
    }
  });

  if (options.viewPass) {
    document.addEventListener("click", function (e) {
      const targetElement = e.target;
      if (targetElement.closest('.form__viewpass')) {
        const viewpassBlock = targetElement.closest('.form__viewpass');
        const input = viewpassBlock.closest('.form__input').querySelector('input');
        if (input) {
          const isActive = viewpassBlock.classList.contains('_viewpass-active');
          input.setAttribute("type", isActive ? "password" : "text");
          viewpassBlock.classList.toggle('_viewpass-active');
        }
      }
    });
  }

  if (options.autoHeight) {
    const textareas = document.querySelectorAll('textarea[data-autoheight]');
    if (textareas.length) {
      textareas.forEach(textarea => {
        const startHeight = textarea.hasAttribute('data-autoheight-min') ?
          Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
        const maxHeight = textarea.hasAttribute('data-autoheight-max') ?
          Number(textarea.dataset.autoheightMax) : Infinity;
        setHeight(textarea, Math.min(startHeight, maxHeight));
        textarea.addEventListener('input', () => {
          if (textarea.scrollHeight > startHeight) {
            textarea.style.height = `auto`;
            setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
          }
        });
      });
      function setHeight(textarea, height) {
        textarea.style.height = `${height}px`;
      }
    }
  }
}

let formValidate = {
  getErrors(form) {
    let error = 0;
    let formRequiredItems = form.querySelectorAll('*[data-required]');
    if (formRequiredItems.length) {
      formRequiredItems.forEach(formRequiredItem => {
        if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
          error += this.validateInput(formRequiredItem);
        }
      });
    }
    return error;
  },

  validateInput(formRequiredItem) {
    let error = 0;

    if (formRequiredItem.type !== 'checkbox') {
      formRequiredItem.value = formRequiredItem.value.trim();
    }

    if (formRequiredItem.id === 'name1') {
      const value = formRequiredItem.value.trim();
      if (value.length === 0) {
        this.addError(formRequiredItem, 'Введите имя');
        this.removeSuccess(formRequiredItem);
        error++;
      } else if (value.length < 2 || value.length > 50) {
        this.addError(formRequiredItem, 'Имя должно содержать от 2 до 50 символов');
        this.removeSuccess(formRequiredItem);
        error++;
      } else if (!/^[а-яёa-z\s\-]+$/iu.test(value)) {
        this.addError(formRequiredItem, 'Допускаются только буквы, пробелы и дефис');
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    }
    else if (formRequiredItem.id === 'mail1') {
      const value = formRequiredItem.value.trim();
      if (value.length === 0) {
        this.addError(formRequiredItem, 'Введите e-mail');
        this.removeSuccess(formRequiredItem);
        error++;
      } else if (!this.emailTest(value)) {
        this.addError(formRequiredItem, 'Введите корректный e-mail');
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    }
    else if (formRequiredItem.id === 'text1') {
      const value = formRequiredItem.value.trim();
      if (value.length === 0) {
        this.addError(formRequiredItem, 'Введите сообщение');
        this.removeSuccess(formRequiredItem);
        error++;
      } else if (value.length < 10 || value.length > 1000) {
        this.addError(formRequiredItem, 'Сообщение должно содержать от 10 до 1000 символов');
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    }
    else if (formRequiredItem.type === 'checkbox') {
      if (!formRequiredItem.checked) {
        this.addError(formRequiredItem, 'Для продолжения нужно согласиться с обработкой персональных данных');
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    }

    const form = formRequiredItem.closest('form');
    if (form) {
      this.updateSubmitButton(form);
    }

    return error;
  },

  emailTest(value) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
  },

  addError(formRequiredItem, errorText) {
    formRequiredItem.classList.add('_form-error');
    formRequiredItem.parentElement.classList.add('_form-error');

    let inputError = formRequiredItem.parentElement.querySelector('.form__error');
    if (inputError) {
      formRequiredItem.parentElement.removeChild(inputError);
    }

    const errorMessage = errorText || formRequiredItem.dataset.error || 'Ошибка заполнения';
    formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div class="form__error">${errorMessage}</div>`);
  },

  removeError(formRequiredItem) {
    formRequiredItem.classList.remove('_form-error');
    formRequiredItem.parentElement.classList.remove('_form-error');
    if (formRequiredItem.parentElement.querySelector('.form__error')) {
      formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector('.form__error'));
    }
  },

  addSuccess(formRequiredItem) {
    formRequiredItem.classList.add('_form-success');
    formRequiredItem.parentElement.classList.add('_form-success');
  },

  removeSuccess(formRequiredItem) {
    formRequiredItem.classList.remove('_form-success');
    formRequiredItem.parentElement.classList.remove('_form-success');
  },

  updateSubmitButton(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    const requiredFields = form.querySelectorAll('*[data-required]');
    let allValid = true;

    requiredFields.forEach(field => {
      if (field.classList.contains('_form-error') ||
        (field.type === 'checkbox' && !field.checked) ||
        (field.type !== 'checkbox' && !field.value.trim())) {
        allValid = false;
      }
    });

    submitBtn.disabled = !allValid;
  },

  formClean(form) {
    form.reset();
    setTimeout(() => {
      let inputs = form.querySelectorAll('input,textarea');
      for (let index = 0; index < inputs.length; index++) {
        const el = inputs[index];
        el.parentElement.classList.remove('_form-focus');
        el.classList.remove('_form-focus');
        el.classList.remove('_form-success');
        el.parentElement.classList.remove('_form-success');
        el.parentElement.classList.remove('_filled');
        this.removeError(el);
      }

      let checkboxes = form.querySelectorAll('.checkbox__input');
      if (checkboxes.length > 0) {
        for (let index = 0; index < checkboxes.length; index++) {
          const checkbox = checkboxes[index];
          checkbox.checked = false;
          checkbox.classList.remove('_form-success');
          checkbox.closest('.checkbox')?.classList.remove('_form-success');
        }
      }

      this.updateSubmitButton(form);
    }, 0);
  }
};

function formStateManager() {
  const blockForms = document.querySelector('.block-forms__content');
  if (!blockForms) return null;

  const leftBlock = blockForms.querySelector('.block-forms__left');
  const form = blockForms.querySelector('.form');
  const thanksBlock = blockForms.querySelector('.form-thanks');
  const errorBlock = blockForms.querySelector('.form-error');

  function hideAllBlocks() {
    if (leftBlock) leftBlock.style.display = 'none';
    if (form) form.style.display = 'none';
    if (thanksBlock) thanksBlock.style.display = 'none';
    if (errorBlock) errorBlock.style.display = 'none';
  }

  function showBlock(block) {
    if (block) {
      block.style.display = 'flex';
    }
  }

  function showForm() {
    hideAllBlocks();
    if (leftBlock) leftBlock.style.display = 'flex';
    if (form) form.style.display = 'flex';
  }

  function showThanks() {
    hideAllBlocks();
    showBlock(thanksBlock);
  }

  function showError() {
    hideAllBlocks();
    showBlock(errorBlock);
  }

  const backButtons = blockForms.querySelectorAll('.form-thanks .btn, .form-error .btn');
  backButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      showForm();
      if (form) {
        formValidate.formClean(form);
        formValidate.updateSubmitButton(form);
      }
    });
  });

  return {
    showForm: showForm,
    showThanks: showThanks,
    showError: showError
  };
}

function formSubmit() {
  const forms = document.forms;
  const stateManager = formStateManager();

  if (forms.length) {
    for (const form of forms) {
      form.addEventListener('submit', function (e) {
        formSubmitAction(e.target, e);
      });
      form.addEventListener('reset', function (e) {
        formValidate.formClean(e.target);
      });
    }
  }

  async function formSubmitAction(form, e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');

    if (form.hasAttribute('data-dev')) {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправляем…';
      }

      setTimeout(() => {
        if (stateManager) {
          stateManager.showThanks();
        }
        formValidate.formClean(form);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Отправить';
          formValidate.updateSubmitButton(form);
        }
      }, 1500);
      return;
    }

    if (submitBtn && submitBtn.disabled) {
      return;
    }

    const error = formValidate.getErrors(form);

    if (error === 0) {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправляем…';
      }

      const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
      const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'POST';
      const formData = new FormData(form);

      try {
        const response = await fetch(formAction, {
          method: formMethod,
          body: formData
        });

        if (response.ok) {
          await response.json();
          form.classList.remove('_sending');

          if (stateManager) {
            stateManager.showThanks();
          }

          formValidate.formClean(form);
        } else {
          form.classList.remove('_sending');

          if (stateManager) {
            stateManager.showError();
          }
        }
      } catch (error) {
        form.classList.remove('_sending');

        if (stateManager) {
          stateManager.showError();
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Отправить';
          formValidate.updateSubmitButton(form);
        }
      }
    } else {
      const firstError = form.querySelector('._form-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  }
}

formFieldsInit({
  viewPass: true,
  autoHeight: false
});

formSubmit();

document.addEventListener('DOMContentLoaded', function () {
  const forms = document.forms;
  for (const form of forms) {
    const requiredFields = form.querySelectorAll('*[data-required]');
    requiredFields.forEach(field => {
      const formInput = field.closest('.form__input');
      if (formInput) {
        const label = formInput.querySelector('label');
        if (label && !label.textContent.includes('*')) {
          label.textContent = label.textContent.trim() + ' *';
        }
      }
    });

    formValidate.updateSubmitButton(form);
  }

  const thanksBlock = document.querySelector('.form-thanks');
  const errorBlock = document.querySelector('.form-error');
  if (thanksBlock) thanksBlock.style.display = 'none';
  if (errorBlock) errorBlock.style.display = 'none';
});

//========================================================================================================================================================

//Попап
class Popup {
  constructor(options) {
    let config = {
      logging: true,
      init: true,
      attributeOpenButton: "data-popup",
      attributeCloseButton: "data-close",
      fixElementSelector: "[data-lp]",
      youtubeAttribute: "data-popup-youtube",
      youtubePlaceAttribute: "data-popup-youtube-place",
      setAutoplayYoutube: true,
      classes: {
        popup: "popup",
        popupContent: "popup__content",
        popupActive: "popup_show",
        bodyActive: "popup-show"
      },
      focusCatch: true,
      closeEsc: true,
      bodyLock: true,
      hashSettings: {
        goHash: true
      },
      on: {
        beforeOpen: function () { },
        afterOpen: function () { },
        beforeClose: function () { },
        afterClose: function () { }
      }
    };
    this.youTubeCode;
    this.isOpen = false;
    this.targetOpen = {
      selector: false,
      element: false
    };
    this.previousOpen = {
      selector: false,
      element: false
    };
    this.lastClosed = {
      selector: false,
      element: false
    };
    this._dataValue = false;
    this.hash = false;
    this._reopen = false;
    this._selectorOpen = false;
    this.lastFocusEl = false;
    this._focusEl = ["a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'];
    this.options = {
      ...config,
      ...options,
      classes: {
        ...config.classes,
        ...options?.classes
      },
      hashSettings: {
        ...config.hashSettings,
        ...options?.hashSettings
      },
      on: {
        ...config.on,
        ...options?.on
      }
    };
    this.bodyLock = false;
    this.previousMenuState = false;
    this.options.init ? this.initPopups() : null;
  }
  initPopups() {
    this.eventsPopup();
  }
  eventsPopup() {
    document.addEventListener("click", function (e) {
      const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
      if (buttonOpen) {
        e.preventDefault();
        this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
        this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
        if ("error" !== this._dataValue) {
          if (!this.isOpen) this.lastFocusEl = buttonOpen;
          this.targetOpen.selector = `${this._dataValue}`;
          this._selectorOpen = true;
          this.open();
          return;
        }
        return;
      }
      const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
      if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
    }.bind(this));
    document.addEventListener("keydown", function (e) {
      if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
      if (this.options.focusCatch && 9 == e.which && this.isOpen) {
        this._focusCatch(e);
        return;
      }
    }.bind(this));
    if (this.options.hashSettings.goHash) {
      window.addEventListener("hashchange", function () {
        if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
      }.bind(this));
      window.addEventListener("load", function () {
        if (window.location.hash) this._openToHash();
      }.bind(this));
    }
  }
  open(selectorValue) {
    if (bodyLockStatus) {
      this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
      if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
        this.targetOpen.selector = selectorValue;
        this._selectorOpen = true;
      }
      if (this.isOpen) {
        this._reopen = true;
        this.close();
      }
      if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
      if (!this._reopen) this.previousActiveElement = document.activeElement;
      this.targetOpen.element = document.querySelector(this.targetOpen.selector);
      if (this.targetOpen.element) {
        this.previousMenuState = document.documentElement.classList.contains('menu-open');
        if (this.previousMenuState) {
          if (typeof menuClose === 'function') {
            menuClose();
          } else {
            document.documentElement.classList.remove("menu-open");
            if (typeof bodyUnlock === 'function') bodyUnlock();
          }
        }
        if (this.youTubeCode) {
          const codeVideo = this.youTubeCode;
          const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
          const iframe = document.createElement("iframe");
          iframe.setAttribute("allowfullscreen", "");
          const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
          iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
          iframe.setAttribute("src", urlVideo);
          if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
          }
          this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
        }
        const videoElement = this.targetOpen.element.querySelector("video");
        if (videoElement) {
          videoElement.muted = true;
          videoElement.currentTime = 0;
          videoElement.play().catch((e => console.error("Autoplay error:", e)));
        }
        if (this.options.hashSettings.location) {
          this._getHash();
          this._setHash();
        }
        this.options.on.beforeOpen(this);
        document.dispatchEvent(new CustomEvent("beforePopupOpen", {
          detail: {
            popup: this
          }
        }));
        this.targetOpen.element.classList.add(this.options.classes.popupActive);
        document.documentElement.classList.add(this.options.classes.bodyActive);
        if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
        this.targetOpen.element.setAttribute("aria-hidden", "false");
        this.previousOpen.selector = this.targetOpen.selector;
        this.previousOpen.element = this.targetOpen.element;
        this._selectorOpen = false;
        this.isOpen = true;
        this.options.on.afterOpen(this);
        document.dispatchEvent(new CustomEvent("afterPopupOpen", {
          detail: {
            popup: this
          }
        }));
      }
    }
  }
  close(selectorValue) {
    if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
    if (!this.isOpen || !bodyLockStatus) return;
    this.options.on.beforeClose(this);
    document.dispatchEvent(new CustomEvent("beforePopupClose", {
      detail: {
        popup: this
      }
    }));
    if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
    this.previousOpen.element.classList.remove(this.options.classes.popupActive);
    const videoElement = this.previousOpen.element.querySelector("video");
    if (videoElement) videoElement.pause();
    this.previousOpen.element.setAttribute("aria-hidden", "true");
    if (!this._reopen) {
      document.documentElement.classList.remove(this.options.classes.bodyActive);
      !this.bodyLock ? bodyUnlock() : null;
      this.isOpen = false;
      if (this.previousMenuState) {
        if (typeof menuOpen === 'function') {
          menuOpen();
        } else {
          document.documentElement.classList.add("menu-open");
          if (typeof bodyLock === 'function') bodyLock();
        }
      }
    }
    document.dispatchEvent(new CustomEvent("afterPopupClose", {
      detail: {
        popup: this
      }
    }));
    this.options.on.afterClose(this);
  }
  _getHash() {
    if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
  }
  _openToHash() {
    let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
    const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
    if (buttons && classInHash) this.open(classInHash);
  }
  _setHash() {
    history.pushState("", "", this.hash);
  }
  _removeHash() {
    history.pushState("", "", window.location.href.split("#")[0]);
  }
  _focusCatch(e) {
    const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);
    if (e.shiftKey && 0 === focusedIndex) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }
}
modules_flsModules.popup = new Popup({});

function menuOpen() {
  bodyLock();
  document.documentElement.classList.add("menu-open");
}
function menuClose() {
  bodyUnlock();
  document.documentElement.classList.remove("menu-open");
}

//========================================================================================================================================================

document.addEventListener('DOMContentLoaded', function () {
  initQuizLogic();
});

function initQuizLogic() {
  const quizPopups = document.querySelectorAll('.popup__content');

  quizPopups.forEach(popupContent => {
    const step1 = popupContent.querySelector('.step1');
    const step2 = popupContent.querySelector('.step2');

    if (!step1 || !step2) return;

    setupQuiz(popupContent, step1, step2);
  });
}

function setupQuiz(popupContent, step1, step2) {
  const submitBtn = step1.querySelector('button[type="submit"]');
  const checkboxes = step1.querySelectorAll('.toggle-switch input[type="checkbox"]');
  const errorMessage = step1.querySelector('.popup-quiz__error');
  const closeResultBtn = step2.querySelector('[data-close]');

  step2.style.display = 'none';
  if (errorMessage) errorMessage.style.display = 'none';

  function syncHeight() {
    const display1 = step1.style.display;
    const display2 = step2.style.display;

    step1.style.display = 'flex';
    step2.style.display = 'block';
    step2.style.visibility = 'hidden';
    step2.style.position = 'absolute';
    step2.style.opacity = '0';
    step2.style.height = 'auto';

    const step1Height = step1.offsetHeight;

    step2.style.display = 'none';
    step2.style.visibility = '';
    step2.style.position = '';
    step2.style.opacity = '';

    step2.style.minHeight = step1Height + 'px';
    step2.style.height = 'auto';

    step1.style.display = display1 || 'flex';
  }

  setTimeout(syncHeight, 50);

  let resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(syncHeight, 200);
  });

  function hasSelectedOptions() {
    let checked = false;
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        checked = true;
      }
    });
    return checked;
  }

  function resetQuiz() {
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    if (errorMessage) errorMessage.style.display = 'none';
    step1.style.display = 'flex';
    step2.style.display = 'none';
    setTimeout(syncHeight, 50);
  }

  function showResult() {
    syncHeight();
    step1.style.display = 'none';
    step2.style.display = 'flex';
    if (errorMessage) errorMessage.style.display = 'none';
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', function (e) {
      e.preventDefault();

      if (hasSelectedOptions()) {
        showResult();
      } else {
        errorMessage.style.display = 'flex';
      }
    });
  }

  const popup = popupContent.closest('.popup');
  if (popup) {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === 'class') {
          if (!popup.classList.contains('popup_show')) {
            resetQuiz();
          } else {
            setTimeout(resetQuiz, 100);
          }
        }
      });
    });
    observer.observe(popup, { attributes: true });
  }

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      if (this.checked && errorMessage.style.display === 'flex') {
        errorMessage.style.display = 'none';
      }
    });
  });
}

//========================================================================================================================================================

const cards = document.querySelectorAll('.block-compound__card');

if (cards) {
  cards.forEach(card => {
    const front = card.querySelector('.block-compound__front');
    const backside = card.querySelector('.block-compound__backside');

    function toggleFlip() {
      card.classList.toggle('flipped');
    }

    if (front) {
      front.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleFlip();
      });
    }

    if (backside) {
      backside.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleFlip();
      });
    }
  });
}

//========================================================================================================================================================

  const closeButton = document.querySelector('.block-cookie__close');
  const cookieBlock = document.querySelector('.block-cookie');

  if (closeButton && cookieBlock) {
    closeButton.addEventListener('click', function () {
      cookieBlock.classList.add("hidden")
      localStorage.setItem('cookieAccepted', 'true');
    });
  }