(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Language ---------- */
  function getLang() {
    try { return localStorage.getItem('lang') || 'ar'; } catch (e) { return 'ar'; }
  }
  function setLang(lang) {
    try { localStorage.setItem('lang', lang); } catch (e) {}
    var root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-ar]').forEach(function (el) {
      var val = el.getAttribute(lang === 'ar' ? 'data-ar' : 'data-en');
      if (val !== null) el.innerHTML = val;
    });
    document.querySelectorAll('[data-lang-toggle]').forEach(function (b) {
      b.textContent = lang === 'ar' ? 'EN' : 'ع';
      b.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    });
    updateProcess(currentStep);
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.rv');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Count up ---------- */
  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length || reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10);
        var start = null, dur = 1400;
        function tick(t) {
          if (!start) start = t;
          var p = Math.min((t - start) / dur, 1), eased = 1 - Math.pow(1 - p, 4);
          el.textContent = (target * eased).toFixed(dec);
          if (p < 1) requestAnimationFrame(tick);
        }
        el.textContent = (0).toFixed(dec);
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Hero screen strip + phone ---------- */
  var SHOTS = [
    { src: 'assets/sunshine/1.jpg', name: 'Sunshine', sub: 'Training studio', tech: 'Next.js', chip: 'Live', c: 'c-pink' },
    { src: 'assets/twaqq/2.png', name: 'Twaqq', sub: 'Flutter · Firebase', tech: 'Flutter', chip: 'Live', c: 'c-pink' },
    { src: 'assets/sunshine/2.jpg', name: 'Sunshine', sub: 'Packages', tech: 'Next.js', chip: 'Live', c: 'c-teal' },
    { src: 'assets/risha/1.jpg', name: 'Risha', sub: 'Graduation project', tech: 'Flutter', chip: 'Team lead', c: 'c-yellow' },
    { src: 'assets/twaqq/4.jpg', name: 'Twaqq', sub: 'Leaderboard', tech: 'Flutter', chip: 'Live', c: 'c-pink' },
    { src: 'assets/sunshine/5.jpg', name: 'Sunshine', sub: 'Private studio', tech: 'Next.js', chip: 'Live', c: 'c-teal' },
    { src: 'assets/guidor/2.jpg', name: 'Guidor', sub: 'Trip planner', tech: 'Figma', chip: 'Design', c: 'c-purple' },
    { src: 'assets/twaqq/3.png', name: 'Twaqq', sub: 'Predictions', tech: 'Flutter', chip: 'Live', c: 'c-pink' },
    { src: 'assets/sunshine/4.jpg', name: 'Sunshine', sub: 'Coach profile', tech: 'Next.js', chip: 'Live', c: 'c-teal' },
    { src: 'assets/risha/7.jpg', name: 'Risha', sub: 'Drink water', tech: 'Flutter', chip: 'Team lead', c: 'c-yellow' },
    { src: 'assets/guidor/1.jpg', name: 'Guidor', sub: 'Plan your trip', tech: 'Figma', chip: 'Design', c: 'c-purple' }
  ];
  function initStrip() {
    var track = document.getElementById('strip');
    if (!track) return;
    var html = SHOTS.concat(SHOTS).map(function (s, i) {
      return '<div class="shot"' + (i >= SHOTS.length ? ' aria-hidden="true"' : '') + '>' +
        '<img src="' + s.src + '" alt="' + (i < SHOTS.length ? s.name + ' screen' : '') + '" loading="lazy" width="212" height="380">' +
        '<div class="shot-top"><span class="chip">' + s.tech + '</span><span class="chip ' + s.c + '">' + s.chip + '</span></div>' +
        '<div class="shot-meta"><strong>' + s.name + '</strong><span>' + s.sub + '</span></div></div>';
    }).join('');
    track.innerHTML = html;
  }
  function initPhone() {
    var screen = document.getElementById('phoneScreen');
    var cap = document.getElementById('phoneCap');
    if (!screen || reduce) return;
    var imgs = screen.querySelectorAll('img');
    var caps = ['Twaqq · Flutter', 'Risha · Flutter', 'Sunshine · Next.js', 'Twaqq · Flutter', 'Sunshine · Next.js', 'Guidor · Figma'];
    var i = 0;
    setInterval(function () {
      if (document.hidden) return;
      imgs[i].classList.remove('on');
      i = (i + 1) % imgs.length;
      imgs[i].classList.add('on');
      if (cap) cap.textContent = caps[i] || '';
    }, 3200);
  }

  /* ---------- Pinned process ---------- */
  var currentStep = 0;
  var STEP_ICONS = [];
  function updateProcess(idx) {
    var steps = document.querySelectorAll('.step');
    if (!steps.length) return;
    currentStep = idx;
    var num = document.getElementById('pNum'), name = document.getElementById('pName');
    steps.forEach(function (s, i) { s.classList.toggle('on', i === idx); });
    var dots = document.querySelectorAll('.process-dots span');
    dots.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
    var step = steps[idx];
    if (num) { num.textContent = '0' + (idx + 1) + '.'; num.style.color = step.getAttribute('data-color'); }
    if (name) name.textContent = step.querySelector('h3 span').textContent;
  }
  function initProcess() {
    var steps = document.querySelectorAll('.step');
    if (!steps.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) updateProcess(Array.prototype.indexOf.call(steps, e.target));
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Active nav link ---------- */
  function initNavSpy() {
    var links = document.querySelectorAll('.nav-pill a');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || !map[e.target.id]) return;
        links.forEach(function (a) { a.classList.remove('is-active'); });
        map[e.target.id].classList.add('is-active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    var btn = document.querySelector('.menu-btn'), menu = document.getElementById('menu');
    if (!btn || !menu) return;
    function close() { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------- Lightbox (project pages) ---------- */
  function initLightbox() {
    var items = document.querySelectorAll('.gallery button');
    if (!items.length) return;
    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    var img = document.createElement('img');
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = '<i class="ph-bold ph-x" aria-hidden="true"></i>';
    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    var last = null;
    function close() { overlay.classList.remove('open'); if (last) last.focus(); }
    items.forEach(function (b) {
      b.addEventListener('click', function () {
        var src = b.querySelector('img');
        img.src = src.src; img.alt = src.alt;
        last = b;
        overlay.classList.add('open');
        closeBtn.focus();
      });
    });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initStrip();
    setLang(getLang());
    document.querySelectorAll('[data-lang-toggle]').forEach(function (b) {
      b.addEventListener('click', function () { setLang(getLang() === 'ar' ? 'en' : 'ar'); });
    });
    initReveal();
    initCounters();
    initPhone();
    initProcess();
    initNavSpy();
    initMenu();
    initLightbox();
  });
})();
