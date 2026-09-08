# -*- coding: utf-8 -*-
"""Segunda parte: sobre, contato e paginas legais."""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from gen_pages import head, header, footer, breadcrumb, write  # noqa: E402
from gen_pages_content import page, B1, B2  # noqa: E402


# ============================================================
# SOBRE
# ============================================================
VALUES = [
    ("01", "Território importa", "Aproximamos quem contrata de quem executa na própria cidade, para que o dinheiro circule no bairro."),
    ("02", "Idade não é barreira, é responsabilidade", "Abrimos a porta aos 16 anos com as garantias que a LGPD e o ECA exigem — não apesar delas."),
    ("03", "Capacitar antes de intermediar", "Quem chega sem experiência sai da NEXUS Academy pronto para cobrar e entregar com profissionalismo."),
    ("04", "Transparência nas taxas", "Comissão só sobre projeto concluído e pago. Sem mensalidade, sem letra miúda."),
]
value_cards = "".join(f"""          <article class="value-card" data-reveal>
            <span class="value-card__num">{n}</span><h3>{t}</h3><p>{d}</p>
          </article>""" for n, t, d in VALUES)

TEAM = [("Ana Ribeiro", "Fundadora e CEO"), ("Bruno Alves", "Produto e Tecnologia"),
        ("Carla Dias", "Operação e Parcerias"), ("Diego Souza", "NEXUS Academy")]
team_cards = "".join(f"""          <div class="team-card" data-reveal>
            <span class="avatar" aria-hidden="true">{n.split()[0][0]}{n.split()[1][0]}</span>
            <span class="team-card__name">{n}</span><span class="team-card__role">{r}</span>
          </div>""" for n, r in TEAM)

body = f"""    <section class="page-hero has-noise">
      <div class="container page-hero__inner">
        {breadcrumb(B1, [("index.html", "Início"), (None, "Sobre")])}
        <span class="eyebrow">Institucional</span>
        <h1>Uma ponte entre o talento da periferia e o mercado digital</h1>
        <p class="lead">A NEXUS nasceu para resolver um desequilíbrio simples: talento sobra nas periferias de São Paulo, oportunidade formal é que falta.</p>
      </div>
    </section>

    <section class="section section--flush-top">
      <div class="container">
        <div class="section-head" data-reveal><span class="eyebrow">Nossos valores</span><h2>O que guia cada decisão de produto</h2></div>
        <div class="grid-4">{value_cards}</div>
      </div>
    </section>

    <section class="section invert" id="impacto">
      <div class="container">
        <div class="section-head section-head--center" data-reveal><span class="eyebrow eyebrow--center">Impacto</span><h2>Metas do primeiro ciclo</h2></div>
        <div class="stats" data-reveal>
          <div class="stat"><span class="stat__value"><span data-counter="500">0</span><span class="suffix">+</span></span><span class="stat__label">prestadores cadastrados</span></div>
          <div class="stat"><span class="stat__value"><span data-counter="1200">0</span><span class="suffix">+</span></span><span class="stat__label">jovens capacitados</span></div>
          <div class="stat"><span class="stat__value"><span data-counter="96">0</span><span class="suffix">%</span></span><span class="stat__label">meta de satisfação</span></div>
        </div>
        <p class="mono text-dim mt-6 center">Projeções de planejamento — plataforma ainda não está em operação comercial.</p>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <div class="section-head section-head--center" data-reveal><span class="eyebrow eyebrow--center">Time</span><h2>Quem está por trás da NEXUS</h2></div>
        <div class="grid-4">{team_cards}</div>
        <p class="mono text-dim mt-6 center">Nomes ilustrativos — protótipo demonstrativo.</p>
      </div>
    </section>
"""
write("pages/sobre.html", page(B1, "sobre.html",
      "Sobre a NEXUS",
      "Conheça a missão, os valores e o time por trás da NEXUS, plataforma de intermediação de serviços digitais em São Paulo.",
      None, body))


