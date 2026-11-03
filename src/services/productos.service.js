import { supabase } from './supabase';

export const productosService = {
  /**
   * Listar todos los productos activos del menú
   */
  async listar() {
    const { data, error } = await supabase
      .from('producto_menu')
      .select('*')
      .eq('activo', true)
      .order('idproducto', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Crear nuevo producto en el menú
   */
  async crear(productoData) {
    const { data, error } = await supabase
      .from('producto_menu')
      .insert({
        nombre: productoData.nombre,
        descripcion: productoData.descripcion,
        precio: Number.parseFloat(productoData.precio),
        imagen: productoData.imagen || productoData.imagen_url || null,
        activo: true
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Actualizar producto del menú
   */
  async actualizar(id, productoData) {
    const { data, error } = await supabase
      .from('producto_menu')
      .update({
        nombre: productoData.nombre,
        descripcion: productoData.descripcion,
        precio: Number.parseFloat(productoData.precio),
        imagen: productoData.imagen || productoData.imagen_url || null
      })
      .eq('idproducto', id)
      .eq('activo', true)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Eliminar producto (Baja lógica)
   */
  async eliminar(id) {
    const { data, error } = await supabase
      .from('producto_menu')
      .update({ activo: false })
      .eq('idproducto', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};
