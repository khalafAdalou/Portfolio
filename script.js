// === Theme persist ===
const root = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved === 'light') root.classList.add('light');
document.querySelector('.theme-toggle')?.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
});

// === Smooth anchors ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// === Slider (one-at-a-time, no peeking) ===
function setupSlider(sectionId) {
  // ابحث عن السلايدر داخل السكشن أو اعتبر السكشن نفسه هو السلايدر
  const section = document.getElementById(sectionId);
  if (!section) return;
  const r = section.querySelector('.slider') || section;            // container
  const viewport = r.querySelector('.slider-viewport') || r;        // يحجب العنصر التالي
  const t = r.querySelector('.slides');                              // track
  const s = Array.from(r.querySelectorAll('.slide'));                // slides
  const d = r.querySelector('.dots');                                // dots wrap
  const p = r.querySelector('.prev');                                // prev btn
  const n = r.querySelector('.next');                                // next btn
  if (!t || !s.length) return;

  // أنشئ النقاط لو ما كانت موجودة
  if (d && !d.children.length) {
    d.innerHTML = s.map((_, k) => `<span class="dot${k === 0 ? ' active' : ''}"></span>`).join('');
  }
  const dots = d ? Array.from(d.querySelectorAll('.dot')) : [];

  let i = 0;
  let w = viewport.clientWidth;

  function render() {
    // ترجمة بالبكسل لمنع مشاكل تقريب النِسَب
    t.style.transform = `translateX(${-i * w}px)`;
    dots.forEach((x, k) => x.classList.toggle('active', k === i));
  }

  function go(k) {
    i = (k + s.length) % s.length;  // دوران
    render();
  }

  function onResize() {
    w = viewport.clientWidth;
    // ثبّت عرض كل سلايد = عرض الـ viewport حتى ما يظهر جزء من التالي
    s.forEach(el => {
      el.style.minWidth = w + 'px';
      el.style.maxWidth = w + 'px';
      el.style.flex = '0 0 ' + w + 'px';
    });
    render();
  }

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('load', onResize);

  p?.addEventListener('click', () => go(i - 1));
  n?.addEventListener('click', () => go(i + 1));
  dots.forEach((x, k) => x.addEventListener('click', () => go(k)));

  onResize();
}

// شغّل لسلايدرات السكشنات
setupSlider('projects');
setupSlider('certs');

// سنة الفوتر (يدعم id="year" أو القديم "y")
(constYear => {
  constYear && (constYear.textContent = new Date().getFullYear());
})(document.getElementById('year') || document.getElementById('y'));
