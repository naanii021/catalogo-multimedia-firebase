import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ITEM_TYPES, ITEM_CATEGORIES } from '../assets/models.js';
import { getCommentsByItemId } from '../assets/services/commentsService.js';

const ItemCard = ({ item }) => {
  // Estado para almacenar la puntuación media
  const [avgRating, setAvgRating] = useState(0);
  // Estado para contar cuántos comentarios tiene el ítem
  const [commentCount, setCommentCount] = useState(0);
  // Estado de carga mientras obtenemos los comentarios
  const [loading, setLoading] = useState(true);
  
  // Obtener la categoría del ítem (Videojuego, Serie, Película)
  const category = ITEM_CATEGORIES[item.type];

  // Cargar la puntuación cuando el componente se monta o cambia el ID del ítem
  useEffect(() => {
    loadRating();
  }, [item.id]);

  /**
   * Función para cargar los comentarios y calcular la puntuación media
   */
  const loadRating = async () => {
    try {
      // Obtener todos los comentarios de este ítem desde Firestore
      const comments = await getCommentsByItemId(item.id);
      
      // Guardar la cantidad de comentarios
      setCommentCount(comments.length);
      
      // Solo calcular la media si hay comentarios
      if (comments.length > 0) {
        // Sumar todas las puntuaciones (rating) de los comentarios
        const sum = comments.reduce((acc, comment) => acc + (comment.rating || 0), 0);
        // Calcular la media dividiendo la suma entre el número de comentarios
        const avg = sum / comments.length;
        setAvgRating(avg);
      }
    } catch (error) {
      console.error('Error loading rating:', error);
    } finally {
      // Marcar como terminada la carga
      setLoading(false);
    }
  };

  /**
   * Renderizar estrellas basándose en una puntuación decimal
   * @param {number} rating - Puntuación de 0 a 5
   * @returns Cadena con estrellas llenas (★), medias (⯨) y vacías (☆)
   */
  const renderStars = (rating) => {
    // Obtener las estrellas completas (parte entera del número)
    const fullStars = Math.floor(rating);
    // Verificar si hay media estrella (si el decimal es >= 0.5)
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <>
        {/* Estrellas llenas: repetir ★ según fullStars */}
        {'★'.repeat(fullStars)}
        {/* Media estrella si corresponde */}
        {hasHalfStar && '⯨'}
        {/* Estrellas vacías: completar hasta 5 estrellas totales */}
        {'☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
      </>
    );
  };

  return (
    <div className="item-card">
      {/* Link a la página de detalle del ítem */}
      <Link to={`/item/${item.id}`} className="item-card-link">
        
        {/* Contenedor de la imagen */}
        <div className="item-image">
          {/* Mostrar imagen si existe, sino mostrar placeholder */}
          {item.imagen ? (
            <img src={item.imagen} alt={item.titulo} />
          ) : (
            <div className="no-image">Sin imagen</div>
          )}
          
          {/* Badge de puntuación - solo mostrar si hay comentarios y terminó de cargar */}
          {!loading && commentCount > 0 && (
            <div className="rating-badge">
              {/* Estrellas visuales */}
              <span className="rating-stars">{renderStars(avgRating)}</span>
              {/* Número decimal de la puntuación */}
              <span className="rating-number">{avgRating.toFixed(1)}</span>
              {/* Cantidad de valoraciones entre paréntesis */}
              <span className="rating-count">({commentCount})</span>
            </div>
          )}
        </div>
        
        {/* Información del ítem */}
        <div className="item-info">
          {/* Título del ítem */}
          <h3>{item.titulo}</h3>
          
          {/* Tipo (Videojuego, Serie, Película) */}
          <p className="item-type">{category.label}</p>
          
          {/* Género */}
          <p className="item-genre">{item.genero}</p>
          
          {/* Año de lanzamiento */}
          <p className="item-year">{item.anio}</p>
          
          {/* Campos específicos según el tipo de ítem */}
          
          {/* Si es videojuego y tiene plataforma, mostrarla */}
          {item.type === ITEM_TYPES.VIDEOJUEGO && item.plataforma && (
            <p className="item-platform">Plataforma: {item.plataforma}</p>
          )}
          
          {/* Si es serie y tiene temporadas, mostrarlas */}
          {item.type === ITEM_TYPES.SERIE && item.temporadas && (
            <p className="item-seasons">Temporadas: {item.temporadas}</p>
          )}
          
          {/* Si es película y tiene duración, mostrarla */}
          {item.type === ITEM_TYPES.PELICULA && item.duracion && (
            <p className="item-duration">Duración: {item.duracion} min</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;