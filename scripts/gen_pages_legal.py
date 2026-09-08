# -*- coding: utf-8 -*-
"""Terceira parte: as 4 paginas legais (termos, privacidade, cookies, protecao a menores)."""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from gen_pages import head, header, footer, write  # noqa: E402


def legal_page(base, current, title, desc, updated, sections):
    """sections: list of (heading, html_body)"""
    toc = "".join(f'<li><a href="#s{i+1}">{h}</a></li>' for i, (h, _) in enumerate(sections))
    content = "".join(
        f'<section id="s{i+1}"><h2><span class="n">{i+1:02d}</span>{h}</h2>{b}</section>'
        for i, (h, b) in enumerate(sections)
    )
    html = head(base, title, desc)
    html += header(base, current)
    html += f"""  <main id="conteudo">
    <section class="page-hero">
      <div class="container page-hero__inner">
        <ol class="breadcrumb"><li><a href="{base}index.html">Início</a></li><li><span aria-current="page">{title.split(' — ')[0]}</span></li></ol>
        <h1>{title.split(' — ')[0]}</h1>
      </div>
    </section>
    <section class="section section--flush-top">
      <div class="container legal-layout">
        <nav class="legal-toc" aria-label="Sumário"><h2>Neste documento</h2><ol>{toc}</ol></nav>
        <div class="legal-content prose">
          <div class="legal-meta"><span>Última atualização: <strong>{updated}</strong></span><span>Versão <strong>1.0</strong></span></div>
          {content}
        </div>
      </div>
    </section>
  </main>

"""
    html += footer(base)
    return html


B1 = "../../"  # site/pages/legal/*.html -> site/

# ---------------- TERMOS DE USO ----------------
termos = [
    ("Aceitação dos termos", "<p>Ao criar uma conta na NEXUS, você concorda com estes Termos de Uso e com a Política de Privacidade. Se não concordar, não utilize a plataforma.</p>"),
    ("Quem pode se cadastrar", "<p>A NEXUS é aberta a partir de 16 anos completos. Adolescentes de 16 e 17 anos dependem do consentimento do responsável legal, registrado no cadastro. Contratantes podem ser pessoa física maior de idade, MEI ou empresa.</p>"),
    ("Papel da plataforma", "<p>A NEXUS intermedia a relação entre prestadores e contratantes. Não somos parte do contrato de prestação de serviço firmado entre as partes, mas fornecemos a estrutura de proposta, contrato digital e retenção de pagamento.</p>"),
    ("Comissão e pagamentos", "<p>A NEXUS cobra comissão apenas sobre projetos concluídos e pagos através da plataforma. O valor fica retido até a aprovação da entrega pelo contratante.</p>"),
    ("Conduta esperada", "<ul><li>Informações de cadastro verdadeiras e atualizadas.</li><li>Respeito mútuo na comunicação entre as partes.</li><li>Cumprimento do escopo e prazo combinados na proposta aceita.</li></ul>"),
    ("Proteção de menores de idade", "<p>Contratos que envolvam prestador de 16 ou 17 anos seguem as regras do Estatuto da Criança e do Adolescente: vedado trabalho noturno, perigoso ou insalubre, e respeito à frequência escolar. Veja a <a href=\"protecao-menores.html\">Política de Proteção a Menores</a>.</p>"),
    ("Suspensão e encerramento de conta", "<p>Contas podem ser suspensas em caso de fraude, descumprimento destes Termos ou solicitação do próprio titular.</p>"),
    ("Alterações destes termos", "<p>Podemos atualizar estes Termos. Mudanças relevantes serão comunicadas por e-mail com antecedência.</p>"),
]

write("pages/legal/termos.html", legal_page(B1, "termos.html",
      "Termos de Uso — NEXUS",
      "Termos de uso da plataforma NEXUS de intermediação de serviços digitais.",
      "07 de setembro de 2026", termos))

