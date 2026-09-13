-- Ejecutar esta migración en Supabase antes de publicar las pantallas de perfil.
-- Los buckets son públicos para que las URLs almacenadas en las tablas puedan mostrarse.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('perfiles', 'perfiles', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('actividades', 'actividades', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.es_administrador()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.usuarios
    where auth_user_id = auth.uid() and activo = true and roles_idroles = 1
  );
$$;

revoke all on function public.es_administrador() from public;
grant execute on function public.es_administrador() to authenticated;

drop policy if exists "Fotos de perfil públicas" on storage.objects;
drop policy if exists "Usuario sube su foto de perfil" on storage.objects;
drop policy if exists "Usuario actualiza su foto de perfil" on storage.objects;
drop policy if exists "Usuario elimina su foto de perfil" on storage.objects;
drop policy if exists "Fotos de actividad públicas" on storage.objects;
drop policy if exists "Administrador gestiona fotos de actividad" on storage.objects;

create policy "Fotos de perfil públicas" on storage.objects for select using (bucket_id = 'perfiles');
create policy "Usuario sube su foto de perfil" on storage.objects for insert to authenticated
  with check (bucket_id = 'perfiles' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Usuario actualiza su foto de perfil" on storage.objects for update to authenticated
  using (bucket_id = 'perfiles' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'perfiles' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Usuario elimina su foto de perfil" on storage.objects for delete to authenticated
  using (bucket_id = 'perfiles' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Fotos de actividad públicas" on storage.objects for select using (bucket_id = 'actividades');
create policy "Administrador gestiona fotos de actividad" on storage.objects for all to authenticated
  using (bucket_id = 'actividades' and public.es_administrador())
  with check (bucket_id = 'actividades' and public.es_administrador());

-- El correo del perfil se actualiza solo después de que Supabase Auth confirmó el cambio.
create or replace function public.sincronizar_correo_desde_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.usuarios set correo = new.email where auth_user_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists sincronizar_correo_usuario on auth.users;
create trigger sincronizar_correo_usuario
after update of email on auth.users
for each row execute function public.sincronizar_correo_desde_auth();
