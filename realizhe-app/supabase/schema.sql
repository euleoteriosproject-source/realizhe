CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text,
  telefone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome, telefone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.email),
    NEW.raw_user_meta_data ->> 'telefone'
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    nome = EXCLUDED.nome,
    telefone = EXCLUDED.telefone,
    updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS auth_users_handle_new_user ON auth.users;
CREATE TRIGGER auth_users_handle_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();

CREATE OR REPLACE FUNCTION public.auth_user_id_by_email(p_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_email text;
  v_user_id uuid;
BEGIN
  IF p_email IS NULL THEN
    RETURN NULL;
  END IF;

  v_email := lower(trim(p_email));

  SELECT u.id
    INTO v_user_id
    FROM auth.users u
   WHERE lower(u.email) = v_email
   LIMIT 1;

  RETURN v_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.auth_user_id_by_email(text) TO service_role;

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
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'clientes_user_id_fkey'
  ) THEN
    ALTER TABLE public.clientes
      ADD CONSTRAINT clientes_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'clientes_user_id_key'
  ) THEN
    ALTER TABLE public.clientes
      ADD CONSTRAINT clientes_user_id_key UNIQUE (user_id);
  END IF;
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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'termos_aceite_cliente_id_key'
  ) THEN
    ALTER TABLE public.termos_aceite
      ADD CONSTRAINT termos_aceite_cliente_id_key UNIQUE (cliente_id);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.ensure_cliente_with_terms(
  p_email text,
  p_phone text,
  p_nome text,
  p_cpf text,
  p_endereco text,
  p_cidade text,
  p_cep text,
  p_terms_version text,
  p_terms_hash text,
  p_terms_acceptance timestamptz,
  p_terms_ip inet DEFAULT NULL
)
RETURNS TABLE(id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_phone text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  v_email text := nullif(trim(lower(p_email)), '');
  v_cliente_id uuid;
  v_accept_at timestamptz := coalesce(p_terms_acceptance, now());
  v_hash text := concat(p_terms_version, ':', p_terms_hash);
BEGIN
  IF v_phone = '' AND v_email IS NULL THEN
    RAISE EXCEPTION 'Telefone ou e-mail obrigatorio' USING ERRCODE = '23514';
  END IF;

  SELECT c.id
    INTO v_cliente_id
    FROM public.clientes c
   WHERE (v_phone <> '' AND regexp_replace(coalesce(c.telefone, ''), '\D', '', 'g') = v_phone)
      OR (v_email IS NOT NULL AND lower(c.email) = v_email)
   ORDER BY c.created_at ASC
   LIMIT 1;

  IF v_cliente_id IS NULL THEN
    INSERT INTO public.clientes (
      nome,
      email,
      telefone,
      cpf,
      endereco,
      cidade,
      cep,
      aceite_termos,
      hash_termos,
      data_aceite
    )
    VALUES (
      coalesce(nullif(trim(p_nome), ''), 'Cliente Realizhe'),
      v_email,
      v_phone,
      nullif(trim(p_cpf), ''),
      nullif(trim(p_endereco), ''),
      nullif(trim(p_cidade), ''),
      nullif(trim(p_cep), ''),
      true,
      v_hash,
      v_accept_at
    )
    RETURNING id INTO v_cliente_id;
  ELSE
    UPDATE public.clientes
       SET nome = coalesce(nullif(trim(p_nome), ''), nome),
           email = coalesce(v_email, email),
           telefone = coalesce(nullif(v_phone, ''), telefone),
           cpf = coalesce(nullif(trim(p_cpf), ''), cpf),
           endereco = coalesce(nullif(trim(p_endereco), ''), endereco),
           cidade = coalesce(nullif(trim(p_cidade), ''), cidade),
           cep = coalesce(nullif(trim(p_cep), ''), cep)
     WHERE public.clientes.id = v_cliente_id;

    UPDATE public.clientes
       SET aceite_termos = true,
           hash_termos = v_hash,
           data_aceite = v_accept_at
     WHERE public.clientes.id = v_cliente_id
       AND NOT public.clientes.aceite_termos;
  END IF;

  INSERT INTO public.termos_aceite (
    cliente_id,
    versao_termos,
    hash_termos,
    data_aceite,
    ip_cliente,
    aceitou_lgpd
  )
  VALUES (
    v_cliente_id,
    p_terms_version,
    p_terms_hash,
    v_accept_at,
    p_terms_ip,
    true
  )
  ON CONFLICT (cliente_id) DO UPDATE
    SET versao_termos = EXCLUDED.versao_termos,
        hash_termos = EXCLUDED.hash_termos,
        data_aceite = EXCLUDED.data_aceite,
        ip_cliente = coalesce(EXCLUDED.ip_cliente, public.termos_aceite.ip_cliente),
        aceitou_lgpd = true;

  RETURN QUERY SELECT v_cliente_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_cliente_with_terms(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  timestamptz,
  inet
) TO service_role;

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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'pedidos'
      AND column_name = 'status'
  ) THEN
    ALTER TABLE public.pedidos
      ADD COLUMN status text DEFAULT 'pendente';
  END IF;
END $$;

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
