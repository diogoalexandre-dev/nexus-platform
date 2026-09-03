/* ==========================================================================
   NEXUS — core.js
   Base compartilhada por todos os outros scripts: atalhos de seleção,
   armazenamento local, avisos flutuantes (toast) e utilitários gerais.

   Este arquivo cria o objeto global `window.NEXUS`. Todos os demais scripts
   penduram suas funções nele, então ele PRECISA ser carregado primeiro.
   ========================================================================== */

(function (window, document) {
  'use strict';

  var NEXUS = window.NEXUS || {};

  /* --- Seleção de elementos ----------------------------------------------- */

  /** Retorna o primeiro elemento que casa com o seletor. */
  NEXUS.qs = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  /** Retorna um array (não NodeList) com todos os elementos encontrados. */
  NEXUS.qsa = function (selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  };

  /* --- Utilitários gerais --------------------------------------------------- */

  /** Limita a frequência de execução de uma função (usado no scroll). */
  NEXUS.throttle = function (fn, wait) {
    var last = 0;
    var timer = null;
    return function () {
      var now = Date.now();
      var args = arguments;
      var context = this;
      if (now - last >= wait) {
        last = now;
        fn.apply(context, args);
      } else if (!timer) {
        timer = window.setTimeout(function () {
          last = Date.now();
          timer = null;
          fn.apply(context, args);
        }, wait - (now - last));
      }
    };
  };

  /** Adia a execução até que o usuário pare de digitar/rolar. */
  NEXUS.debounce = function (fn, wait) {
    var timer = null;
    return function () {
      var args = arguments;
      var context = this;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        fn.apply(context, args);
      }, wait);
    };
  };

  /** true quando o visitante pediu menos animação no sistema operacional. */
  NEXUS.prefersReducedMotion = function () {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /** Remove acentos e deixa minúsculo — usado nos filtros de busca. */
  NEXUS.normalize = function (text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .trim();
  };

  /** Formata número no padrão brasileiro. */
  NEXUS.formatNumber = function (value) {
    try {
      return new Intl.NumberFormat('pt-BR').format(value);
    } catch (e) {
      return String(value);
    }
  };

  /* --- Armazenamento local (com proteção contra navegação privada) ---------- */

  NEXUS.storage = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem('nexus:' + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        window.localStorage.setItem('nexus:' + key, JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    },
    remove: function (key) {
      try {
        window.localStorage.removeItem('nexus:' + key);
      } catch (e) {
        /* ignora */
      }
    }
  };

  /* --- Avisos flutuantes (toast) -------------------------------------------- */

  var ICONS = {
    success:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    error:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>',
    info:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
  };

  function getToastRegion() {
    var region = NEXUS.qs('[data-toast-region]');
    if (!region) {
      region = document.createElement('div');
      region.className = 'toast-region';
      region.setAttribute('data-toast-region', '');
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    return region;
  }

  /**
   * Mostra um aviso no canto superior direito.
   * @param {Object} options - { title, text, type: 'success'|'error'|'info', duration }
   */
  NEXUS.toast = function (options) {
    var opts = options || {};
    var type = opts.type || 'success';
    var region = getToastRegion();

    var el = document.createElement('div');
    el.className = 'toast' + (type !== 'success' ? ' toast--' + type : '');
    el.innerHTML =
      '<span class="toast__icon">' + (ICONS[type] || ICONS.info) + '</span>' +
      '<div><p class="toast__title"></p><p class="toast__text"></p></div>' +
      '<button class="toast__close" type="button" aria-label="Fechar aviso">' +
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
      '</button>';

    // textContent evita injeção de HTML vindo de campos de formulário
    el.querySelector('.toast__title').textContent = opts.title || 'Pronto';
    var textEl = el.querySelector('.toast__text');
    if (opts.text) {
      textEl.textContent = opts.text;
    } else {
      textEl.remove();
    }

    function dismiss() {
      el.classList.add('is-leaving');
      window.setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 260);
    }

    el.querySelector('.toast__close').addEventListener('click', dismiss);
    region.appendChild(el);
    window.setTimeout(dismiss, opts.duration || 4800);

    return el;
  };

  /* --- Ano corrente no rodapé ------------------------------------------------ */

  NEXUS.setCurrentYear = function () {
    NEXUS.qsa('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  };

  /* --- Marca o link do menu correspondente à página aberta ------------------- */

  NEXUS.markActiveNav = function () {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    NEXUS.qsa('[data-nav-page]').forEach(function (link) {
      if (link.getAttribute('data-nav-page') === current) {
        link.setAttribute('aria-current', 'page');
      }
    });
  };

  window.NEXUS = NEXUS;

  document.addEventListener('DOMContentLoaded', function () {
    NEXUS.setCurrentYear();
    NEXUS.markActiveNav();
  });
})(window, document);
