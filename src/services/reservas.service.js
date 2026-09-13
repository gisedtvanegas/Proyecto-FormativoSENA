import { supabase } from './supabase';

const DIAS_MINIMOS_ANTICIPACION = 3;

const normalizarFechaLocal = (fecha) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha || '')) {
    throw new Error('Selecciona una fecha válida.');
  }
  const resultado = new Date(`${fecha}T00:00:00`);
  if (Number.isNaN(resultado.getTime())) {
    throw new Error('Selecciona una fecha válida.');
  }
  return resultado;
};

const validarDatosReserva = (reservaData) => {
  const personas = Number(reservaData.num_personas);
  if (!Number.isInteger(personas) || personas < 1 || personas > 10) {
    throw new Error('La reserva debe ser para entre 1 y 10 personas.');
  }

  const fecha = normalizarFechaLocal(reservaData.fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const diferenciaDias = Math.round((fecha - hoy) / (1000 * 60 * 60 * 24));
  if (diferenciaDias <= DIAS_MINIMOS_ANTICIPACION) {
    throw new Error('Las reservas deben realizarse con más de 3 días de anticipación.');
  }

  if (!/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(reservaData.hora || '')) {
    throw new Error('Selecciona una hora válida.');
  }

  if (!reservaData.actividad_idactividad || !reservaData.usuarios_idusuarios) {
    throw new Error('Selecciona una actividad e inicia sesión para reservar.');
  }
};

export const reservasService = {
  /**
   * Crear nueva reserva verificando cupo máximo (30 personas/día) mediante RPC
   */
  async crearReserva(reservaData) {
    validarDatosReserva(reservaData);
    const { data, error } = await supabase.rpc('crear_reserva_segura', {
      p_num_personas: parseInt(reservaData.num_personas),
      p_hora: reservaData.hora,
      p_fecha: reservaData.fecha,
      p_usuario_id: parseInt(reservaData.usuarios_idusuarios),
      p_actividad_id: parseInt(reservaData.actividad_idactividad)
    });

    if (error) {
      if (error.message.includes('CUPO_NO_DISPONIBLE')) {
        throw new Error('No hay cupo suficiente para el número de personas en la fecha seleccionada (Aforo máximo 30 personas/día).');
      }
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Actualizar una reserva sin crear una segunda. La función SQL verifica
   * propiedad, anticipación y cupo de forma atómica.
   */
  async actualizarReserva(reservaData) {
    validarDatosReserva(reservaData);
    if (!reservaData.idreserva) {
      throw new Error('No se encontró la reserva a actualizar.');
    }

    const { data, error } = await supabase.rpc('actualizar_reserva_con_cupo', {
      p_reserva_id: parseInt(reservaData.idreserva),
      p_num_personas: parseInt(reservaData.num_personas),
      p_hora: reservaData.hora,
      p_fecha: reservaData.fecha,
      p_usuario_id: parseInt(reservaData.usuarios_idusuarios),
      p_actividad_id: parseInt(reservaData.actividad_idactividad)
    });

    if (error) {
      if (error.message.includes('CUPO_NO_DISPONIBLE')) {
        throw new Error('No hay cupo suficiente para el número de personas en la fecha seleccionada.');
      }
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Listar reservas de un usuario específico con detalles enriquecidos y banderas de edición
   */
  async listarPorUsuario(idUsuario) {
    const { data, error } = await supabase
      .from('reserva')
      .select(`
        *,
        actividad:actividad_idactividad(idactividad, descripcion_actividad),
        estado_reserva:estado_reserva_idestado_reserva(idestado_reserva, descripcion_esta),
        pagos:pagos_idpagos(idpagos, estado_pago)
      `)
      .eq('usuarios_idusuarios', idUsuario)
      .eq('activo', true)
      .order('fecha', { ascending: false });

    if (error) throw new Error(error.message);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return data.map(r => {
      const fechaReserva = new Date(r.fecha + 'T00:00:00');
      const diffTime = fechaReserva - hoy;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const descripcionEstado = r.estado_reserva?.descripcion_esta || 'Estado no disponible';
      const esCancelada = descripcionEstado.toLowerCase() === 'cancelada';
      const puedeEditar = !esCancelada && diffDays > 3;

      return {
        ...r,
        descripcionEstado,
        descripcionActividad: r.actividad?.descripcion_actividad || 'Actividad no disponible',
        estadoPago: r.pagos?.estado_pago || 'Pendiente',
        esCancelada,
        puedeEditar,
        puedeCancelar: puedeEditar
      };
    });
  },

  /**
   * Listar todas las reservas (para administrador / empleado)
   */
  async listarTodas() {
    const { data, error } = await supabase
      .from('reserva')
      .select(`
        *,
        usuario:usuarios_idusuarios(idusuarios, nombre, apellido, documento, correo, telefono),
        actividad:actividad_idactividad(idactividad, descripcion_actividad),
        estado_reserva:estado_reserva_idestado_reserva(idestado_reserva, descripcion_esta),
        pagos:pagos_idpagos(idpagos, estado_pago)
      `)
      .eq('activo', true)
      .order('fecha', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Cancelar reserva de usuario (solo si > 3 días)
   */
  async cancelarReserva(idReserva, idUsuario) {
    const { data, error } = await supabase.rpc('cancelar_reserva_con_anticipacion', {
      p_reserva_id: parseInt(idReserva),
      p_usuario_id: parseInt(idUsuario)
    });

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Actualizar estado o pago de reserva (Admin)
   */
  async actualizarEstadoAdmin(idReserva, idEstado, idPago) {
    const { data, error } = await supabase
      .from('reserva')
      .update({
        estado_reserva_idestado_reserva: parseInt(idEstado),
        pagos_idpagos: parseInt(idPago)
      })
      .eq('idreserva', idReserva)
      .eq('activo', true)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Eliminar reserva (Baja lógica Admin)
   */
  async eliminar(idReserva) {
    const { data, error } = await supabase
      .from('reserva')
      .update({ activo: false })
      .eq('idreserva', idReserva)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};
