# NEXUS

Plataforma de intermediação entre **empreendedores/empresas** (contratantes) e
**prestadores de serviços digitais**, ambos locais de São Paulo — cobrindo áreas como
design, edição de vídeo, desenvolvimento, marketing digital e outras (ver
`docs/CATEGORIAS.md`).

## Status

Workspace organizado e pronto para receber código. Estrutura de pastas, configuração do
projeto (Next.js + TypeScript) e modelo de dados inicial (Prisma) definidos. Nenhuma
funcionalidade foi implementada ainda.

## Como abrir

1. Abra esta pasta no VS Code.
2. `npm install`
3. Copie `.env.example` para `.env` e preencha as variáveis (banco de dados, etc.).
4. `npm run dev`

## Documentação

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — arquitetura e organização de pastas.
- [`docs/CATEGORIAS.md`](./docs/CATEGORIAS.md) — categorias de serviços digitais propostas.
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — frentes do produto e status.
- [`prisma/schema.prisma`](./prisma/schema.prisma) — modelo de dados inicial.

Cada pasta em `src/features/` tem um `README.md` próprio explicando seu escopo.
