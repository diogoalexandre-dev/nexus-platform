# Roadmap — NEXUS

Este documento organiza as frentes do produto. Cada frente corresponde a uma pasta em `src/features/`. Nada aqui está implementado ainda — é o mapa do que vamos construir, na ordem que fizer sentido.

## Frentes

1. **Cadastro e perfis** — onboarding de contratante e de prestador, dados de empresa/profissional, portfólio.
2. **Briefing e matching** (`features/matching`) — contratante publica briefing, sistema sugere/filtra prestadores por categoria, região e disponibilidade.
3. **Propostas e orçamento** (`features/propostas`) — prestador envia proposta, contratante aceita/recusa/negocia.
4. **Comunicação** (`features/chat`) — canal de mensagens entre as partes após aceite (ou antes, mediante regra a definir).
5. **Avaliações e reputação** (`features/avaliacoes`) — nota e comentário pós-entrega, histórico do prestador.
6. **Pagamentos** (`features/pagamentos`) — intermediação financeira, retenção/liberação de valores (escrow), a definir provedor.
7. **Painel administrativo** — moderação de cadastros, disputas, métricas da operação.

## Status atual

Organização inicial do workspace: estrutura de pastas, configs de projeto (Next.js + TypeScript), modelo de dados inicial (Prisma) e documentação. Nenhuma feature está implementada ainda — as pastas em `src/features/` têm apenas um README descrevendo o escopo de cada uma, prontas para receber código quando você der o próximo passo.
