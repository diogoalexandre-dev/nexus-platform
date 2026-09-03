/* ==========================================================================
   NEXUS — auth.js
   Apoio às telas de acesso (login e cadastro).

   - Abre a aba certa quando a URL traz ?perfil=prestador ou ?perfil=contratante
     (é assim que o menu "Entrar" do site manda o visitante para o lado certo).
   - Lembra o último e-mail usado, se a pessoa marcar "lembrar de mim".
   - Mostra, no topo do cadastro, qual trilha de idade está ativa.

   Continua tudo no navegador: não existe autenticação real nesta fase.
   ========================================================================== */

(function (window, document) {
  'use strict';

  var NEXUS = window.NEXUS;
  if (!NEXUS) return;

  /* --- Seleciona a aba do perfil pela URL ---------------------------------- */

  function aplicarPerfilDaUrl() {
    var grupo = NEXUS.qs('[data-tabs]');
    if (!grupo) return;

    var perfil = new URLSearchParams(window.location.search).get('perfil');
    if (!perfil) return;

    var aba = NEXUS.qs('[data-tab="' + perfil.replace(/[^a-z]/gi, '') + '"]', grupo);
    if (aba) aba.click();
  }

  /* --- Lembrar o e-mail entre visitas -------------------------------------- */

  function inicializarLembrete() {
    NEXUS.qsa('[data-remember]').forEach(function (checkbox) {
      var form = checkbox.closest('form');
      if (!form) return;

      var campo = NEXUS.qs('input[type="email"], input[name="identificador"]', form);
      if (!campo) return;

      var chave = 'login:' + (form.getAttribute('data-perfil') || 'geral');
      var salvo = NEXUS.storage.get(chave, null);

      if (salvo) {
        campo.value = salvo;
        checkbox.checked = true;
      }

      form.addEventListener('submit', function () {
        if (checkbox.checked) {
          NEXUS.storage.set(chave, campo.value);
        } else {
          NEXUS.storage.remove(chave);
        }
      });
    });
  }

  /* --- Etiqueta da trilha de idade no cabeçalho do cadastro ---------------- */

  function inicializarEtiquetaTrilha() {
    var campo = NEXUS.qs('[data-age-gate]');
    var etiqueta = NEXUS.qs('[data-trilha-badge]');
    if (!campo || !etiqueta || !NEXUS.forms) return;

    function atualizar() {
      var idade = NEXUS.forms.calcularIdade(campo.value);

      if (idade === null) {
        etiqueta.hidden = true;
        return;
      }

      etiqueta.hidden = false;

      if (idade < NEXUS.forms.IDADE_MINIMA) {
        etiqueta.textContent = 'Abaixo da idade mínima';
        etiqueta.className = 'badge';
      } else if (idade < 18) {
        etiqueta.textContent = 'Trilha Jovem · 16 a 17 anos';
        etiqueta.className = 'badge badge--green';
      } else {
        etiqueta.textContent = 'Trilha Padrão · 18 ou mais';
        etiqueta.className = 'badge badge--green';
      }
    }

    campo.addEventListener('change', atualizar);
    campo.addEventListener('input', atualizar);
    atualizar();
  }

  document.addEventListener('DOMContentLoaded', function () {
    aplicarPerfilDaUrl();
    inicializarLembrete();
    inicializarEtiquetaTrilha();
  });
})(window, document);
