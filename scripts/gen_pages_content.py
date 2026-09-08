# -*- coding: utf-8 -*-
"""Conteudo de cada pagina interna. Executar com: python gen_pages_content.py"""
import io
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from gen_pages import head, header, footer, breadcrumb, write  # noqa: E402

B1 = "../"       # pages/*.html -> site/
B2 = "../../"    # pages/legal/*.html -> site/


def page(base, current, title, desc, crumb, body):
    html = head(base, title, desc)
    html += header(base, current)
    html += '  <main id="conteudo">\n'
    html += body
    html += "  </main>\n\n"
    html += footer(base)
    return html


# ============================================================
# COMO FUNCIONA
# ============================================================
body = f"""    <section class="page-hero has-noise">
      <div class="container page-hero__inner">
        {breadcrumb(B1, [("index.html", "Início"), (None, "Como funciona")])}
        <span class="eyebrow">Passo a passo completo</span>
        <h1>Como a NEXUS funciona, do cadastro ao pagamento</h1>
        <p class="lead">O mesmo fluxo vale para quem presta e para quem contrata — a diferença é o ponto de partida.</p>
      </div>
    </section>

    <section class="section" id="prestador">
      <div class="container">
        <div class="section-head" data-reveal>
          <span class="eyebrow">Para prestadores</span>
          <h2>Do cadastro à entrega</h2>
        </div>
        <ol class="timeline" data-reveal>
          <li class="timeline__item"><span class="timeline__step">Etapa 01</span><h3 class="timeline__title">Crie seu perfil</h3><p class="timeline__text">Cadastro gratuito com seus dados, categoria e região. 16 ou 17 anos? Etapa extra de consentimento do responsável legal.</p></li>
          <li class="timeline__item"><span class="timeline__step">Etapa 02</span><h3 class="timeline__title">Monte seu portfólio</h3><p class="timeline__text">Links e descrições dos seus trabalhos — é o que mais pesa no matching.</p></li>
          <li class="timeline__item"><span class="timeline__step">Etapa 03</span><h3 class="timeline__title">Receba briefings compatíveis</h3><p class="timeline__text">Cruzamento por categoria, região e disponibilidade. Sem leilão de preço.</p></li>
          <li class="timeline__item"><span class="timeline__step">Etapa 04</span><h3 class="timeline__title">Envie proposta e entregue</h3><p class="timeline__text">Proposta aceita vira contrato digital, com pagamento retido até a aprovação.</p></li>
          <li class="timeline__item"><span class="timeline__step">Etapa 05</span><h3 class="timeline__title">Receba e construa reputação</h3><p class="timeline__text">Pagamento liberado e avaliação registrada no seu perfil.</p></li>
        </ol>
      </div>
    </section>

    <section class="section section--tight invert" id="contratante">
      <div class="container">
        <div class="section-head" data-reveal>
          <span class="eyebrow">Para contratantes</span>
          <h2>Do briefing ao contrato</h2>
        </div>
        <ol class="timeline" data-reveal>
          <li class="timeline__item"><span class="timeline__step">Etapa 01</span><h3 class="timeline__title">Descreva o que precisa</h3><p class="timeline__text">Um formulário guiado transforma sua necessidade em briefing técnico.</p></li>
          <li class="timeline__item"><span class="timeline__step">Etapa 02</span><h3 class="timeline__title">Receba profissionais compatíveis</h3><p class="timeline__text">Lista curta de prestadores verificados da sua categoria e região.</p></li>
          <li class="timeline__item"><span class="timeline__step">Etapa 03</span><h3 class="timeline__title">Compare propostas</h3><p class="timeline__text">Valor, prazo, escopo e reputação lado a lado.</p></li>
          <li class="timeline__item"><span class="timeline__step">Etapa 04</span><h3 class="timeline__title">Contrate com segurança</h3><p class="timeline__text">Contrato digital automático e pagamento retido até a entrega aprovada.</p></li>
          <li class="timeline__item"><span class="timeline__step">Etapa 05</span><h3 class="timeline__title">Aprove e avalie</h3><p class="timeline__text">Libere o pagamento e avalie o profissional.</p></li>
        </ol>
      </div>
    </section>

    <section class="section" id="taxas">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow eyebrow--center">Taxas e pagamentos</span>
          <h2>Você só paga quando o projeto acontece</h2>
        </div>
        <div class="plans" data-reveal>
          <div class="plan">
            <span class="plan__name">Cadastro</span>
            <span class="plan__price">Grátis</span>
            <p class="card__text">Perfil, portfólio, briefing e propostas — sem custo para nenhum dos lados.</p>
          </div>
          <div class="plan plan--highlight">
            <span class="plan__flag">Mais comum</span>
            <span class="plan__name">Comissão por projeto</span>
            <span class="plan__price">12%<small>sobre o valor pago ao prestador</small></span>
            <p class="card__text">Cobrada só em projeto concluído e pago. Cobre segurança do pagamento e suporte.</p>
          </div>
          <div class="plan">
            <span class="plan__name">NEXUS Academy</span>
            <span class="plan__price">Grátis<small>de 16 a 29 anos</small></span>
            <p class="card__text">Trilhas de capacitação inclusas no cadastro de prestador.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container center">
        <a class="btn btn--primary btn--lg" href="{B1}pages/auth/cadastro.html" data-reveal>Criar minha conta agora</a>
      </div>
    </section>
"""
write("pages/como-funciona.html", page(B1, "como-funciona.html",
      "Como funciona — NEXUS",
      "Passo a passo completo da NEXUS para prestadores e contratantes, incluindo taxas e pagamentos.",
      None, body))


