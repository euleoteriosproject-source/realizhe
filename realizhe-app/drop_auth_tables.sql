-- Remove related data
DELETE FROM public.termos_aceite;
DELETE FROM public.clientes;
DELETE FROM public.profiles;

-- Remove auth entries (identities, sessions, refresh tokens)
DELETE FROM auth.refresh_tokens;
DELETE FROM auth.sessions;
DELETE FROM auth.identities;
DELETE FROM auth.users;

-- Drop optional triggers if needed
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_auth_user() CASCADE;
DROP FUNCTION IF EXISTS public.auth_user_id_by_email(text) CASCADE;
DROP FUNCTION IF EXISTS public.ensure_cliente_with_terms(text, text, text, text, text, text, text, text, text, timestamptz, inet) CASCADE;
DROP TRIGGER IF EXISTS auth_users_handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;

-- Drop tables
DROP TABLE IF EXISTS public.clientes CASCADE;
DROP TABLE IF EXISTS public.termos_aceite CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

