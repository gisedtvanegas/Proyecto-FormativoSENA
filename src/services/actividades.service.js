import { supabase } from './supabase';

export const actividadesService = {
  /**
   * Obtener todas las actividades activas (vista pública y usuario)
   */
  async listarPublicas() {
    const { data, error } = await supabase
      .from('actividad')
      .select(`
        *,
        tipo_actividad:tipo_actividad_idtipo_actividad(idtipo_actividad, nombre_activi),
        lista_precios:lista_precios_idlista_precios(idlista_precios, descrip_precio)
      `)
      .eq('activo', true)
      .order('idactividad', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Obtener actividad por ID
   */
  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('actividad')
      .select(`
        *,
        tipo_actividad:tipo_actividad_idtipo_actividad(idtipo_actividad, nombre_activi),
        lista_precios:lista_precios_idlista_precios(idlista_precios, descrip_precio)
      `)
      .eq('idactividad', id)
      .eq('activo', true)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Crear nueva actividad
   */
  async crear(actividadData) {
    const { data, error } = await supabase
      .from('actividad')
      .insert({
        descripcion_actividad: actividadData.descripcion_actividad,
        informacion: actividadData.informacion,
        foto_actividad: actividadData.foto_actividad,
        tipo_actividad_idtipo_actividad: parseInt(actividadData.tipo_actividad_idtipo_actividad),
        lista_precios_idlista_precios: parseInt(actividadData.lista_precios_idlista_precios),
        activo: true
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Actualizar actividad existente
   */
  async actualizar(id, actividadData) {
    const { data, error } = await supabase
      .from('actividad')
      .update({
        descripcion_actividad: actividadData.descripcion_actividad,
        informacion: actividadData.informacion,
        foto_actividad: actividadData.foto_actividad,
        tipo_actividad_idtipo_actividad: parseInt(actividadData.tipo_actividad_idtipo_actividad),
        lista_precios_idlista_precios: parseInt(actividadData.lista_precios_idlista_precios)
      })
      .eq('idactividad', id)
      .eq('activo', true)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Eliminar actividad (Baja lógica)
   */
  async eliminar(id) {
    const { data, error } = await supabase
      .from('actividad')
      .update({ activo: false })
      .eq('idactividad', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Subir foto de actividad a Supabase Storage
   */
  async subirImagen(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `actividad_${Date.now()}.${fileExt}`;
    const filePath = `actividades/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('actividades')
      .upload(filePath, file);

    if (uploadError) {
      // Si el bucket no existe en desarrollo, retornamos el nombre del archivo para assets
      console.warn('Storage bucket no disponible, usando nombre local:', uploadError.message);
      return fileName;
    }

    const { data } = supabase.storage.from('actividades').getPublicUrl(filePath);
    return data.publicUrl;
  }
};