# ============================================================
# SERVICOS (com filtro funcional)
# ============================================================
CATS = [
    ("design", "Design", "42", "circle-svg", ["Identidade visual e logotipo", "Social media e artes", "UI/UX de sites e apps"]),
    ("video", "Edição de vídeo", "31", "video-svg", ["Cortes para Reels e TikTok", "Vídeo institucional", "Motion graphics"]),
    ("dev", "Desenvolvimento web", "24", "code-svg", ["Sites e landing pages", "Lojas virtuais", "Sistemas sob medida"]),
    ("marketing", "Marketing e tráfego pago", "28", "chart-svg", ["Google Ads e Meta Ads", "Planejamento de campanha", "Relatórios"]),
    ("social", "Gestão de redes sociais", "36", "flag-svg", ["Planejamento de conteúdo", "Calendário editorial", "Atendimento"]),
    ("copy", "Copywriting", "19", "text-svg", ["Textos para anúncios", "Roteiros", "E-mail marketing"]),
    ("seo", "SEO", "14", "search-svg", ["Posicionamento orgânico", "Auditoria técnica"]),
    ("foto", "Fotografia", "17", "cam-svg", ["Still para catálogos", "Conteúdo para redes"]),
    ("motion", "Motion design 2D/3D", "12", "layers-svg", ["Vinhetas", "Explicativos animados"]),
    ("automacao", "Automação e IA", "9", "bolt-svg", ["Chatbots", "Automações no-code"]),
    ("ecommerce", "Gestão de e-commerce", "11", "cart-svg", ["Montagem de loja", "Operação"]),
    ("dados", "Dados e BI", "8", "bar-svg", ["Dashboards", "Análise de performance"]),
]

ICON = '<svg class="service-card__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>'

cards = []
chips = ['<button class="chip chip--active" type="button" data-filter="todos" aria-pressed="true">Todos</button>']
for slug, name, count, _icon, items in CATS:
    chips.append(f'<button class="chip" type="button" data-filter="{slug}" aria-pressed="false">{name}</button>')
    lis = "".join(f"<li>{it}</li>" for it in items)
    cards.append(f"""          <article class="service-card" data-category="{slug}" data-reveal>
            <div class="service-card__head">{ICON}<h3 class="service-card__name">{name}</h3></div>
            <ul class="service-card__list">{lis}</ul>
            <p class="service-card__count"><strong>{count}</strong> profissionais ativos</p>
          </article>""")

body = f"""    <section class="page-hero has-noise">
      <div class="container page-hero__inner">
        {breadcrumb(B1, [("index.html", "Início"), (None, "Serviços")])}
        <span class="eyebrow">Catálogo</span>
        <h1>Serviços digitais disponíveis na rede</h1>
        <p class="lead">Busque por categoria ou palavra-chave para encontrar o profissional certo.</p>
      </div>
    </section>

    <section class="section section--flush-top" data-filter-root>
      <div class="container">
        <div class="field mb-6" style="max-width:420px;">
          <label class="sr-only" for="busca-servicos">Buscar serviço</label>
          <input class="input" id="busca-servicos" type="search" data-filter-search placeholder="Ex.: identidade visual, edição de vídeo...">
        </div>
        <div class="filter-bar">{''.join(chips)}</div>
        <p class="result-count"><strong data-filter-count>{len(CATS)}</strong> categorias exibidas</p>
        <div class="grid-3">
{chr(10).join(cards)}
        </div>
        <div class="empty-state" data-filter-empty>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <p>Nenhuma categoria encontrada para essa busca.</p>
        </div>
      </div>
    </section>

    <section class="section section--tight invert">
      <div class="container center">
        <h2>Não achou sua categoria?</h2>
        <p class="lead center-x mt-4 mb-6">Publique o briefing mesmo assim — nossa equipe direciona para o prestador certo.</p>
        <a class="btn btn--dark btn--lg" href="{B1}pages/auth/cadastro-contratante.html">Publicar briefing</a>
      </div>
    </section>
"""
write("pages/servicos.html", page(B1, "servicos.html",
      "Serviços digitais — NEXUS",
      "Catálogo de categorias de serviços digitais disponíveis na plataforma NEXUS, com busca e filtro.",
      None, body))


