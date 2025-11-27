import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ItemCard from '../../components/ItemCard.jsx';
// ✅ Importar onSnapshot en lugar de usar solo getDocs
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase.js';
import { ITEM_TYPES } from '../models.js';

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'videojuego', 'serie', 'pelicula'

  // ✅ useEffect que configura el listener de tiempo real
  useEffect(() => {
    // Crear la query ordenada por fecha de creación
    const q = query(
      collection(db, 'items'), 
      orderBy('createdAt', 'desc')
    );

    // ✅ onSnapshot se ejecuta automáticamente cada vez que hay cambios en Firestore
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        // Crear array con todos los ítems actualizados
        const itemsData = [];
        querySnapshot.forEach((doc) => {
          itemsData.push({ ...doc.data(), id: doc.id });
        });
        
        console.log('📡 Datos actualizados en tiempo real:', itemsData);
        setItems(itemsData); // Actualizar estado
        setLoading(false); // Marcar como cargado
      },
      (error) => {
        // Manejar errores de la suscripción
        console.error('Error en tiempo real:', error);
        setLoading(false);
      }
    );

    // ✅ Cleanup: cancelar suscripción cuando el componente se desmonte
    // Esto evita memory leaks y listeners huérfanos
    return () => {
      console.log('🔌 Desconectando listener de tiempo real');
      unsubscribe();
    };
  }, []); // Array vacío = solo se ejecuta al montar el componente

  // ✅ useEffect para filtrar ítems (se mantiene igual)
  useEffect(() => {
    if (filter === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.type === filter));
    }
  }, [items, filter]);


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