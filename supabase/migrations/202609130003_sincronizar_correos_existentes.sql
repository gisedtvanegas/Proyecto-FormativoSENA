-- Reparación única para perfiles creados antes de vincular Supabase Auth.
-- auth.users es la fuente de verdad de correo y credenciales.
update public.usuarios as perfil
set correo = cuenta.email
from auth.users as cuenta
where perfil.auth_user_id = cuenta.id
  and perfil.correo is distinct from cuenta.email;
