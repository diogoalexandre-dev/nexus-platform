# Arquitetura — NEXUS

## Visão geral

NEXUS é uma plataforma de intermediação (marketplace) entre:

- **Contratantes** — empreendedores, pequenas, médias e grandes empresas de São Paulo que precisam de serviços digitais.
- **Prestadores** — profissionais e empresas locais que executam esses serviços digitais.

O core do produto é o **matching** entre briefing do contratante e perfil/portfólio do prestador, seguido de proposta, execução, comunicação e avaliação.

## Stack

- **Next.js (App Router) + TypeScript** — frontend e backend no mesmo projeto (API routes / route handlers).
- **Prisma + PostgreSQL** — camada de dados.
- **Zod** — validação de dados de entrada (formulários e API).
- A definir: provedor de autenticação, storage de arquivos (portfólios, entregas) e provedor de pagamentos (ver `.env.example`).

## Organização de pastas (`src/`)

```
src/
├── app/                  # rotas (App Router)
│   ├── (marketing)/      # site público: home, como funciona, categorias
│   ├── (auth)/           # login, cadastro (contratante / prestador)
│   ├── (dashboard)/      # áreas logadas
│   │   ├── contratante/  # painel de quem contrata
│   │   ├── prestador/    # painel de quem presta serviço
│   │   └── admin/        # painel interno da agência/operação
│   └── api/              # route handlers (auth, projetos, propostas, mensagens, pagamentos)
├── components/
│   ├── ui/               # componentes visuais genéricos (botão, input, card...)
│   └── shared/           # componentes reutilizados entre áreas
├── features/             # regra de negócio por domínio (ver docs/ROADMAP.md)
│   ├── matching/         # lógica de correspondência briefing ↔ prestador
│   ├── propostas/        # envio e aceite de propostas/orçamentos
│   ├── chat/             # comunicação entre as partes
│   ├── avaliacoes/       # reputação e avaliações pós-entrega
│   └── pagamentos/       # intermediação financeira
├── server/
│   ├── services/         # orquestração de regras de negócio
│   └── repositories/     # acesso a dados (via Prisma)
├── lib/                  # utilitários, clients externos, helpers
└── types/                # tipos e contratos compartilhados
```

## Convenções

- Cada pasta de `features/` é dona da sua regra de negócio; `app/` só chama `features/` e `server/`, não implementa lógica de domínio diretamente.
- Nomes de rotas, variáveis de domínio e comentários em português (padrão do produto); nomes técnicos genéricos (funções utilitárias, tipos de infraestrutura) em inglês, seguindo a convenção usual de código.
- Todo dado de entrada (formulário ou API) é validado com Zod antes de chegar em `server/services`.