# ============================================================
# CAPACITACAO (com links diretos para YouTube)
# ============================================================
def yt_search(q):
    from urllib.parse import quote
    return "https://www.youtube.com/results?search_query=" + quote(q)


COURSES = [
    ("Iniciante", "Design do zero ao primeiro cliente", "Fundamentos visuais, ferramentas gratuitas e portfólio.", "18h", "9 módulos",
     "curso design gráfico iniciante gratis"),
    ("Intermediário", "Edição de vídeo para redes sociais", "Ritmo, corte, legenda e entrega em conteúdo vertical.", "22h", "12 módulos",
     "curso edição de vídeo para redes sociais gratis"),
    ("Essencial", "Precificação, contrato e nota fiscal", "Quanto cobrar, como formalizar como MEI.", "10h", "6 módulos",
     "como precificar serviços freelancer MEI curso"),
    ("Iniciante", "Lógica e desenvolvimento web", "HTML, CSS e primeiros passos em programação.", "40h", "20 módulos",
     "curso em vídeo HTML CSS iniciante"),
    ("Intermediário", "Tráfego pago e marketing digital", "Google Ads, Meta Ads e leitura de métricas.", "16h", "8 módulos",
     "curso tráfego pago gratis iniciante"),
    ("Essencial", "Atendimento e negociação com clientes", "Como apresentar proposta e fechar contrato.", "8h", "5 módulos",
     "como negociar com clientes freelancer curso"),
]

course_cards = []
for level, title, desc, hours, mods, query in COURSES:
    course_cards.append(f"""          <article class="course-card" data-reveal>
            <div class="course-card__cover">
              <span class="course-card__level">{level}</span>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 12s0-3.5-.5-5a2.6 2.6 0 0 0-1.8-1.8C18 4.7 12 4.7 12 4.7s-6 0-7.7.5A2.6 2.6 0 0 0 2.5 7C2 8.5 2 12 2 12s0 3.5.5 5a2.6 2.6 0 0 0 1.8 1.8c1.7.5 7.7.5 7.7.5s6 0 7.7-.5A2.6 2.6 0 0 0 21.5 17c.5-1.5.5-5 .5-5Z"/><path d="m10 15 5-3-5-3z"/></svg>
            </div>
            <div class="course-card__body">
              <h3 class="course-card__title">{title}</h3>
              <p class="course-card__desc">{desc}</p>
            </div>
            <div class="course-card__meta">
              <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>{hours}</span>
              <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5V6a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 1.5Z"/></svg>{mods}</span>
            </div>
            <a class="btn btn--secondary btn--block" href="{yt_search(query)}" target="_blank" rel="noopener">
              Trilha gratuita no YouTube
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></svg>
            </a>
          </article>""")

body = f"""    <section class="page-hero has-noise">
      <div class="container page-hero__inner">
        {breadcrumb(B1, [("index.html", "Início"), (None, "Capacitação")])}
        <span class="eyebrow">NEXUS Academy</span>
        <h1>Trilhas gratuitas para quem tem de 16 a 29 anos</h1>
        <p class="lead">Cada trilha reúne o essencial da técnica e um curso público no YouTube para você aprofundar de graça.</p>
      </div>
    </section>

    <section class="section section--flush-top">
      <div class="container">
        <div class="grid-3">
{chr(10).join(course_cards)}
        </div>

        <div class="alert alert--info mt-8" data-reveal>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          <p><strong>Sobre os links do YouTube</strong> Levam a buscas com trilhas gratuitas e públicas de canais reconhecidos. Como o conteúdo do YouTube muda com o tempo, prefira sempre o vídeo mais recente e bem avaliado da lista.</p>
        </div>
      </div>
    </section>

    <section class="section section--tight invert">
      <div class="container center">
        <h2>As trilhas completas ficam liberadas com o cadastro</h2>
        <p class="lead center-x mt-4 mb-6">Certificado de conclusão emitido pela plataforma.</p>
        <a class="btn btn--dark btn--lg" href="{B1}pages/auth/cadastro-prestador.html">Criar meu perfil de prestador</a>
      </div>
    </section>
"""
write("pages/capacitacao.html", page(B1, "capacitacao.html",
      "Capacitação — NEXUS Academy",
      "Trilhas gratuitas de capacitação para jovens de 16 a 29 anos, com cursos públicos recomendados no YouTube.",
      None, body))


print("pagina 1/3 (parte A) concluida")
