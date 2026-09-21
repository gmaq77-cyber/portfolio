(function () {
  function getLang() {
    try { return localStorage.getItem('lang') || 'ar'; } catch (e) { return 'ar'; }
  }

  function setLang(lang) {
    try { localStorage.setItem('lang', lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-en', lang === 'en');

    document.querySelectorAll('[data-ar]').forEach(function (el) {
      var val = el.getAttribute(lang === 'ar' ? 'data-ar' : 'data-en');
      if (val !== null) el.textContent = val;
    });
    document.querySelectorAll('[data-align]').forEach(function (el) {
      el.style.textAlign = lang === 'ar' ? 'right' : 'left';
    });

    var toggle = document.querySelector('[data-lang-toggle]');
    if (toggle) toggle.textContent = lang === 'ar' ? 'EN' : 'ع';
  }

  function initReveal() {
    var els = document.querySelectorAll('.rv');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(function (el) { io.observe(el); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setLang(getLang());
    var toggle = document.querySelector('[data-lang-toggle]');
    if (toggle) {
      toggle.addEventListener('click', function () {
        setLang(getLang() === 'ar' ? 'en' : 'ar');
      });
    }
    initReveal();
  });
})();
