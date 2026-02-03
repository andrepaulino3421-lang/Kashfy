# Kashfy (Next.js + Prisma)

Um app web (Next.js App Router) para controle financeiro com:
- Autenticação (login/cadastro) com sessão em cookie HTTPOnly
- Dashboard (entradas/saídas/saldo, categorias, histórico)
- Plano **Free** (modo demo) + planos pagos (integração Kiwify via webhook)
- Kash AI (chat) via OpenAI

> Observação: este projeto usa **Prisma + SQLite** por padrão para rodar localmente.  
> Você pode trocar para Postgres depois (inclusive Supabase Postgres) ajustando o `DATABASE_URL` e o provider no Prisma.

---

## 1) Requisitos
- Node.js 18+
- npm / pnpm / yarn

## 2) Setup rápido

1. Copie as variáveis de ambiente:

```bash
cp .env.example .env
```

2. Gere o Prisma Client e rode as migrations (cria o `dev.db`):

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
```

3. Suba o projeto:

```bash
npm run dev
```

Acesse: `http://localhost:3000`

---

## Variáveis de ambiente

- `SESSION_SECRET`: segredo para assinar a sessão (use algo longo e aleatório)
- `DATABASE_URL`: por padrão `file:./dev.db`
- `OPENAI_API_KEY`: para habilitar o chat do Kash AI
- `KIWIFY_WEBHOOK_TOKEN`: token para validar o webhook da Kiwify (header `x-kiwify-token`)

---

## Webhook Kiwify

Endpoint:
- `POST /api/billing/kiwify/webhook`

Validação:
- Envie o token no header `x-kiwify-token` (ou `Authorization: Bearer <token>`).

O webhook atualiza/cria a assinatura do usuário e libera recursos por plano.

---

## Estrutura

- `app/(marketing)` páginas públicas (home, planos, etc.)
- `app/(auth)` login/cadastro
- `app/(protected)` área logada (dashboard, conta, Kash AI)
- `lib/*` regras de negócio (auth, finance, kiwify, openai, etc.)
- `prisma/schema.prisma` modelos do banco

