import { supabase } from './supabase';

export const usuariosService = {
  /**
   * Listar todos los usuarios activos
   */
  async listar() {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        idusuarios,
        nombre,
        apellido,
        documento,
        telefono,
        correo,
        tipo_documento_idtipo_documento,
        roles_idroles,
        tipo_documento:tipo_documento_idtipo_documento(idtipo_documento, descripcion_doc),
        roles:roles_idroles(idroles, descripcion_rol)
      `)
      .eq('activo', true)
      .order('idusuarios', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Actualizar usuario desde administración
   */
  async actualizar(id, userData) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        nombre: userData.nombre,
        apellido: userData.apellido,
        documento: userData.documento,
        telefono: userData.telefono,
        correo: userData.correo,
        tipo_documento_idtipo_documento: parseInt(userData.tipo_documento_idtipo_documento),
        roles_idroles: parseInt(userData.roles_idroles)
      })
      .eq('idusuarios', id)
      .eq('activo', true)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Eliminar usuario (Baja lógica)
   */
  async eliminar(id) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ activo: false })
      .eq('idusuarios', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};
