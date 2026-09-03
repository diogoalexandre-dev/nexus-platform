/* ==========================================================================
   NEXUS — ui.js
   Interações visuais do site:
   - revelar elementos ao rolar        - acordeão (FAQ)
   - contadores animados               - abas
   - holofote que segue o mouse        - faixa deslizante infinita
   - botão "voltar ao topo"            - filtro de categorias
   ========================================================================== */

(function (window, document) {
  'use strict';

  var NEXUS = window.NEXUS;
  if (!NEXUS) return;

  /* --- Revelar ao rolar ----------------------------------------------------- */

  function initReveal() {
    var items = NEXUS.qsa('[data-reveal]');
    if (!items.length) return;

    // Sem suporte a IntersectionObserver: mostra tudo de uma vez
    if (!('IntersectionObserver' in window) || NEXUS.prefersReducedMotion()) {
      items.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
          el.style.setProperty('--reveal-delay', delay + 'ms');
          el.classList.add('is-visible');
          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* --- Contadores animados --------------------------------------------------- */

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-counter')) || 0;
    var decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
    var duration = parseInt(el.getAttribute('data-counter-duration') || '1600', 10);

    if (NEXUS.prefersReducedMotion()) {
      el.textContent = target.toFixed(decimals).replace('.', ',');
      return;
    }

    var start = null;

    function frame(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // easeOutExpo: rápido no começo, suave no fim
      var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      var value = target * eased;

      el.textContent = decimals
        ? value.toFixed(decimals).replace('.', ',')
        : NEXUS.formatNumber(Math.round(value));

      if (progress < 1) window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
  }

  function initCounters() {
    var counters = NEXUS.qsa('[data-counter]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* --- Holofote que segue o cursor -------------------------------------------- */

  function initSpotlight() {
    var cards = NEXUS.qsa('.card--spot');
    if (!cards.length || window.matchMedia('(hover: none)').matches) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', event.clientX - rect.left + 'px');
        card.style.setProperty('--my', event.clientY - rect.top + 'px');
      });
    });
  }

  /* --- Acordeão --------------------------------------------------------------- */

  function initAccordion() {
    var items = NEXUS.qsa('[data-acc-item]');
    if (!items.length) return;

    items.forEach(function (item) {
      var trigger = NEXUS.qs('[data-acc-trigger]', item);
      var panel = NEXUS.qs('[data-acc-panel]', item);
      if (!trigger || !panel) return;

      var inner = panel.firstElementChild;

      function setOpen(open) {
        item.classList.toggle('is-open', open);
        trigger.setAttribute('aria-expanded', String(open));
        panel.style.setProperty('--acc-height', open && inner ? inner.offsetHeight + 'px' : '0px');
      }

      trigger.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Um por vez dentro do mesmo grupo
        var group = item.closest('[data-accordion]');
        if (group && !isOpen) {
          NEXUS.qsa('[data-acc-item].is-open', group).forEach(function (other) {
            other.classList.remove('is-open');
            var otherTrigger = NEXUS.qs('[data-acc-trigger]', other);
            var otherPanel = NEXUS.qs('[data-acc-panel]', other);
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherPanel) otherPanel.style.setProperty('--acc-height', '0px');
          });
        }

        setOpen(!isOpen);
      });

      // Recalcula a altura quando a janela muda de largura
      window.addEventListener(
        'resize',
        NEXUS.debounce(function () {
          if (item.classList.contains('is-open')) setOpen(true);
        }, 200)
      );
    });
  }

  /* --- Abas ------------------------------------------------------------------- */

  function initTabs() {
    var groups = NEXUS.qsa('[data-tabs]');
    if (!groups.length) return;

    groups.forEach(function (group) {
      var tabs = NEXUS.qsa('[data-tab]', group);
      var panels = NEXUS.qsa('[data-tab-panel]', group);

      function activate(name) {
        tabs.forEach(function (tab) {
          var selected = tab.getAttribute('data-tab') === name;
          tab.setAttribute('aria-selected', String(selected));
          tab.setAttribute('tabindex', selected ? '0' : '-1');
        });
        panels.forEach(function (panel) {
          panel.classList.toggle('is-active', panel.getAttribute('data-tab-panel') === name);
        });
      }

      tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () {
          activate(tab.getAttribute('data-tab'));
        });

        // Navegação por setas do teclado
        tab.addEventListener('keydown', function (event) {
          var next = null;
          if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
          if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
          if (!next) return;
          event.preventDefault();
          next.focus();
          activate(next.getAttribute('data-tab'));
        });
      });
    });
  }

  /* --- Faixa deslizante (duplica o conteúdo para o loop ser contínuo) --------- */

  function initMarquee() {
    NEXUS.qsa('[data-marquee]').forEach(function (marquee) {
      var track = NEXUS.qs('.marquee__track', marquee);
      if (!track) return;
      var clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      marquee.appendChild(clone);
    });
  }

  /* --- Voltar ao topo ---------------------------------------------------------- */

  function initToTop() {
    var button = NEXUS.qs('[data-to-top]');
    if (!button) return;

    window.addEventListener(
      'scroll',
      NEXUS.throttle(function () {
        button.classList.toggle('is-visible', window.scrollY > 620);
      }, 160),
      { passive: true }
    );

    button.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: NEXUS.prefersReducedMotion() ? 'auto' : 'smooth'
      });
    });
  }

  /* --- Filtro de categorias (página de serviços) -------------------------------- */

  function initFilter() {
    var root = NEXUS.qs('[data-filter-root]');
    if (!root) return;

    var buttons = NEXUS.qsa('[data-filter]', root);
    var searchInput = NEXUS.qs('[data-filter-search]', root);
    var cards = NEXUS.qsa('[data-category]', root);
    var counter = NEXUS.qs('[data-filter-count]', root);
    var empty = NEXUS.qs('[data-filter-empty]', root);
    var activeGroup = 'todos';

    function apply() {
      var term = NEXUS.normalize(searchInput ? searchInput.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var group = card.getAttribute('data-category');
        var haystack = NEXUS.normalize(card.textContent);
        var matchGroup = activeGroup === 'todos' || group === activeGroup;
        var matchTerm = !term || haystack.indexOf(term) !== -1;
        var show = matchGroup && matchTerm;

        card.hidden = !show;
        if (show) visible += 1;
      });

      if (counter) counter.textContent = String(visible);
      if (empty) empty.classList.toggle('is-active', visible === 0);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeGroup = button.getAttribute('data-filter');
        buttons.forEach(function (other) {
          other.classList.toggle('chip--active', other === button);
          other.setAttribute('aria-pressed', String(other === button));
        });
        apply();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', NEXUS.debounce(apply, 180));
    }

    apply();
  }

  /* --- Busca do hero: leva para a página de serviços ---------------------------- */

  function initHeroSearch() {
    var form = NEXUS.qs('[data-hero-search]');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = NEXUS.qs('input', form);
      var term = input ? input.value.trim() : '';
      var target = form.getAttribute('data-target') || 'pages/servicos.html';
      window.location.href = term ? target + '?busca=' + encodeURIComponent(term) : target;
    });
  }

  /** Preenche o campo de busca com o termo vindo da URL (?busca=). */
  function applyQueryToFilter() {
    var input = NEXUS.qs('[data-filter-search]');
    if (!input) return;
    var params = new URLSearchParams(window.location.search);
    var term = params.get('busca');
    if (term) {
      input.value = term;
      input.dispatchEvent(new Event('input'));
    }
  }

  /* --- Modal genérico ----------------------------------------------------------- */

  function initModals() {
    NEXUS.qsa('[data-modal-open]').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var modal = document.getElementById(trigger.getAttribute('data-modal-open'));
        if (!modal) return;
        modal.classList.add('is-open');
        document.body.classList.add('is-locked');
      });
    });

    NEXUS.qsa('[data-modal]').forEach(function (modal) {
      function close() {
        modal.classList.remove('is-open');
        document.body.classList.remove('is-locked');
      }

      modal.addEventListener('click', function (event) {
        if (event.target === modal || event.target.closest('[data-modal-close]')) close();
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) close();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initCounters();
    initSpotlight();
    initAccordion();
    initTabs();
    initMarquee();
    initToTop();
    initFilter();
    initHeroSearch();
    applyQueryToFilter();
    initModals();
  });
})(window, document);
