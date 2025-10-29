# Catálogo Realizhe

Single-page React (Vite) view to expose the Realizhe menu without the rest of the platform. Deployable to any static host (Vercel, Netlify, GitHub Pages, etc.).

## Configuração

1. Copie `.env.example` para `.env.local` e preencha:

   ```
   VITE_SUPABASE_URL=https://<project>.supabase.co
   VITE_SUPABASE_ANON_KEY=ey...
   VITE_SUPABASE_STORAGE_BUCKET=produtos
   VITE_SUPABASE_STORAGE_URL=https://<project>.supabase.co/storage/v1/object/public/produtos
   ```

   Somente a chave pública (anon) é usada; `service_role` **não** é necessária.

2. Instale as dependências e rode:

   ```bash
   npm install
   npm run dev
   ```

   O servidor abre em `http://localhost:5173`.

## Deploy

Qualquer provedor que sirva builds estáticos funciona:

- Vercel (`npm run build` ➝ `npm run preview`)
- Netlify / Cloudflare Pages
- GitHub Pages (`npm run build` ➝ publicar diretório `dist/`)

## Observações

- A página faz leitura direta via Supabase REST (`/rest/v1/produtos`). Ajuste policies para permitir `select` com a `anon key`.
- Layout otimizado para impressão (`Ctrl+P`) e visualização mobile/desktop.
