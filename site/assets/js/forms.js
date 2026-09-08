/* ==========================================================================
   NEXUS — forms.js
   Tudo que envolve formulários:
   - máscaras (CPF, CNPJ, telefone, CEP);
   - validação campo a campo, incluindo dígitos verificadores;
   - regra de idade mínima de 16 anos e consentimento do responsável legal
     para quem tem 16 ou 17 (LGPD art. 14 + ECA);
   - medidor de força de senha;
   - navegação por etapas do cadastro;
   - envio SIMULADO (nenhum dado sai do navegador — não há banco de dados).
   ========================================================================== */

(function (window, document) {
  'use strict';

  var NEXUS = window.NEXUS;
  if (!NEXUS) return;

  var IDADE_MINIMA = 16;
  var IDADE_MAIORIDADE = 18;

  /* ======================================================================
     1. MÁSCARAS
     ====================================================================== */

  var masks = {
    cpf: function (value) {
      return value
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    },
    cnpj: function (value) {
      return value
        .replace(/\D/g, '')
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    },
    telefone: function (value) {
      var digits = value.replace(/\D/g, '').slice(0, 11);
      if (digits.length <= 10) {
        return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})$/, '$1-$2');
      }
      return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
    },
    cep: function (value) {
      return value
        .replace(/\D/g, '')
        .slice(0, 8)
        .replace(/(\d{5})(\d{1,3})$/, '$1-$2');
    }
  };

  function initMasks(scope) {
    NEXUS.qsa('[data-mask]', scope).forEach(function (input) {
      var type = input.getAttribute('data-mask');
      var mask = masks[type];
      if (!mask) return;

      input.addEventListener('input', function () {
        var start = input.selectionStart;
        var lengthBefore = input.value.length;
        input.value = mask(input.value);
        // Mantém o cursor no lugar quando o usuário edita no meio do texto
        if (start !== null && start < lengthBefore) {
          var diff = input.value.length - lengthBefore;
          input.setSelectionRange(start + diff, start + diff);
        }
      });
    });
  }

  /* ======================================================================
     2. VALIDADORES
     ====================================================================== */

  var validators = {
    /** Dígitos verificadores reais do CPF. */
    cpf: function (value) {
      var cpf = String(value).replace(/\D/g, '');
      if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

      var i;
      var sum = 0;
      for (i = 0; i < 9; i += 1) sum += parseInt(cpf.charAt(i), 10) * (10 - i);
      var first = (sum * 10) % 11;
      if (first === 10) first = 0;
      if (first !== parseInt(cpf.charAt(9), 10)) return false;

      sum = 0;
      for (i = 0; i < 10; i += 1) sum += parseInt(cpf.charAt(i), 10) * (11 - i);
      var second = (sum * 10) % 11;
      if (second === 10) second = 0;
      return second === parseInt(cpf.charAt(10), 10);
    },

    /** Dígitos verificadores reais do CNPJ. */
    cnpj: function (value) {
      var cnpj = String(value).replace(/\D/g, '');
      if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

      function digit(length) {
        var numbers = cnpj.substring(0, length);
        var pos = length - 7;
        var sum = 0;
        for (var i = length; i >= 1; i -= 1) {
          sum += parseInt(numbers.charAt(length - i), 10) * pos;
          pos -= 1;
          if (pos < 2) pos = 9;
        }
        var result = sum % 11;
        return result < 2 ? 0 : 11 - result;
      }

      return (
        digit(12) === parseInt(cnpj.charAt(12), 10) &&
        digit(13) === parseInt(cnpj.charAt(13), 10)
      );
    },

    email: function (value) {
      return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(String(value).trim());
    },

    telefone: function (value) {
      var digits = String(value).replace(/\D/g, '');
      return digits.length === 10 || digits.length === 11;
    },

    url: function (value) {
      if (!value) return true;
      return /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(String(value).trim());
    },

    cep: function (value) {
      return /^\d{5}-?\d{3}$/.test(String(value).trim());
    }
  };

  /** Calcula a idade em anos completos a partir de uma data ISO (aaaa-mm-dd). */
  function calcularIdade(isoDate) {
    if (!isoDate) return null;
    var parts = String(isoDate).split('-');
    if (parts.length !== 3) return null;

    var birth = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (isNaN(birth.getTime())) return null;

    var today = new Date();
    var age = today.getFullYear() - birth.getFullYear();
    var monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age -= 1;
    }
    return age;
  }

  NEXUS.calcularIdade = calcularIdade;

  /* --- Mensagens de erro por campo ------------------------------------------ */

  function getField(input) {
    return input.closest('.field') || input.closest('.check') || input.parentElement;
  }

  function setError(input, message) {
    var field = getField(input);
    if (!field) return;

    field.classList.add('has-error');
    field.classList.remove('is-valid');
    input.setAttribute('aria-invalid', 'true');

    var errorEl = NEXUS.qs('.field__error', field);
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'field__error';
      field.appendChild(errorEl);
    }
    errorEl.innerHTML =
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg><span></span>';
    errorEl.querySelector('span').textContent = message;
  }

  function clearError(input) {
    var field = getField(input);
    if (!field) return;
    field.classList.remove('has-error');
    input.removeAttribute('aria-invalid');
    if (input.value && String(input.value).trim()) field.classList.add('is-valid');
  }

  /**
   * Valida um único campo. Retorna true/false.
   * As regras vêm dos atributos do HTML: required, type, data-validate, minlength.
   */
  function validateInput(input) {
    if (input.disabled || input.type === 'hidden') return true;

    // Ignora campos dentro de blocos condicionais fechados
    var conditional = input.closest('.conditional');
    if (conditional && !conditional.classList.contains('is-open')) return true;

    var value = input.type === 'checkbox' ? input.checked : String(input.value || '').trim();
    var rule = input.getAttribute('data-validate');
    var label = input.getAttribute('data-label') || 'Este campo';

    // 1. Obrigatório
    if (input.required && (value === '' || value === false)) {
      setError(
        input,
        input.type === 'checkbox' ? 'É necessário marcar esta opção para continuar.' : label + ' é obrigatório.'
      );
      return false;
    }

    if (value === '' || value === false) {
      clearError(input);
      return true;
    }

    // Protótipo: aceita qualquer formato nos campos de cadastro (CPF, CNPJ,
    // e-mail, telefone, CEP, URL, tamanho mínimo, força de senha e
    // confirmação de senha não bloqueiam mais o envio). A única regra de
    // negócio mantida é a idade mínima da plataforma, abaixo.

    // Data de nascimento com idade mínima
    if (rule === 'nascimento') {
      var idade = calcularIdade(value);
      if (idade === null) {
        setError(input, 'Data inválida.');
        return false;
      }
      if (idade < IDADE_MINIMA) {
        setError(
          input,
          'A NEXUS atende a partir de ' + IDADE_MINIMA + ' anos. Você tem ' + idade + '.'
        );
        return false;
      }
      if (idade > 110) {
        setError(input, 'Data de nascimento improvável. Confira o ano.');
        return false;
      }
    }

    clearError(input);
    return true;
  }

  /** Valida todos os campos dentro de um container. */
  function validateScope(scope) {
    var inputs = NEXUS.qsa('input, select, textarea', scope);
    var firstInvalid = null;
    var valid = true;

    inputs.forEach(function (input) {
      if (!validateInput(input)) {
        valid = false;
        if (!firstInvalid) firstInvalid = input;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }

    return valid;
  }

  /* ======================================================================
     3. FORÇA DA SENHA
     ====================================================================== */

  function passwordScore(value) {
    var score = 0;
    if (value.length >= 8) score += 1;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value) || value.length >= 14) score += 1;
    return score;
  }

  var LABELS = ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Excelente'];

  function initPasswordStrength(scope) {
    NEXUS.qsa('[data-strength-for]', scope).forEach(function (meter) {
      var input = document.getElementById(meter.getAttribute('data-strength-for'));
      if (!input) return;

      var label = NEXUS.qs('.strength__label', meter);
      var rules = NEXUS.qsa('.strength__rules li', meter);

      input.addEventListener('input', function () {
        var value = input.value;
        var score = value ? passwordScore(value) : 0;

        meter.setAttribute('data-level', String(score));
        if (label) label.textContent = value ? LABELS[score] : 'Força da senha';

        rules.forEach(function (li) {
          var rule = li.getAttribute('data-rule');
          var ok = false;
          if (rule === 'length') ok = value.length >= 8;
          if (rule === 'case') ok = /[a-z]/.test(value) && /[A-Z]/.test(value);
          if (rule === 'number') ok = /\d/.test(value);
          if (rule === 'symbol') ok = /[^A-Za-z0-9]/.test(value);
          li.classList.toggle('ok', ok);
        });
      });
    });
  }

  /** Botão de olho: mostra/esconde a senha. */
  function initPasswordToggle(scope) {
    NEXUS.qsa('[data-toggle-password]', scope).forEach(function (button) {
      button.addEventListener('click', function () {
        var input = document.getElementById(button.getAttribute('data-toggle-password'));
        if (!input) return;
        var showing = input.type === 'text';
        input.type = showing ? 'password' : 'text';
        button.setAttribute('aria-label', showing ? 'Mostrar senha' : 'Ocultar senha');
        button.classList.toggle('is-on', !showing);
      });
    });
  }

  /* ======================================================================
     4. REGRA DE IDADE — RESPONSÁVEL LEGAL (16 e 17 anos)
     ====================================================================== */

  /**
   * Lê a data de nascimento e separa o cadastro em duas SEÇÕES distintas:
   *
   *   16 ou 17 anos  -> Trilha Jovem: ganha a etapa "Responsável legal",
   *                     obrigatória pela LGPD (art. 14) e pelo ECA.
   *   18 anos ou mais -> Trilha Padrão: essa etapa simplesmente não existe.
   *
   * Ninguém é impedido de se cadastrar por ser menor de 18: a idade só decide
   * QUAL caminho a pessoa percorre. Abaixo de 16 (idade mínima da plataforma)
   * o campo aponta o aviso, sem travar a tela.
   */
  function initAgeGate(scope) {
    var input = NEXUS.qs('[data-age-gate]', scope);
    if (!input) return;

    var form = input.closest('form') || document;
    var painel = NEXUS.qs('[data-age-result]', form);
    var titulo = NEXUS.qs('[data-age-title]', form);
    var texto = NEXUS.qs('[data-age-text]', form);
    var etapaResponsavel = NEXUS.qs('[data-step-guardian]', form);
    var blocoInterno = NEXUS.qs('[data-guardian-block]', form);

    function alternarSecaoJovem(ativa) {
      // A etapa inteira entra ou sai do fluxo
      if (etapaResponsavel) {
        var mudou = etapaResponsavel.hidden === ativa;
        etapaResponsavel.hidden = !ativa;
        NEXUS.qsa('input, select, textarea', etapaResponsavel).forEach(function (el) {
          el.disabled = !ativa;
        });
        if (mudou) form.dispatchEvent(new CustomEvent('nexus:etapas-mudaram'));
      }

      // Variante em bloco embutido (usada em formulários de uma página só)
      if (blocoInterno) {
        blocoInterno.classList.toggle('is-open', ativa);
        NEXUS.qsa('input, select, textarea', blocoInterno).forEach(function (el) {
          el.disabled = !ativa;
        });
      }
    }

    function update() {
      var idade = calcularIdade(input.value);

      if (idade === null) {
        alternarSecaoJovem(false);
        if (painel) painel.hidden = true;
        return;
      }

      var trilhaJovem = idade >= IDADE_MINIMA && idade < IDADE_MAIORIDADE;
      var abaixoDoMinimo = idade < IDADE_MINIMA;

      alternarSecaoJovem(trilhaJovem);

      if (painel) {
        painel.hidden = false;
        painel.className =
          'alert alert--' + (abaixoDoMinimo ? 'warning' : trilhaJovem ? 'info' : 'green');

        if (titulo && texto) {
          if (abaixoDoMinimo) {
            titulo.textContent = idade + ' anos — abaixo da idade mínima';
            texto.textContent =
              'A NEXUS atende a partir de ' + IDADE_MINIMA + ' anos. Volte quando completar ' +
              IDADE_MINIMA + ' — a NEXUS Academy vai estar aqui.';
          } else if (trilhaJovem) {
            titulo.textContent = idade + ' anos — Trilha Jovem (16 a 17)';
            texto.textContent =
              'Seu cadastro segue por um caminho próprio: foi acrescentada a etapa "Responsável legal", ' +
              'onde o consentimento de quem responde por você é registrado, como pedem a LGPD (art. 14) e o ECA.';
          } else {
            titulo.textContent = idade + ' anos — Trilha Padrão (18 ou mais)';
            texto.textContent =
              'Você conclui o cadastro sozinho. A etapa de responsável legal não se aplica ao seu caso e foi removida do fluxo.';
          }
        }
      }

      validateInput(input);
    }

    input.addEventListener('change', update);
    input.addEventListener('input', update);
    input.addEventListener('blur', update);
    update();
  }

  /* ----------------------------------------------------------------------
     Campos condicionais genéricos
     Ex.: <select data-toggle-target="#bloco-cnpj" data-toggle-when="mei,empresa">
     Mostra o bloco só quando o valor escolhido estiver na lista.
     ---------------------------------------------------------------------- */

  function initConditionalToggles(scope) {
    var controles = NEXUS.qsa('[data-toggle-target]', scope);
    if (!controles.length) return;

    // Agrupa por alvo para que rádios do mesmo grupo funcionem juntos
    var alvos = {};
    controles.forEach(function (controle) {
      var seletor = controle.getAttribute('data-toggle-target');
      if (!alvos[seletor]) alvos[seletor] = [];
      alvos[seletor].push(controle);
    });

    Object.keys(alvos).forEach(function (seletor) {
      var alvo = NEXUS.qs(seletor, document);
      if (!alvo) return;

      function avaliar() {
        var mostrar = alvos[seletor].some(function (controle) {
          var quando = (controle.getAttribute('data-toggle-when') || '')
            .split(',')
            .map(function (v) { return v.trim(); })
            .filter(Boolean);

          var valor =
            controle.type === 'checkbox'
              ? controle.checked ? controle.value || 'on' : ''
              : controle.type === 'radio'
                ? controle.checked ? controle.value : ''
                : controle.value;

          return valor !== '' && (quando.length === 0 || quando.indexOf(valor) !== -1);
        });

        alvo.classList.toggle('is-open', mostrar);
        NEXUS.qsa('input, select, textarea', alvo).forEach(function (el) {
          el.disabled = !mostrar;
        });
      }

      alvos[seletor].forEach(function (controle) {
        controle.addEventListener('change', avaliar);
        controle.addEventListener('input', avaliar);
      });

      avaliar();
    });
  }

  /* ======================================================================
     5. CADASTRO EM ETAPAS
     ====================================================================== */

  function initStepper(form) {
    var todosPaineis = NEXUS.qsa('[data-step-panel]', form);
    if (todosPaineis.length < 2) return null;

    var todosItens = NEXUS.qsa('[data-step-item]', form);
    var fill = NEXUS.qs('[data-step-fill]', form);
    var btnPrev = NEXUS.qs('[data-step-prev]', form);
    var btnNext = NEXUS.qs('[data-step-next]', form);
    var btnSubmit = NEXUS.qs('[data-step-submit]', form);

    // Painel atualmente em foco (guardado pelo elemento, não pelo índice:
    // etapas podem aparecer e sumir conforme a idade informada)
    var atual = todosPaineis[0];
    var jaRenderizou = false;

    /** Só as etapas visíveis contam — a de responsável legal some para 18+. */
    function visiveis() {
      return todosPaineis.filter(function (panel) {
        return !panel.hidden;
      });
    }

    function render() {
      var lista = visiveis();
      if (lista.indexOf(atual) === -1) atual = lista[0];
      var indice = lista.indexOf(atual);

      todosPaineis.forEach(function (panel) {
        panel.classList.toggle('is-active', panel === atual && !panel.hidden);
      });

      // Marcadores do topo acompanham as etapas visíveis
      var passo = 0;
      todosItens.forEach(function (item) {
        var alvo = NEXUS.qs(item.getAttribute('data-step-item'), form);
        var oculto = alvo ? alvo.hidden : false;
        item.hidden = oculto;
        if (oculto) return;

        item.classList.toggle('is-active', passo === indice);
        item.classList.toggle('is-done', passo < indice);

        var numero = NEXUS.qs('.num', item);
        if (numero) numero.textContent = String(passo + 1).padStart(2, '0');
        passo += 1;
      });

      if (fill) {
        fill.style.setProperty('--step-progress', ((indice + 1) / lista.length) * 100 + '%');
      }

      if (btnPrev) btnPrev.hidden = indice === 0;
      if (btnNext) btnNext.hidden = indice === lista.length - 1;
      if (btnSubmit) btnSubmit.hidden = indice !== lista.length - 1;

      // Não rola a tela na primeira montagem, só quando o usuário troca de etapa
      if (jaRenderizou) {
        form.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
      jaRenderizou = true;
    }

    function mover(direcao) {
      var lista = visiveis();
      var indice = lista.indexOf(atual) + direcao;
      if (indice < 0 || indice >= lista.length) return;
      atual = lista[indice];
      render();
    }

    if (btnNext) {
      btnNext.addEventListener('click', function () {
        if (!validateScope(atual)) {
          NEXUS.toast({
            type: 'error',
            title: 'Confira os campos',
            text: 'Alguns dados desta etapa precisam de ajuste.'
          });
          return;
        }
        mover(1);
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', function () {
        mover(-1);
      });
    }

    render();

    // A verificação de idade avisa quando uma etapa entra ou sai da lista
    form.addEventListener('nexus:etapas-mudaram', render);

    return {
      panels: todosPaineis,
      render: render
    };
  }

  /* ======================================================================
     6. ENVIO SIMULADO
     Não há back-end nem banco de dados nesta fase. O formulário monta o
     objeto que SERIA enviado à API e mostra na tela, para conferência.
     ====================================================================== */

  function collectData(form) {
    var data = {};
    NEXUS.qsa('input, select, textarea', form).forEach(function (input) {
      if (!input.name || input.disabled) return;

      if (input.type === 'checkbox') {
        if (input.hasAttribute('data-multi')) {
          if (!Array.isArray(data[input.name])) data[input.name] = [];
          if (input.checked) data[input.name].push(input.value);
        } else {
          data[input.name] = input.checked;
        }
        return;
      }

      if (input.type === 'radio') {
        if (input.checked) data[input.name] = input.value;
        return;
      }

      // Nunca exibimos a senha em tela
      if (input.type === 'password') {
        data[input.name] = '••••••••';
        return;
      }

      data[input.name] = input.value;
    });
    return data;
  }

  function initFormSubmit(form) {
    var stepper = initStepper(form);
    var successPanel = NEXUS.qs(form.getAttribute('data-success-target') || '#nada');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var scope = stepper && stepper.panels.length ? form : form;
      if (!validateScope(scope)) {
        NEXUS.toast({
          type: 'error',
          title: 'Não foi possível enviar',
          text: 'Revise os campos destacados em vermelho.'
        });
        return;
      }

      var button = NEXUS.qs('[type="submit"]', form);
      if (button) button.classList.add('is-loading');

      // Simula a latência de uma chamada de API
      window.setTimeout(function () {
        if (button) button.classList.remove('is-loading');

        var data = collectData(form);
        var redirect = form.getAttribute('data-redirect');

        if (successPanel) {
          form.hidden = true;
          successPanel.classList.add('is-active');
          var dump = NEXUS.qs('[data-success-dump]', successPanel);
          if (dump) dump.textContent = JSON.stringify(data, null, 2);
          successPanel.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }

        NEXUS.toast({
          title: form.getAttribute('data-success-title') || 'Enviado com sucesso',
          text:
            form.getAttribute('data-success-text') ||
            'Cadastro simulado — nenhum dado foi transmitido.'
        });

        if (redirect) {
          window.setTimeout(function () {
            window.location.href = redirect;
          }, 1600);
        }
      }, 900);
    });
  }

  /* ======================================================================
     7. INICIALIZAÇÃO
     ====================================================================== */

  document.addEventListener('DOMContentLoaded', function () {
    initMasks(document);
    initPasswordStrength(document);
    initPasswordToggle(document);
    initConditionalToggles(document);
    initAgeGate(document);

    NEXUS.qsa('[data-form]').forEach(function (form) {
      form.setAttribute('novalidate', 'novalidate');
      initFormSubmit(form);

      // Valida ao sair do campo — mas só se algo foi digitado. Cobrar campo
      // vazio antes da hora atrapalha quem ainda está preenchendo; a checagem
      // do obrigatório acontece ao avançar de etapa ou ao enviar.
      NEXUS.qsa('input, select, textarea', form).forEach(function (input) {
        input.addEventListener('blur', function () {
          if (String(input.value || '').trim()) validateInput(input);
        });
        input.addEventListener('input', function () {
          var field = getField(input);
          if (field && field.classList.contains('has-error')) validateInput(input);
        });
      });
    });

    // Contador de caracteres em textareas
    NEXUS.qsa('[data-count-for]').forEach(function (counter) {
      var input = document.getElementById(counter.getAttribute('data-count-for'));
      if (!input) return;
      var max = parseInt(input.getAttribute('maxlength') || '0', 10);

      function update() {
        counter.textContent = input.value.length + (max ? ' / ' + max : '');
        counter.classList.toggle('is-over', max > 0 && input.value.length > max);
      }

      input.addEventListener('input', update);
      update();
    });
  });

  // Exposto para reuso em outras páginas
  NEXUS.forms = {
    validators: validators,
    masks: masks,
    validateInput: validateInput,
    validateScope: validateScope,
    passwordScore: passwordScore,
    calcularIdade: calcularIdade,
    IDADE_MINIMA: IDADE_MINIMA
  };
})(window, document);
