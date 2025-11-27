// ============================================
// SERVICIOS DE APIS EXTERNAS
// Para autocompletar datos de películas, series y videojuegos
// ============================================

// Obtener las API keys desde las variables de entorno
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;

// URLs base de las APIs
const OMDB_BASE_URL = 'https://www.omdbapi.com';
const RAWG_BASE_URL = 'https://api.rawg.io/api';

/**
 * Buscar películas o series en OMDB
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array} Lista de resultados con título, año, poster, etc.
 */
export const searchOMDB = async (searchTerm) => {
  try {
    // Hacer petición a OMDB API
    const response = await fetch(
      `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(searchTerm)}`
    );
    const data = await response.json();
    
    // Si la respuesta es exitosa y hay resultados
    if (data.Response === 'True' && data.Search) {
      // Mapear los resultados a nuestro formato
      return data.Search.map(item => ({
        title: item.Title,
        year: item.Year,
        type: item.Type === 'series' ? 'serie' : 'pelicula',
        poster: item.Poster !== 'N/A' ? item.Poster : '',
        imdbID: item.imdbID // Para obtener detalles completos después
      }));
    }
    
    return []; // No hay resultados
  } catch (error) {
    console.error('❌ Error buscando en OMDB:', error);
    return [];
  }
};

/**
 * Obtener detalles completos de una película/serie desde OMDB
 * @param {string} imdbID - ID de IMDb del ítem
 * @returns {Object} Objeto con todos los detalles
 */
export const getOMDBDetails = async (imdbID) => {
  try {
    // Obtener información completa usando el ID de IMDb
    const response = await fetch(
      `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`
    );
    const data = await response.json();
    
    if (data.Response === 'True') {
      return {
        titulo: data.Title,
        descripcion: data.Plot !== 'N/A' ? data.Plot : '',
        anio: data.Year,
        genero: data.Genre !== 'N/A' ? data.Genre : '',
        imagen: data.Poster !== 'N/A' ? data.Poster : '',
        // Campos específicos según el tipo
        duracion: data.Runtime !== 'N/A' ? data.Runtime.replace(' min', '') : '',
        temporadas: data.totalSeasons || '',
        estudio: data.Production !== 'N/A' ? data.Production : '',
        type: data.Type === 'series' ? 'serie' : 'pelicula'
      };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error obteniendo detalles de OMDB:', error);
    return null;
  }
};

/**
 * Buscar videojuegos en RAWG
 * Ordenados por más recientes primero
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array} Lista de resultados con nombre, imagen, plataformas, etc.
 */
export const searchRAWG = async (searchTerm) => {
  try {
    // Hacer petición a RAWG API
    // ✅ ordering=-released → Juegos más recientes primero
    // ✅ page_size=15 → Más resultados para elegir
    const response = await fetch(
      `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(searchTerm)}&page_size=15&ordering=-released`
    );
    const data = await response.json();
    
    // Si hay resultados
    if (data.results && data.results.length > 0) {
      // Mapear los resultados a nuestro formato
      return data.results.map(game => ({
        title: game.name,
        year: game.released ? new Date(game.released).getFullYear() : '',
        poster: game.background_image || '',
        platforms: game.platforms?.map(p => p.platform.name).join(', ') || '',
        genres: game.genres?.map(g => g.name).join(', ') || '',
        rating: game.rating || 0,
        id: game.id // Para obtener detalles completos después
      }));
    }
    
    return []; // No hay resultados
  } catch (error) {
    console.error('❌ Error buscando en RAWG:', error);
    return [];
  }
};

/**
 * Obtener detalles completos de un videojuego desde RAWG
 * Con descripción limpia y acortada
 * @param {number} gameId - ID del juego en RAWG
 * @returns {Object} Objeto con todos los detalles
 */
export const getRAWGDetails = async (gameId) => {
  try {
    // Obtener información completa del juego
    const response = await fetch(
      `${RAWG_BASE_URL}/games/${gameId}?key=${RAWG_API_KEY}`
    );
    const data = await response.json();
    
    // ✅ Obtener la descripción y limpiarla
    let descripcion = data.description_raw || '';
    
    // Si no hay descripción raw, intentar con la normal y limpiar HTML
    if (!descripcion && data.description) {
      // Crear un elemento temporal para limpiar HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = data.description;
      descripcion = tempDiv.textContent || tempDiv.innerText || '';
    }
    
    // ✅ Limitar la descripción a 400 caracteres máximo
    if (descripcion.length > 400) {
      descripcion = descripcion.substring(0, 400).trim() + '...';
    }
    
    // Si no hay descripción, poner un mensaje genérico
    if (!descripcion) {
      descripcion = 'Información no disponible. Edita manualmente la descripción.';
    }
    
    return {
      titulo: data.name,
      descripcion: descripcion,
      anio: data.released ? new Date(data.released).getFullYear() : '',
      genero: data.genres?.map(g => g.name).join(', ') || '',
      imagen: data.background_image || '',
      plataforma: data.platforms?.map(p => p.platform.name).join(', ') || '',
      estudio: data.developers?.map(d => d.name).join(', ') || '',
      type: 'videojuego'
    };
  } catch (error) {
    console.error('❌ Error obteniendo detalles de RAWG:', error);
    return null;
  }
};