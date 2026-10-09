document.documentElement.classList.add('js');
const header = document.querySelector('[data-header]');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (menu && navigation) {
  menu.hidden = false;
  const setOpen = open => {
    menu.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  };
  menu.addEventListener('click', () => setOpen(menu.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      menu.focus();
    }
  });
  // Close the mobile menu when the layout switches back to desktop.
  window.matchMedia('(min-width: 861px)').addEventListener('change', event => { if (event.matches) setOpen(false); });
}
const filters = document.querySelector('[data-filters]');
if (filters) {
  filters.hidden = false;
  const search = document.querySelector('#search');
  const topic = document.querySelector('#topic');
  const status = document.querySelector('#status');
  const cards = [...document.querySelectorAll('[data-talk]')];
  const update = () => {
    const query = search.value.toLocaleLowerCase().trim();
    let count = 0;
    for (const card of cards) {
      card.hidden = !(card.textContent.toLocaleLowerCase().includes(query) && (topic.value === 'all' || card.dataset.topic === topic.value) && (status.value === 'all' || card.dataset.status === status.value));
      if (!card.hidden) count++;
    }
    document.querySelector('[data-count]').textContent = `${count} ${count === 1 ? 'talk' : 'talks'}`;
    document.querySelector('[data-empty]').hidden = count !== 0;
  };
  search.addEventListener('input', update);
  topic.addEventListener('change', update);
  status.addEventListener('change', update);
  document.querySelector('[data-reset]').addEventListener('click', () => { search.value = ''; topic.value = status.value = 'all'; update(); search.focus(); });
}

const heroSlider = document.querySelector('[data-hero-slider]');
if (heroSlider) {
  const slides = [...heroSlider.querySelectorAll('[data-hero-slide]')];
  const dots = [...heroSlider.querySelectorAll('[data-hero-dot]')];
  const chrome = heroSlider.querySelector('[data-hero-chrome]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = Math.max(0, slides.findIndex(slide => slide.classList.contains('is-active')));
  let timer;

  const show = next => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      for (const focusable of slide.querySelectorAll('a, button')) focusable.tabIndex = active ? 0 : -1;
    });
    dots.forEach((dot, i) => {
      dot.setAttribute('aria-selected', String(i === index));
      dot.tabIndex = i === index ? 0 : -1;
    });
  };

  const restart = () => {
    window.clearInterval(timer);
    if (reduceMotion) return;
    timer = window.setInterval(() => show(index + 1), 7000);
  };

  dots.forEach(dot => dot.addEventListener('click', () => { show(Number(dot.dataset.heroDot)); restart(); }));
  heroSlider.querySelector('[data-hero-prev]')?.addEventListener('click', () => { show(index - 1); restart(); });
  heroSlider.querySelector('[data-hero-next]')?.addEventListener('click', () => { show(index + 1); restart(); });
  heroSlider.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { show(index + 1); restart(); }
    else if (event.key === 'ArrowLeft') { show(index - 1); restart(); }
  });
  heroSlider.addEventListener('mouseenter', () => window.clearInterval(timer));
  heroSlider.addEventListener('mouseleave', restart);
  heroSlider.addEventListener('focusin', () => window.clearInterval(timer));
  heroSlider.addEventListener('focusout', restart);
  document.addEventListener('visibilitychange', () => { if (document.hidden) window.clearInterval(timer); else restart(); });

  let touchStartX = null;
  heroSlider.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') touchStartX = event.clientX; });
  heroSlider.addEventListener('pointerup', event => {
    if (touchStartX === null) return;
    const delta = event.clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(delta) < 40) return;
    show(delta < 0 ? index + 1 : index - 1);
    restart();
  });

  if (chrome) chrome.hidden = false;
  show(index);
  restart();
}

for (const link of document.querySelectorAll('[data-meeting-opens]')) {
  const opensAt = Date.parse(link.dataset.meetingOpens);
  if (!Number.isFinite(opensAt)) continue;
  const activate = () => {
    const remaining = opensAt - Date.now();
    if (remaining > 0) {
      window.setTimeout(activate, Math.min(remaining, 2147483647));
      return;
    }
    link.href = link.dataset.meetingUrl;
    link.removeAttribute('aria-disabled');
    const notice = link.parentElement.querySelector('[data-meeting-notice]');
    if (notice) notice.hidden = true;
  };
  activate();
}
