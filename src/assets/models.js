// Modelos de datos para el catálogo

export const ITEM_TYPES = {
  VIDEOJUEGO: 'videojuego',
  SERIE: 'serie',
  PELICULA: 'pelicula'
};

export const ITEM_CATEGORIES = {
  [ITEM_TYPES.VIDEOJUEGO]: {
    label: 'Videojuego',
    fields: ['titulo', 'genero', 'plataforma', 'anio', 'descripcion', 'imagen']
  },
  [ITEM_TYPES.SERIE]: {
    label: 'Serie',
    fields: ['titulo', 'genero', 'temporadas', 'anio', 'descripcion', 'imagen']
  },
  [ITEM_TYPES.PELICULA]: {
    label: 'Película',
    fields: ['titulo', 'genero', 'duracion', 'anio', 'descripcion', 'imagen']
  }
};

// Estructura base de un ítem
export const createItem = (type, data) => ({
  id: data.id || null,
  type,
  titulo: data.titulo || '',
  genero: data.genero || '',
  anio: data.anio || '',
  descripcion: data.descripcion || '',
  imagen: data.imagen || '',
  // Campos específicos por tipo
  ...(type === ITEM_TYPES.VIDEOJUEGO && { plataforma: data.plataforma || '' }),
  ...(type === ITEM_TYPES.SERIE && { temporadas: data.temporadas || '' }),
  ...(type === ITEM_TYPES.PELICULA && { duracion: data.duracion || '' }),
  createdAt: data.createdAt || new Date(),
  updatedAt: data.updatedAt || new Date()
});

// Estructura de un comentario
export const createComment = (data) => ({
  id: data.id || null,
  itemId: data.itemId,
  userId: data.userId,
  userName: data.userName,
  text: data.text,
  rating: data.rating || null, // 1-5 estrellas
  createdAt: data.createdAt || new Date()
});