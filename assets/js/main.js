(function () {
  var root = document.documentElement;

  // Tema: o script do <head> já aplicou; aqui só o botão e a cor da barra do navegador
  var toggle = document.querySelector('.theme-toggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function syncTheme(theme) {
    if (themeMeta) themeMeta.setAttribute('content', theme === 'light' ? '#f7f9fc' : '#070b14');
    if (toggle) toggle.setAttribute('aria-label', theme === 'light' ? 'Mudar para o tema escuro' : 'Mudar para o tema claro');
  }

  syncTheme(root.getAttribute('data-theme'));

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncTheme(next);
    });
  }

  // Menu do celular: fecha ao escolher seção, ao clicar fora e no Esc
  var menu = document.querySelector('.nav-mobile');
  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) menu.removeAttribute('open');
    });
    document.addEventListener('click', function (e) {
      if (menu.open && !menu.contains(e.target)) menu.removeAttribute('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.open) {
        menu.removeAttribute('open');
        menu.querySelector('summary').focus();
      }
    });
  }

  // Revelar ao rolar: o que já está na tela nunca some; o resto entra ao aparecer
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduce) {
    var limit = window.innerHeight * 0.92;
    items.forEach(function (el) {
      if (el.getBoundingClientRect().top < limit) el.classList.add('is-visible');
    });
    root.classList.add('reveal-ready');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) {
      if (el.classList.contains('is-visible')) return;
      var index = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = Math.min(index, 5) * 50 + 'ms';
      io.observe(el);
    });
  }

  // Menu marca a seção atual
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-desktop a'));
  if ('IntersectionObserver' in window && links.length) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (!link || !entry.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.remove('is-active');
          l.removeAttribute('aria-current');
        });
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }
})();
