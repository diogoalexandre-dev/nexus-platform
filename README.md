# NEXUS

Plataforma de intermediação entre **empreendedores e prestadores de serviços digitais**
das periferias de São Paulo e **contratantes** (de MEI a multinacional), com capacitação
gratuita para jovens de 16 a 29 anos.

Diferencial do produto: cadastro **a partir dos 16 anos**, com uma trilha própria para
adolescentes de 16 e 17 anos — consentimento do responsável legal registrado, conforme a
LGPD (art. 14) e o ECA.

## O que já existe

O repositório tem duas partes, em estágios diferentes:

| Pasta | O que é | Status |
|---|---|---|
| `site/` | O site em HTML, CSS e JavaScript puros | **Funcionando** |
| `src/`, `prisma/` | Estrutura planejada da aplicação (Next.js + Prisma) | Só o esqueleto |

O `site/` não depende do `src/`. Ele roda sozinho, sem instalar nada.

## Rodar o site na sua máquina

A forma mais simples é abrir `site/index.html` no navegador com dois cliques.

Para que os caminhos funcionem exatamente como em produção, prefira servir a pasta:

```bash
python -m http.server 5173 --directory site
```

Depois acesse `http://localhost:5173`.

> No VS Code, a extensão **Live Server** faz o mesmo: clique com o botão direito em
> `site/index.html` → *Open with Live Server*.

## Estrutura do site

```
site/
├── index.html              página inicial
├── pages/
│   ├── auth/               login e cadastro
│   └── legal/              termos, privacidade, cookies (a fazer)
└── assets/
    ├── css/
    │   ├── main.css        único CSS ligado no HTML; importa todos os outros
    │   ├── base/           tokens da marca, reset, tipografia, utilitários
    │   ├── layout/         container, header, rodapé
    │   ├── components/     botões, cards, formulários, abas, avisos
    │   └── pages/          estilos de cada tipo de página
    ├── js/                 core, header, ui, formulários, LGPD, acesso
    └── img/                logo, favicon e a figura do hero
```

**Para mudar cores, fontes ou espaçamentos do site inteiro**, edite apenas
`site/assets/css/base/_tokens.css`.

Cores oficiais: `#000000`, `#21201e`, `#61d429`, `#f9f8f6`.

## Publicação (GitHub Pages)

O arquivo `.github/workflows/deploy-pages.yml` publica a pasta `site/` automaticamente
a cada `git push` no branch principal.

Passo a passo da primeira vez:

1. Crie um repositório **público** e **vazio** em <https://github.com/new>
   (sem README, sem .gitignore, sem licença).
2. Conecte e envie:

   ```bash
   git remote add origin https://github.com/SEU-USUARIO/nexus-platform.git
   git push -u origin master
   ```

3. Em **Settings → Pages → Build and deployment**, mude *Source* para
   **GitHub Actions**. Isso é feito **uma única vez** — o token do workflow não
   tem permissão para ligar o Pages sozinho.
4. Na aba **Actions**, abra a última execução e clique em *Re-run all jobs*.
5. O endereço final aparece em **Settings → Pages**, no formato
   `https://SEU-USUARIO.github.io/nexus-platform/`.

Das próximas vezes, basta `git push`: o site é republicado sozinho.

## Aviso

Este é um protótipo demonstrativo. Telefone, e-mail, CNPJ, endereço, números de
desempenho, empresas parceiras e depoimentos são **fictícios**. Os formulários não
enviam nem armazenam nada: ainda não há banco de dados conectado.

## Documentação do produto

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — arquitetura planejada.
- [`docs/CATEGORIAS.md`](./docs/CATEGORIAS.md) — categorias de serviços digitais.
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — frentes do produto e status.
- [`prisma/schema.prisma`](./prisma/schema.prisma) — modelo de dados inicial.
