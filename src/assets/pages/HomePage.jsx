import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ItemCard from '../../components/ItemCard.jsx';
import { getItems } from '../services/itemsService.js';
import { ITEM_TYPES } from '../models.js';

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'videojuego', 'serie', 'pelicula'

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.type === filter));
    }
  }, [items, filter]);

  const loadItems = async () => {
    try {
      const itemsData = await getItems();
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando catálogo...</div>;
  }

  return (
    <div className="home-page">
      <header className="page-header">
        <h1>Catálogo de Entretenimiento</h1>
        <Link to="/add" className="add-button">Agregar Nuevo Ítem</Link>
      </header>

      <div className="filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Todos ({items.length})
        </button>
        <button
          className={filter === ITEM_TYPES.VIDEOJUEGO ? 'active' : ''}
          onClick={() => setFilter(ITEM_TYPES.VIDEOJUEGO)}
        >
          Videojuegos ({items.filter(item => item.type === ITEM_TYPES.VIDEOJUEGO).length})
        </button>
        <button
          className={filter === ITEM_TYPES.SERIE ? 'active' : ''}
          onClick={() => setFilter(ITEM_TYPES.SERIE)}
        >
          Series ({items.filter(item => item.type === ITEM_TYPES.SERIE).length})
        </button>
        <button
          className={filter === ITEM_TYPES.PELICULA ? 'active' : ''}
          onClick={() => setFilter(ITEM_TYPES.PELICULA)}
        >
          Películas ({items.filter(item => item.type === ITEM_TYPES.PELICULA).length})
        </button>
      </div>

      <div className="items-grid">
        {filteredItems.length === 0 ? (
          <div className="no-items">
            <p>No hay ítems en esta categoría.</p>
            <Link to="/add">Agregar el primero</Link>
          </div>
        ) : (
          filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;