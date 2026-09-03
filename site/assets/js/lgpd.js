/* ==========================================================================
   NEXUS — lgpd.js
   Banner de consentimento de cookies (Lei 13.709/2018 — LGPD).

   A escolha do visitante fica guardada apenas no navegador dele
   (localStorage). Nada é enviado para servidor algum nesta fase do projeto.
   ========================================================================== */

(function (window, document) {
  'use strict';

  var NEXUS = window.NEXUS;
  if (!NEXUS) return;

  var CHAVE = 'consentimento-cookies';
  var VALIDADE_DIAS = 180;

  /** Lê o consentimento salvo; ignora se estiver vencido. */
  function lerConsentimento() {
    var registro = NEXUS.storage.get(CHAVE, null);
    if (!registro || !registro.data) return null;

    var idadeEmDias = (Date.now() - registro.data) / 86400000;
    if (idadeEmDias > VALIDADE_DIAS) {
      NEXUS.storage.remove(CHAVE);
      return null;
    }
    return registro;
  }

  function salvarConsentimento(nivel) {
    NEXUS.storage.set(CHAVE, {
      nivel: nivel, // 'todos' | 'essenciais'
      data: Date.now(),
      versao: '1.0'
    });
  }

  function init() {
    var bar = NEXUS.qs('[data-cookie-bar]');
    if (!bar) return;

    var jaRespondeu = lerConsentimento();

    if (!jaRespondeu) {
      window.setTimeout(function () {
        bar.classList.add('is-visible');
      }, 1200);
    }

    function responder(nivel, mensagem) {
      salvarConsentimento(nivel);
      bar.classList.remove('is-visible');
      NEXUS.toast({
        title: 'Preferência registrada',
        text: mensagem,
        type: 'info'
      });
    }

    var aceitar = NEXUS.qs('[data-cookie-accept]', bar);
    var recusar = NEXUS.qs('[data-cookie-reject]', bar);

    if (aceitar) {
      aceitar.addEventListener('click', function () {
        responder('todos', 'Você aceitou todos os cookies. Pode mudar isso quando quiser.');
      });
    }

    if (recusar) {
      recusar.addEventListener('click', function () {
        responder(
          'essenciais',
          'Apenas cookies essenciais serão usados no seu navegador.'
        );
      });
    }

    // Link "gerenciar cookies" no rodapé reabre o banner
    NEXUS.qsa('[data-cookie-manage]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        NEXUS.storage.remove(CHAVE);
        bar.classList.add('is-visible');
        bar.scrollIntoView({ block: 'nearest' });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  NEXUS.lgpd = {
    lerConsentimento: lerConsentimento,
    salvarConsentimento: salvarConsentimento
  };
})(window, document);
