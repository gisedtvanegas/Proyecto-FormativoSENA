import { supabase } from './supabase';

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

export const validarImagen = (file) => {
  if (!file) throw new Error('Selecciona una imagen.');
  if (!Object.hasOwn(IMAGE_TYPES, file.type)) {
    throw new Error('La imagen debe estar en formato JPG, PNG o WEBP.');
  }
  if (file.size > IMAGE_MAX_BYTES) {
    throw new Error('La imagen no puede superar 5 MB.');
  }
};

const extensionImagen = (file) => IMAGE_TYPES[file.type];

const subirArchivo = async (bucket, path, file) => {
  validarImagen(file);
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: true
  });
  if (error) throw new Error(`No fue posible subir la imagen: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const storageService = {
  async subirFotoPerfil(file, authUserId) {
    if (!authUserId) throw new Error('Tu sesión no es válida para subir una foto.');
    const path = `${authUserId}/perfil.${extensionImagen(file)}`;
    return subirArchivo('perfiles', path, file);
  },

  async subirFotoActividad(file) {
    const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const path = `actividades/${id}.${extensionImagen(file)}`;
    return subirArchivo('actividades', path, file);
  },

  async subirFotoMenu(file) {
    const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const path = `menu/${id}.${extensionImagen(file)}`;
    return subirArchivo('menu', path, file);
  }
};
