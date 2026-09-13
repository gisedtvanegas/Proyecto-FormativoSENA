-- Seguridad y reglas de negocio de reservas.
-- Aplicar mediante Supabase CLI o el SQL Editor, después de revisar las
-- políticas RLS actuales. Esta migración no elimina información existente.

create or replace function public.crear_reserva_segura(
  p_num_personas integer,
  p_hora time without time zone,
  p_fecha date,
  p_usuario_id integer,
  p_actividad_id integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'NO_AUTENTICADO';
  end if;

  if not exists (
    select 1
    from public.usuarios u
    where u.idusuarios = p_usuario_id
      and u.auth_user_id = auth.uid()
      and u.activo = true
  ) then
    raise exception 'USUARIO_NO_AUTORIZADO';
  end if;

  if p_num_personas < 1 or p_num_personas > 10 then
    raise exception 'PERSONAS_INVALIDAS';
  end if;

  if p_fecha <= current_date + 3 then
    raise exception 'ANTICIPACION_INVALIDA';
  end if;

  if not exists (
    select 1 from public.actividad a
    where a.idactividad = p_actividad_id and a.activo = true
  ) then
    raise exception 'ACTIVIDAD_NO_DISPONIBLE';
  end if;

  -- Conserva la inserción y la comprobación atómica de cupo ya existente.
  perform public.crear_reserva_con_cupo(
    p_num_personas,
    p_hora,
    p_fecha,
    p_usuario_id,
    p_actividad_id
  );
end;
$$;

create or replace function public.actualizar_reserva_con_cupo(
  p_reserva_id integer,
  p_num_personas integer,
  p_hora time without time zone,
  p_fecha date,
  p_usuario_id integer,
  p_actividad_id integer
)
returns public.reserva
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reserva public.reserva;
  v_ocupacion integer;
begin
  if auth.uid() is null then
    raise exception 'NO_AUTENTICADO';
  end if;

  if p_num_personas < 1 or p_num_personas > 10 then
    raise exception 'PERSONAS_INVALIDAS';
  end if;

  if p_fecha <= current_date + 3 then
    raise exception 'ANTICIPACION_INVALIDA';
  end if;

  select r.* into v_reserva
  from public.reserva r
  join public.usuarios u on u.idusuarios = r.usuarios_idusuarios
  where r.idreserva = p_reserva_id
    and r.usuarios_idusuarios = p_usuario_id
    and r.activo = true
    and u.auth_user_id = auth.uid()
    and u.activo = true
  for update of r;

  if not found then
    raise exception 'RESERVA_NO_AUTORIZADA';
  end if;

  if not exists (
    select 1 from public.actividad a
    where a.idactividad = p_actividad_id and a.activo = true
  ) then
    raise exception 'ACTIVIDAD_NO_DISPONIBLE';
  end if;

  select coalesce(sum(r.num_personas), 0) into v_ocupacion
  from public.reserva r
  left join public.estado_reserva er on er.idestado_reserva = r.estado_reserva_idestado_reserva
  where r.activo = true
    and r.idreserva <> p_reserva_id
    and r.fecha = p_fecha
    and coalesce(lower(er.descripcion_esta), '') <> 'cancelada';

  if v_ocupacion + p_num_personas > 30 then
    raise exception 'CUPO_NO_DISPONIBLE';
  end if;

  update public.reserva
  set num_personas = p_num_personas,
      hora = p_hora,
      fecha = p_fecha,
      actividad_idactividad = p_actividad_id
  where idreserva = p_reserva_id
  returning * into v_reserva;

  return v_reserva;
end;
$$;

create or replace function public.cancelar_reserva_con_anticipacion(
  p_reserva_id integer,
  p_usuario_id integer
)
returns public.reserva
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reserva public.reserva;
  v_estado_cancelada integer;
begin
  if auth.uid() is null then
    raise exception 'NO_AUTENTICADO';
  end if;

  select r.* into v_reserva
  from public.reserva r
  join public.usuarios u on u.idusuarios = r.usuarios_idusuarios
  where r.idreserva = p_reserva_id
    and r.usuarios_idusuarios = p_usuario_id
    and r.activo = true
    and u.auth_user_id = auth.uid()
    and u.activo = true
  for update of r;

  if not found then
    raise exception 'RESERVA_NO_AUTORIZADA';
  end if;

  if v_reserva.fecha <= current_date + 3 then
    raise exception 'ANTICIPACION_INVALIDA';
  end if;

  select idestado_reserva into v_estado_cancelada
  from public.estado_reserva
  where activo = true and lower(descripcion_esta) = 'cancelada'
  limit 1;

  if v_estado_cancelada is null then
    raise exception 'ESTADO_CANCELADA_NO_CONFIGURADO';
  end if;

  update public.reserva
  set estado_reserva_idestado_reserva = v_estado_cancelada
  where idreserva = p_reserva_id
  returning * into v_reserva;

  return v_reserva;
end;
$$;

revoke all on function public.crear_reserva_segura(integer, time without time zone, date, integer, integer) from public;
revoke all on function public.actualizar_reserva_con_cupo(integer, integer, time without time zone, date, integer, integer) from public;
revoke all on function public.cancelar_reserva_con_anticipacion(integer, integer) from public;

grant execute on function public.crear_reserva_segura(integer, time without time zone, date, integer, integer) to authenticated;
grant execute on function public.actualizar_reserva_con_cupo(integer, integer, time without time zone, date, integer, integer) to authenticated;
grant execute on function public.cancelar_reserva_con_anticipacion(integer, integer) to authenticated;
