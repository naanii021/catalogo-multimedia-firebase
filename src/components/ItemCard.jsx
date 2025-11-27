import { Link } from 'react-router-dom';
import { ITEM_TYPES, ITEM_CATEGORIES } from '../assets/models.js';

const ItemCard = ({ item }) => {
  const category = ITEM_CATEGORIES[item.type];

  return (
    <div className="item-card">
      <Link to={`/item/${item.id}`} className="item-card-link">
        <div className="item-image">
          {item.imagen ? (
            <img src={item.imagen} alt={item.titulo} />
          ) : (
            <div className="no-image">Sin imagen</div>
          )}
        </div>
        <div className="item-info">
          <h3>{item.titulo}</h3>
          <p className="item-type">{category.label}</p>
          <p className="item-genre">{item.genero}</p>
          <p className="item-year">{item.anio}</p>
          {item.type === ITEM_TYPES.VIDEOJUEGO && item.plataforma && (
            <p className="item-platform">Plataforma: {item.plataforma}</p>
          )}
          {item.type === ITEM_TYPES.SERIE && item.temporadas && (
            <p className="item-seasons">Temporadas: {item.temporadas}</p>
          )}
          {item.type === ITEM_TYPES.PELICULA && item.duracion && (
            <p className="item-duration">Duración: {item.duracion} min</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;