# ---------------- PRIVACIDADE ----------------
priv = [
    ("Quais dados coletamos", "<p>Nome, e-mail, telefone, CPF/CNPJ, endereço (CEP e bairro), data de nascimento, categorias de interesse e, quando aplicável, dados do responsável legal.</p>"),
    ("Base legal do tratamento (LGPD)", "<ul><li><strong>Execução de contrato:</strong> intermediar propostas e pagamentos.</li><li><strong>Consentimento específico:</strong> para adolescentes de 16 e 17 anos, nos termos do art. 14 da Lei 13.709/2018.</li><li><strong>Cumprimento de obrigação legal:</strong> emissão de documentos fiscais quando aplicável.</li></ul>"),
    ("Para que usamos seus dados", "<p>Viabilizar o matching entre prestador e contratante, processar pagamentos, emitir contratos digitais e enviar comunicações sobre a conta — nunca para venda a terceiros.</p>"),
    ("Com quem compartilhamos", "<p>Apenas com a outra parte de um contrato ativo (na medida necessária) e com provedores de pagamento, quando essa integração existir. Nenhum dado é vendido.</p>"),
    ("Seus direitos como titular", "<ul><li>Confirmação e acesso aos dados tratados.</li><li>Correção de dados incompletos ou desatualizados.</li><li>Exclusão dos dados, exceto obrigações legais de guarda.</li><li>Revogação do consentimento a qualquer momento.</li></ul>"),
    ("Encarregado de dados (DPO)", "<p>Dúvidas ou solicitações: <a href=\"mailto:dpo@nexusplataforma.com.br\">dpo@nexusplataforma.com.br</a>.</p>"),
    ("Retenção e exclusão", "<p>Dados são mantidos enquanto a conta estiver ativa e pelo prazo legal de guarda fiscal/contratual após o encerramento.</p>"),
]

write("pages/legal/privacidade.html", legal_page(B1, "privacidade.html",
      "Política de Privacidade — NEXUS",
      "Como a NEXUS coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.",
      "07 de setembro de 2026", priv))

# ---------------- COOKIES ----------------
cookies = [
    ("O que são cookies", "<p>Pequenos arquivos guardados no seu navegador para lembrar preferências e medir o uso do site.</p>"),
    ("Cookies essenciais", "<p>Necessários para o funcionamento básico: manter sua sessão logada e lembrar sua escolha de consentimento. Não podem ser desativados.</p>"),
    ("Cookies de análise", "<p>Usados, com sua autorização, para entender como o site é utilizado e melhorar a experiência. Você pode recusá-los sem perder acesso à plataforma.</p>"),
    ("Como gerenciar sua escolha", "<p>Use o botão \"Gerenciar cookies\" no rodapé de qualquer página para reabrir o banner e mudar sua preferência a qualquer momento.</p>"),
]

write("pages/legal/cookies.html", legal_page(B1, "cookies.html",
      "Política de Cookies — NEXUS",
      "Como a NEXUS usa cookies essenciais e de análise, e como gerenciar sua preferência.",
      "07 de setembro de 2026", cookies))

# ---------------- PROTECAO A MENORES ----------------
menores = [
    ("Por que aceitamos a partir de 16 anos", "<p>A maioria das plataformas de trabalho digital exige 18 anos. Abrimos aos 16 porque é uma idade em que adolescentes já produzem conteúdo digital de qualidade — e merecem um caminho seguro para isso, não um mercado informal sem proteção.</p>"),
    ("Consentimento do responsável legal", "<p>Para prestadores de 16 e 17 anos, o cadastro exige nome, CPF, e-mail, telefone e grau de parentesco do responsável, além de três consentimentos específicos e destacados: tratamento de dados (LGPD art. 14), ciência das condições de trabalho protegido (ECA) e autorização para firmar contratos na plataforma.</p>"),
    ("Regras do Estatuto da Criança e do Adolescente", "<ul><li>Proibido trabalho noturno, perigoso ou insalubre.</li><li>A atividade não pode prejudicar frequência escolar, descanso e lazer.</li><li>O responsável legal é notificado a cada contrato aceito.</li></ul>"),
    ("Recebimento de pagamentos", "<p>A família escolhe, no cadastro, se o pagamento vai para conta do adolescente ou do responsável legal. Pode ser alterado depois, com nova confirmação.</p>"),
    ("Moderação com prioridade no melhor interesse", "<p>Denúncias envolvendo contas de menores de idade têm análise prioritária pela equipe NEXUS, seguindo o princípio do melhor interesse da criança e do adolescente.</p>"),
    ("Canal de denúncia", "<p>Qualquer situação de risco pode ser reportada a <a href=\"mailto:dpo@nexusplataforma.com.br\">dpo@nexusplataforma.com.br</a>, com resposta prioritária.</p>"),
]

write("pages/legal/protecao-menores.html", legal_page(B1, "protecao-menores.html",
      "Proteção a Menores — NEXUS",
      "Política de proteção a adolescentes de 16 e 17 anos na plataforma NEXUS, conforme LGPD e ECA.",
      "07 de setembro de 2026", menores))

print("pagina 3/3 (legais) concluida")
