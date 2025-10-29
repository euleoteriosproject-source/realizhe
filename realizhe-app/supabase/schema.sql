CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  nome text NOT NULL,
  email text,
  telefone text NOT NULL,
  cpf text,
  endereco text,
  cidade text,
  cep text,
  aceite_termos boolean DEFAULT false,
  hash_termos text,
  data_aceite timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clientes
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS aceite_termos boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS hash_termos text,
  ADD COLUMN IF NOT EXISTS data_aceite timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DO $$
BEGIN
  ALTER TABLE clientes
    ADD CONSTRAINT clientes_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE clientes
    ADD CONSTRAINT clientes_user_id_key UNIQUE (user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS clientes_email_idx ON public.clientes(email);
CREATE INDEX IF NOT EXISTS clientes_telefone_idx ON public.clientes(telefone);

DROP TRIGGER IF EXISTS clientes_set_updated_at ON public.clientes;
CREATE TRIGGER clientes_set_updated_at
BEFORE UPDATE ON public.clientes
FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TABLE IF NOT EXISTS termos_aceite (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES clientes(id) ON DELETE CASCADE,
  versao_termos text NOT NULL,
  hash_termos text NOT NULL,
  data_aceite timestamptz DEFAULT now(),
  ip_cliente inet,
  aceitou_lgpd boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES clientes(id),
  tipo_pedido text NOT NULL,
  itens jsonb,
  valor_total numeric,
  forma_pagamento text,
  observacoes text,
  status text DEFAULT 'pendente',
  criado_em timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pedidos_personalizados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES clientes(id),
  plano jsonb NOT NULL,
  frequencia text,
  forma_pagamento text,
  valor_estimado numeric,
  observacoes text,
  arquivo_plano text,
  criado_em timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  nome text NOT NULL,
  descricao text,
  preco numeric(10,2) NOT NULL CHECK (preco >= 0),
  imagem_path text,
  categoria text,
  destaques jsonb DEFAULT '[]'::jsonb,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

DROP TRIGGER IF EXISTS produtos_set_updated_at ON public.produtos;
CREATE TRIGGER produtos_set_updated_at
BEFORE UPDATE ON public.produtos
FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE INDEX IF NOT EXISTS produtos_slug_idx ON public.produtos(slug);
CREATE INDEX IF NOT EXISTS produtos_ativo_idx ON public.produtos(ativo);
CREATE INDEX IF NOT EXISTS produtos_nome_idx ON public.produtos(nome);
