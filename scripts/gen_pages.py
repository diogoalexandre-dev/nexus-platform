# -*- coding: utf-8 -*-
"""Gera as paginas internas que faltam no site, reaproveitando o CSS/JS
existente. Script de uso unico — nao faz parte do site publicado."""
import io
import os

ROOT = os.path.join(os.path.dirname(__file__), "..", "site")

FONTS = (
    '  <link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    '  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700'
    '&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700'
    '&display=swap" rel="stylesheet">\n'
)


def head(base, title, desc):
    return (
        "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n"
        '  <meta charset="UTF-8">\n'
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        f"  <title>{title}</title>\n"
        f'  <meta name="description" content="{desc}">\n'
        '  <meta name="theme-color" content="#000000">\n'
        f'  <link rel="icon" href="{base}assets/img/favicon.svg" type="image/svg+xml">\n'
        + FONTS
        + f'  <link rel="stylesheet" href="{base}assets/css/main.css">\n'
        "</head>\n<body>\n"
        '  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>\n'
    )


def header(base, current):
    def link(href, label, page):
        cur = ' aria-current="page"' if page == current else ""
        return f'<li><a class="nav__link" href="{href}" data-nav-page="{page}"{cur}>{label}</a></li>'

    nav = "\n            ".join([
        link(base + "pages/como-funciona.html", "Como funciona", "como-funciona.html"),
        link(base + "pages/servicos.html", "Serviços", "servicos.html"),
        link(base + "pages/capacitacao.html", "Capacitação", "capacitacao.html"),
        link(base + "pages/sobre.html", "Sobre", "sobre.html"),
        link(base + "pages/contato.html", "Contato", "contato.html"),
    ])

    return f"""  <header class="header" data-header>
    <div class="header__inner container container--wide">
      <a class="brand" href="{base}index.html" aria-label="NEXUS — página inicial">
        <svg class="brand__mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect x="1.2" y="1.2" width="29.6" height="29.6" rx="9" stroke="#61d429" stroke-width="2.2"/>
          <path d="M10 22.5V9.5l12 13v-13" stroke="#61d429" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="brand__text">NEXUS</span>
        <span class="brand__tag">SP</span>
      </a>
      <nav class="nav" aria-label="Navegação principal">
        <ul class="nav__list">
            {nav}
        </ul>
      </nav>
      <div class="header__actions">
        <div class="dropdown" data-dropdown>
          <button class="btn btn--ghost" type="button" data-dropdown-trigger aria-expanded="false" aria-haspopup="true" aria-controls="menu-entrar">
            Entrar
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="dropdown__panel" id="menu-entrar" data-dropdown-panel>
            <p class="dropdown__label">Acessar minha conta</p>
            <a class="dropdown__item" href="{base}pages/auth/login.html?perfil=prestador">
              <span class="dropdown__icon" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="m3 7 9 5 9-5M12 22V12"/></svg></span>
              <span><span class="dropdown__title">Empreendedor / Prestador</span><span class="dropdown__desc">Ofereço serviços digitais</span></span>
              <svg class="dropdown__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
            <a class="dropdown__item" href="{base}pages/auth/login.html?perfil=contratante">
              <span class="dropdown__icon" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg></span>
              <span><span class="dropdown__title">Contratante</span><span class="dropdown__desc">Preciso contratar um serviço</span></span>
              <svg class="dropdown__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
            <p class="dropdown__foot">Ainda não tem conta? <a class="link" href="{base}pages/auth/cadastro.html">Criar cadastro gratuito</a></p>
          </div>
        </div>
        <a class="btn btn--primary" href="{base}pages/auth/cadastro.html">Criar conta</a>
        <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="menu-mobile" aria-label="Abrir menu">
          <span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>
        </button>
      </div>
    </div>
    <div class="header__progress" data-progress aria-hidden="true"></div>
  </header>

  <div class="mobile-nav" id="menu-mobile" data-mobile-nav>
    <div class="container">
      <ul class="mobile-nav__list">
        <li><a class="mobile-nav__link" href="{base}pages/como-funciona.html">Como funciona <span>01</span></a></li>
        <li><a class="mobile-nav__link" href="{base}pages/servicos.html">Serviços <span>02</span></a></li>
        <li><a class="mobile-nav__link" href="{base}pages/capacitacao.html">Capacitação <span>03</span></a></li>
        <li><a class="mobile-nav__link" href="{base}pages/sobre.html">Sobre <span>04</span></a></li>
        <li><a class="mobile-nav__link" href="{base}pages/contato.html">Contato <span>05</span></a></li>
      </ul>
      <div class="mobile-nav__actions">
        <a class="btn btn--primary btn--block btn--lg" href="{base}pages/auth/cadastro.html">Criar conta gratuita</a>
        <a class="btn btn--secondary btn--block" href="{base}pages/auth/login.html?perfil=prestador">Entrar como prestador</a>
        <a class="btn btn--secondary btn--block" href="{base}pages/auth/login.html?perfil=contratante">Entrar como contratante</a>
      </div>
      <p class="mobile-nav__note">Plataforma para maiores de 16 anos · São Paulo — SP</p>
    </div>
  </div>
"""


