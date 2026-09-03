/* ==========================================================================
   NEXUS — header.js
   Comportamento do cabeçalho fixo:
   - muda de aparência ao rolar a página;
   - barra de progresso de leitura;
   - menu suspenso "Entrar" (prestador / contratante);
   - menu mobile em tela cheia.
   ========================================================================== */

(function (window, document) {
  'use strict';

  var NEXUS = window.NEXUS;
  if (!NEXUS) return;

  /* --- Estado de rolagem + barra de progresso ------------------------------ */

  function initScrollState() {
    var header = NEXUS.qs('[data-header]');
    if (!header) return;

    var progress = NEXUS.qs('[data-progress]', header);

    function update() {
      var y = window.scrollY || document.documentElement.scrollTop;
      header.classList.toggle('is-scrolled', y > 24);

      if (progress) {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var ratio = docHeight > 0 ? Math.min(y / docHeight, 1) : 0;
        progress.style.setProperty('--progress', ratio.toFixed(4));
      }
    }

    window.addEventListener('scroll', NEXUS.throttle(update, 60), { passive: true });
    window.addEventListener('resize', NEXUS.debounce(update, 150));
    update();
  }

  /* --- Menu suspenso "Entrar" ---------------------------------------------- */

  function initDropdowns() {
    var dropdowns = NEXUS.qsa('[data-dropdown]');
    if (!dropdowns.length) return;

    function closeAll(except) {
      dropdowns.forEach(function (dd) {
        if (dd === except) return;
        dd.classList.remove('is-open');
        var trigger = NEXUS.qs('[data-dropdown-trigger]', dd);
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }

    dropdowns.forEach(function (dd) {
      var trigger = NEXUS.qs('[data-dropdown-trigger]', dd);
      if (!trigger) return;

      trigger.addEventListener('click', function (event) {
        event.stopPropagation();
        var willOpen = !dd.classList.contains('is-open');
        closeAll(dd);
        dd.classList.toggle('is-open', willOpen);
        trigger.setAttribute('aria-expanded', String(willOpen));
      });

      // Mantém aberto ao clicar dentro do painel
      var panel = NEXUS.qs('[data-dropdown-panel]', dd);
      if (panel) {
        panel.addEventListener('click', function (event) {
          event.stopPropagation();
        });
      }
    });

    document.addEventListener('click', function () {
      closeAll(null);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeAll(null);
    });
  }

  /* --- Menu mobile ---------------------------------------------------------- */

  function initMobileNav() {
    var toggle = NEXUS.qs('[data-nav-toggle]');
    var panel = NEXUS.qs('[data-mobile-nav]');
    if (!toggle || !panel) return;

    function setOpen(open) {
      panel.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('is-locked', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(!panel.classList.contains('is-open'));
    });

    // Fecha ao clicar em qualquer link do menu
    NEXUS.qsa('a', panel).forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && panel.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Se a tela crescer e o menu mobile sumir, destrava a rolagem
    window.addEventListener(
      'resize',
      NEXUS.debounce(function () {
        if (window.innerWidth > 1080) setOpen(false);
      }, 180)
    );
  }

  document.addEventListener('DOMContentLoaded', function () {
    initScrollState();
    initDropdowns();
    initMobileNav();
  });
})(window, document);
