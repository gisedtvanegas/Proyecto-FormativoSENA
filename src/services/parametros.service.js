import { supabase } from './supabase';

export const parametrosService = {
  // --- TIPOS DE DOCUMENTO ---
  async listarTiposDocumento() {
    const { data, error } = await supabase.from('tipo_documento').select('*').eq('activo', true).order('idtipo_documento');
    if (error) throw new Error(error.message);
    return data;
  },
  async crearTipoDocumento(descripcion) {
    const { data, error } = await supabase.from('tipo_documento').insert({ descripcion_doc: descripcion, activo: true }).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  async actualizarTipoDocumento(id, descripcion) {
    const { data, error } = await supabase.from('tipo_documento').update({ descripcion_doc: descripcion }).eq('idtipo_documento', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  async eliminarTipoDocumento(id) {
    const { data, error } = await supabase.from('tipo_documento').update({ activo: false }).eq('idtipo_documento', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  // --- ROLES ---
  async listarRoles() {
    const { data, error } = await supabase.from('roles').select('*').eq('activo', true).order('idroles');
    if (error) throw new Error(error.message);
    return data;
  },
  async crearRol(descripcion) {
    const { data, error } = await supabase.from('roles').insert({ descripcion_rol: descripcion, activo: true }).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  async actualizarRol(id, descripcion) {
    const { data, error } = await supabase.from('roles').update({ descripcion_rol: descripcion }).eq('idroles', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  async eliminarRol(id) {
    const { data, error } = await supabase.from('roles').update({ activo: false }).eq('idroles', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  // --- HORARIOS ---
  async listarHorarios() {
    const { data, error } = await supabase.from('horarios').select('*').eq('activo', true).order('idhorarios');
    if (error) throw new Error(error.message);
    return data;
  },
  async crearHorario(horaIni, horaFin) {
    const { data, error } = await supabase.from('horarios').insert({ hora_ini: horaIni, hora_fin: horaFin, activo: true }).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  async actualizarHorario(id, horaIni, horaFin) {
    const { data, error } = await supabase.from('horarios').update({ hora_ini: horaIni, hora_fin: horaFin }).eq('idhorarios', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  async eliminarHorario(id) {
    const { data, error } = await supabase.from('horarios').update({ activo: false }).eq('idhorarios', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  // --- DISPONIBILIDAD ---
  async listarDisponibilidad() {
    const { data, error } = await supabase
      .from('disponibilidad')
      .select('*, horarios:horarios_idhorarios(hora_ini, hora_fin)')
      .eq('activo', true)
      .order('fecha', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  },
  async crearDisponibilidad(dispData) {
    const { data, error } = await supabase.from('disponibilidad').insert({
      fecha: dispData.fecha,
      cupo_total: parseInt(dispData.cupo_total || 30),
      cupo_disponible: parseInt(dispData.cupo_disponible || 30),
      horarios_idhorarios: parseInt(dispData.horarios_idhorarios),
      activo: true
    }).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  async actualizarDisponibilidad(id, dispData) {
    const { data, error } = await supabase.from('disponibilidad').update({
      fecha: dispData.fecha,
      cupo_total: parseInt(dispData.cupo_total),
      cupo_disponible: parseInt(dispData.cupo_disponible),
      horarios_idhorarios: parseInt(dispData.horarios_idhorarios)
    }).eq('iddisponibilidad', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  async eliminarDisponibilidad(id) {
    const { data, error } = await supabase.from('disponibilidad').update({ activo: false }).eq('iddisponibilidad', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  // --- TIPOS DE ACTIVIDAD ---
  async listarTiposActividad() {
    const { data, error } = await supabase.from('tipo_actividad').select('*').eq('activo', true).order('idtipo_actividad');
    if (error) throw new Error(error.message);
    return data;
  },
  async crearTipoActividad(nombre) {
    const { data, error } = await supabase.from('tipo_actividad').insert({ nombre_activi: nombre, activo: true }).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  async actualizarTipoActividad(id, nombre) {
    const { data, error } = await supabase.from('tipo_actividad').update({ nombre_activi: nombre }).eq('idtipo_actividad', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  async eliminarTipoActividad(id) {
    const { data, error } = await supabase.from('tipo_actividad').update({ activo: false }).eq('idtipo_actividad', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  // --- LISTA DE PRECIOS ---
  async listarPrecios() {
    const { data, error } = await supabase.from('lista_precios').select('*').eq('activo', true).order('idlista_precios');
    if (error) throw new Error(error.message);
    return data;
  },
  async crearPrecio(precio) {
    const { data, error } = await supabase.from('lista_precios').insert({ descrip_precio: parseFloat(precio), activo: true }).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  async actualizarPrecio(id, precio) {
    const { data, error } = await supabase.from('lista_precios').update({ descrip_precio: parseFloat(precio) }).eq('idlista_precios', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  async eliminarPrecio(id) {
    const { data, error } = await supabase.from('lista_precios').update({ activo: false }).eq('idlista_precios', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  // --- ESTADO RESERVA & PAGOS ---
  async listarEstadosReserva() {
    const { data, error } = await supabase.from('estado_reserva').select('*').eq('activo', true);
    if (error) throw new Error(error.message);
    return data;
  },
  async listarEstadosPagos() {
    const { data, error } = await supabase.from('pagos').select('*').eq('activo', true);
    if (error) throw new Error(error.message);
    return data;
  }
};