def footer(base):
    return f"""  <footer class="footer">
    <div class="footer-cta container has-noise">
      <div class="footer-cta__inner">
        <div>
          <h2>Sua próxima entrega começa com um cadastro</h2>
          <p>Leva menos de cinco minutos. Grátis para prestadores e para contratantes.</p>
        </div>
        <div class="btn-group btn-group--stack-mobile">
          <a class="btn btn--primary btn--lg" href="{base}pages/auth/cadastro-prestador.html">Sou prestador</a>
          <a class="btn btn--secondary btn--lg" href="{base}pages/auth/cadastro-contratante.html">Quero contratar</a>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="footer__main">
        <div class="footer__brand">
          <a class="brand" href="{base}index.html" aria-label="NEXUS — página inicial">
            <svg class="brand__mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect x="1.2" y="1.2" width="29.6" height="29.6" rx="9" stroke="#61d429" stroke-width="2.2"/>
              <path d="M10 22.5V9.5l12 13v-13" stroke="#61d429" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="brand__text">NEXUS</span>
          </a>
          <p class="footer__tagline">Intermediação entre prestadores de serviços digitais das periferias de São Paulo e empresas contratantes, com capacitação gratuita para jovens de 16 a 29 anos.</p>
          <div class="footer__badges">
            <span class="footer-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>LGPD</span>
            <span class="footer-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>ECA Digital</span>
            <span class="footer-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>16+</span>
          </div>
        </div>

        <nav class="footer__col" aria-label="Plataforma">
          <h3>Plataforma</h3>
          <ul>
            <li><a href="{base}pages/como-funciona.html">Como funciona</a></li>
            <li><a href="{base}pages/servicos.html">Categorias de serviço</a></li>
            <li><a href="{base}pages/capacitacao.html">NEXUS Academy</a></li>
            <li><a href="{base}index.html#faq">Perguntas frequentes</a></li>
          </ul>
        </nav>
        <nav class="footer__col" aria-label="Contas">
          <h3>Contas</h3>
          <ul>
            <li><a href="{base}pages/auth/cadastro-prestador.html">Criar perfil de prestador</a></li>
            <li><a href="{base}pages/auth/cadastro-contratante.html">Criar conta de contratante</a></li>
            <li><a href="{base}pages/auth/login.html">Entrar</a></li>
          </ul>
        </nav>
        <nav class="footer__col" aria-label="Institucional">
          <h3>Institucional</h3>
          <ul>
            <li><a href="{base}pages/sobre.html">Sobre a NEXUS</a></li>
            <li><a href="{base}pages/contato.html">Contato</a></li>
            <li><a href="{base}pages/legal/protecao-menores.html">Proteção a menores</a></li>
          </ul>
        </nav>
      </div>

      <div class="footer__legal">
        <div class="footer__legal-info">
          <p><strong>NEXUS Plataforma Digital Ltda.</strong> · CNPJ 00.000.000/0001-00</p>
          <p>&copy; <span data-year>2026</span> NEXUS. Todos os direitos reservados.</p>
        </div>
        <ul class="footer__legal-links">
          <li><a href="{base}pages/legal/termos.html">Termos de uso</a></li>
          <li><a href="{base}pages/legal/privacidade.html">Privacidade</a></li>
          <li><a href="{base}pages/legal/cookies.html">Cookies</a></li>
          <li><a href="{base}pages/legal/protecao-menores.html">Proteção a menores</a></li>
          <li><a href="#" data-cookie-manage>Gerenciar cookies</a></li>
        </ul>
        <span class="footer__made"><span class="dot" aria-hidden="true"></span>Feito em São Paulo</span>
      </div>

      <p class="footer__disclaimer">
        <strong>Aviso:</strong> protótipo acadêmico/demonstrativo. Dados de contato, CNPJ, endereço,
        números e depoimentos são fictícios. Formulários não enviam nem armazenam dados — ainda não
        há banco de dados conectado.
      </p>
    </div>
  </footer>

  <button class="to-top" type="button" data-to-top aria-label="Voltar ao topo da página">
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
  </button>

  <aside class="cookie-bar" data-cookie-bar role="region" aria-label="Aviso de cookies">
    <p class="cookie-bar__head">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z"/><path d="M8.5 9.5h.01M12 15h.01M15.5 11.5h.01"/></svg>
      Este site usa cookies
    </p>
    <p>Usamos cookies essenciais e, com sua autorização, cookies de análise. Saiba mais na <a href="{base}pages/legal/cookies.html">Política de Cookies</a>.</p>
    <div class="cookie-bar__actions">
      <button class="btn btn--secondary btn--sm" type="button" data-cookie-reject>Só os essenciais</button>
      <button class="btn btn--primary btn--sm" type="button" data-cookie-accept>Aceitar todos</button>
    </div>
  </aside>

  <script src="{base}assets/js/core.js" defer></script>
  <script src="{base}assets/js/header.js" defer></script>
  <script src="{base}assets/js/ui.js" defer></script>
  <script src="{base}assets/js/forms.js" defer></script>
  <script src="{base}assets/js/lgpd.js" defer></script>
</body>
</html>
"""


def breadcrumb(base, trail):
    items = "".join(
        f'<li><a href="{base}{href}">{label}</a></li>' if href else f'<li><span aria-current="page">{label}</span></li>'
        for href, label in trail
    )
    return f'<ol class="breadcrumb">{items}</ol>'


def write(relpath, html):
    full = os.path.normpath(os.path.join(ROOT, relpath))
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with io.open(full, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    print("escrito:", relpath)
