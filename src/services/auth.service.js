import { supabase } from './supabase';

export const authService = {
  /**
   * Iniciar sesión con documento o correo y clave
   */
  async login(identificador, password) {
    let email = identificador;
    // Si el usuario ingresó un documento en vez de un correo, buscamos su correo en la tabla usuarios
    if (!identificador.includes('@')) {
      const { data: userProfile, error: docError } = await supabase
        .from('usuarios')
        .select('correo')
        .eq('documento', identificador)
        .eq('activo', true)
        .single();
      
      if (docError || !userProfile) {
        throw new Error('El documento no existe');
      }
      email = userProfile.correo;
    }

    // Iniciar sesión en Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Clave incorrecta');
      }
      throw new Error(error.message);
    }

    // Obtener perfil detallado del usuario
    const profile = await this.getProfile(email);
    return { session: data.session, user: data.user, profile };
  },

  /**
   * Registrar nuevo usuario
   */
  async register(userData) {
    // Verificar si ya existe documento
    const { data: docExist } = await supabase
      .from('usuarios')
      .select('idusuarios')
      .eq('documento', userData.documento)
      .maybeSingle();

    if (docExist) {
      throw new Error('El número de documento ya se encuentra registrado.');
    }

    // Registrar en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.correo,
      password: userData.clave
    });

    if (authError) {
      if (authError.status === 429 || authError.message?.toLowerCase().includes('too many requests') || authError.message?.toLowerCase().includes('rate limit')) {
        throw new Error('Por seguridad, Supabase limita los registros. Espera unos minutos e intenta de nuevo, o usa un correo diferente.');
      }
      if (authError.message?.toLowerCase().includes('user already registered') || authError.message?.toLowerCase().includes('already registered')) {
        throw new Error('Este correo ya está registrado. Intenta iniciar sesión o usa otro correo.');
      }
      throw new Error(authError.message);
    }

    // Insertar en tabla de usuarios del sistema
    const { data: userRecord, error: dbError } = await supabase
      .from('usuarios')
      .insert({
        auth_user_id: authData.user?.id || null,
        nombre: userData.nombre,
        apellido: userData.apellido,
        documento: userData.documento,
        telefono: userData.telefono,
        correo: userData.correo,
        clave: userData.clave,
        fecha_nac: userData.fecha_nac,
        fecha_cad: userData.fecha_cad,
        checkbox: userData.checkbox || false,
        tipo_documento_idtipo_documento: parseInt(userData.tipo_documento_idtipo_documento),
        roles_idroles: parseInt(userData.roles_idroles || 2), // 2 = Usuario por defecto
        activo: true
      })
      .select()
      .single();

    if (dbError) {
      throw new Error('Error al guardar datos de usuario: ' + dbError.message);
    }

    return userRecord;
  },

  /**
   * Obtener perfil completo por correo
   */
  async getProfile(correo) {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        tipo_documento:tipo_documento_idtipo_documento(descripcion_doc),
        roles:roles_idroles(descripcion_rol)
      `)
      .eq('correo', correo)
      .eq('activo', true)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Actualizar perfil del usuario
   */
  async updateProfile(idUsuario, profileData) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        nombre: profileData.nombre,
        correo: profileData.correo,
        telefono: profileData.telefono,
        foto_perfil: profileData.foto_perfil
      })
      .eq('idusuarios', idUsuario)
      .eq('activo', true)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Cerrar sesión
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  /**
   * Enviar correo de recuperación
   */
  async resetPasswordEmail(correo) {
    const { error } = await supabase.auth.resetPasswordForEmail(correo);
    if (error) throw new Error(error.message);
  }
};