# ============================================================
# CONTATO
# ============================================================
body = f"""    <section class="page-hero has-noise">
      <div class="container page-hero__inner">
        {breadcrumb(B1, [("index.html", "Início"), (None, "Contato")])}
        <span class="eyebrow">Fale com a gente</span>
        <h1>Dúvidas, parcerias ou imprensa</h1>
        <p class="lead">Respondemos em até 2 dias úteis.</p>
      </div>
    </section>

    <section class="section section--flush-top">
      <div class="container contact-layout">
        <div class="contact-form-wrap" data-reveal>
          <form class="form" data-form data-success-target="#contato-ok"
                data-success-title="Mensagem enviada (simulada)"
                data-success-text="Nenhum e-mail real foi enviado nesta fase.">
            <div class="form-grid">
              <div class="field"><label class="field__label" for="c-nome">Nome <span class="req">*</span></label>
                <input class="input" id="c-nome" name="nome" type="text" required minlength="3" data-label="O nome"><p class="field__error"></p></div>
              <div class="field"><label class="field__label" for="c-email">E-mail <span class="req">*</span></label>
                <input class="input" id="c-email" name="email" type="email" required data-label="O e-mail"><p class="field__error"></p></div>
              <div class="field span-2"><label class="field__label" for="c-assunto">Assunto <span class="req">*</span></label>
                <select class="select" id="c-assunto" name="assunto" required data-label="O assunto">
                  <option value="">Selecione…</option>
                  <option value="duvida">Dúvida sobre a plataforma</option>
                  <option value="parceria" id="parcerias">Parceria institucional</option>
                  <option value="imprensa">Imprensa</option>
                  <option value="trabalhe" id="trabalhe">Trabalhe conosco</option>
                </select><p class="field__error"></p></div>
              <div class="field span-2"><label class="field__label" for="c-msg">Mensagem <span class="req">*</span> <span class="char-count" data-count-for="c-msg">0 / 500</span></label>
                <textarea class="textarea" id="c-msg" name="mensagem" required minlength="20" maxlength="500" data-label="A mensagem"></textarea><p class="field__error"></p></div>
            </div>
            <button class="btn btn--primary btn--lg" type="submit">Enviar mensagem
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
          </form>
          <div class="success-panel" id="contato-ok">
            <span class="success-panel__icon" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
            <h2>Mensagem recebida</h2><p>Protótipo demonstrativo — nada foi enviado de verdade.</p>
            <a class="btn btn--primary" href="{B1}index.html">Voltar à página inicial</a>
          </div>
        </div>

        <div class="contact-side" data-reveal>
          <div class="info-block">
            <h3>Contato direto</h3>
            <div class="contact-item"><span class="contact-item__icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg></span>
              <div><p class="contact-item__label">E-mail</p><a class="contact-item__value" href="mailto:contato@nexusplataforma.com.br">contato@nexusplataforma.com.br</a></div></div>
            <div class="contact-item"><span class="contact-item__icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg></span>
              <div><p class="contact-item__label">Telefone</p><a class="contact-item__value" href="tel:+551150000199">+55 (11) 5000-0199</a></div></div>
          </div>
          <div class="info-block">
            <h3>Horário de atendimento</h3>
            <ul class="hours-list"><li><span>Segunda a sexta</span><strong>9h às 18h</strong></li><li><span>Sábado, domingo</span><strong>Fechado</strong></li></ul>
          </div>
          <div class="map-frame"><span class="map-pin" aria-hidden="true"></span><span class="map-note">Av. das Nações Unidas, 1000 — Santo Amaro, São Paulo/SP</span></div>
        </div>
      </div>
    </section>
"""
write("pages/contato.html", page(B1, "contato.html",
      "Contato — NEXUS",
      "Fale com a equipe NEXUS: dúvidas, parcerias, imprensa ou trabalhe conosco.",
      None, body))

print("pagina 2/3 (sobre + contato) concluida")
