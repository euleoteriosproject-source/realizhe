<div align="center">

# Realizhe Real Food

Plataforma de pedidos para a marca Realizhe Real Food. Construida com Next.js 14 (App Router), TailwindCSS, componentes shadcn/ui, Framer Motion e integracao completa com Supabase (clientes, pedidos, aceite LGPD).

</div>

## Stack

- Next.js 14 + TypeScript (App Router)
- TailwindCSS com design tokens customizados (vermelho Realizhe `#D62828`)
- shadcn/ui (Button, Dialog, Card, Input, Checkbox, Badge...)
- Framer Motion para microinteracoes
- Supabase (Postgres) para persistir clientes, pedidos e termos
- Integracao WhatsApp via `https://wa.me/5551982895068`

## Estrutura

```
src/
 |- app/
 |  |- page.tsx                 # Home
 |  |- sobre/page.tsx           # Quem somos
 |  |- cozinha/page.tsx         # Estrutura de producao
 |  |- processos/page.tsx       # Metodologia
 |  |- cardapio/page.tsx        # Produtos e carrinho
 |  |- personalizadas/page.tsx  # Formulario multi etapas
 |  |- termos/page.tsx          # Termos completos
 |  |- privacidade/page.tsx     # Politica LGPD
 |  |- contato/page.tsx         # Canais oficiais
 |  `- api/
 |     |- orders/route.ts       # Pedido padrao
 |     `- personalizados/route.ts
 |- components/
 |  |- home/                    # Secoes da home
 |  |- cart/CartSummary.tsx     # Resumo do carrinho
 |  |- FormCadastro.tsx         # Checkout rapido
 |  |- FormPersonalizado.tsx    # Wizard com upload
 |  |- ModalTermos.tsx          # Dialog com termos
 |  |- Header.tsx / Footer.tsx
 |  `- ui/                      # Biblioteca shadcn adaptada
 |- contexts/CartContext.tsx    # Persistencia localStorage
 |- lib/                        # Supabase, produtos, hash LGPD, utils
 |- types/                      # Tipagens compartilhadas (Product etc.)
 `- styles/globals.css          # Design system global
```

## Variaveis de ambiente

Crie `.env.local` a partir de `.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=produtos
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://<project>.supabase.co/storage/v1/object/public/produtos
```

> No deploy (ex.: Vercel) mantenha `SUPABASE_SERVICE_ROLE_KEY` em segredo. O front nunca expoe essa chave. O bucket (`NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`) padrao e `produtos`; ajuste se usar outro nome. `NEXT_PUBLIC_SUPABASE_STORAGE_URL` aponta para a raiz publica do bucket; use o valor exibido na aba *Public URL* (ex.: `https://bpzzlunlzilhzdslfrvf.supabase.co/storage/v1/object/public/produtos`).

## Script SQL do Supabase

Execute `supabase/schema.sql` no SQL Editor do projeto. O script cria:

- `clientes`
- `termos_aceite`
- `pedidos`
- `pedidos_personalizados`
- `produtos`

Adicione policies (RLS) conforme necessidade. O projeto assume service role para inserts via rotas API.

## Produtos e imagens (Storage)

1. Crie um bucket publico no Supabase Storage (ex.: `produtos`).
2. Envie as imagens (ex.: `box-classico.png`, `box-gourmet.png` etc.).
3. Na tabela `produtos`, preencha `imagem_path` com o caminho dentro do bucket (`box-classico.png`). O frontend monta automaticamente a URL publica (`https://...supabase.co/storage/v1/object/public/produtos/<arquivo>`).
4. Se preferir usar uma URL absoluta (externa), basta salvar em `imagem_url` que o site respeita.

## Fluxo de pedido padrao (/cardapio)

1. Usuario adiciona produtos oficiais (7 itens) ao carrinho.
2. Carrinho persiste em `localStorage` (chave `realizhe-cart-v1`).
3. Botao "Finalizar pedido" abre `FormCadastro`.
4. Valida dados com `react-hook-form` + `zod` e exige aceite dos termos.
5. Rota `POST /api/orders`:
   - Cria ou reutiliza registro em `clientes`.
   - Grava hash SHA256 e versao `1.2` em `termos_aceite`.
   - Salva itens/total em `pedidos`.
6. Resposta retorna URL `wa.me` com resumo pronto para enviar.

## Fluxo personalizado (/personalizadas)

Wizard em tres etapas:

1. Informacoes pessoais e pagamento preferido.
2. Preferencias alimentares (checkbox), frequencia, objetivos.
3. Upload opcional do plano (FileReader -> base64), observacoes e aceite.

A rota `POST /api/personalizados` repete cadastro do cliente, registra aceite e cria `pedidos_personalizados`, gerando link do WhatsApp com resumo amigavel.

## Paginas legais

- `/termos`: texto completo e versao atual do contrato.
- `/privacidade`: resumo LGPD com contatos oficiais.
- Ambas aproveitam `data/legal.ts` e `lib/legal.ts` (hash SHA256).

## Design system

- Paleta: primary `#D62828`, secondary `#F8F8F8`, accent `#FFF3F0`, texto `#222222`.
- Fonts `Poppins` (conteudo) e `Nunito` (display) via `next/font`.
- Cards radius 32px, sombras `shadow-card` e `shadow-floating`.
- Header fixo com marca "Realizhe Marmitas" + contador animado (Framer Motion).

## Scripts

```bash
npm run dev    # desenvolvimento
npm run build  # build de producao
npm run start  # servidor Next.js em producao
npm run lint   # lint padrao Next.js
```

## Deploy rapido

1. Defina variaveis de ambiente na plataforma (Vercel, por exemplo).
2. `npm run build` e `npm run start` devem rodar sem ajustes extras.
3. WhatsApp abre via `window.open`, portanto precisa de ambiente browser.

## Roadmap sugerido

- Adicionar autenticao Supabase Auth para area logada.
- Integrar Supabase Storage ou S3 para anexos em vez de base64.
- Criar dashboards internos com status de producao.
- Automatizar notificacoes e conciliacao de pagamentos (PIX/PSP).

---

Realizhe Real Food - Alimentacao com Proposito.
