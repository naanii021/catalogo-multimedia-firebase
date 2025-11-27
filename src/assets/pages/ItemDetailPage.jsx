import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import CommentSection from '../../components/CommentSection.jsx';
import { getItemById, deleteItem } from '../services/itemsService.js';
import { ITEM_TYPES, ITEM_CATEGORIES } from '../models.js';

const ItemDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      const itemData = await getItemById(id);
      setItem(itemData);
    } catch (error) {
      console.error('Error loading item:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este ítem?')) {
      return;
    }

    setDeleting(true);
    try {
      await deleteItem(id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando ítem...</div>;
  }

  if (!item) {
    return <div className="error">Ítem no encontrado</div>;
  }

  const category = ITEM_CATEGORIES[item.type];

  return (
    <div className="item-detail-page">
      <header className="page-header">
        <button onClick={() => navigate('/')} className="back-button">← Volver</button>
        <div className="item-actions">
          <Link to={`/edit/${item.id}`} className="edit-button">Editar</Link>
          <button onClick={handleDelete} disabled={deleting} className="delete-button">
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </header>

      <div className="item-detail">
        <div className="item-image-large">
          {item.imagen ? (
            <img src={item.imagen} alt={item.titulo} />
          ) : (
            <div className="no-image-large">Sin imagen</div>
          )}
        </div>

        <div className="item-info-detailed">
          <h1>{item.titulo}</h1>
          <p className="item-type">{category.label}</p>
          <p className="item-genre"><strong>Género:</strong> {item.genero}</p>
          <p className="item-year"><strong>Año:</strong> {item.anio}</p>

          {item.type === ITEM_TYPES.VIDEOJUEGO && item.plataforma && (
            <p className="item-platform"><strong>Plataforma:</strong> {item.plataforma}</p>
          )}
          {item.type === ITEM_TYPES.SERIE && item.temporadas && (
            <p className="item-seasons"><strong>Temporadas:</strong> {item.temporadas}</p>
          )}
          {item.type === ITEM_TYPES.PELICULA && item.duracion && (
            <p className="item-duration"><strong>Duración:</strong> {item.duracion} minutos</p>
          )}

          {item.descripcion && (
            <div className="item-description">
              <h3>Descripción</h3>
              <p>{item.descripcion}</p>
            </div>
          )}
        </div>
      </div>

      <CommentSection itemId={item.id} />
    </div>
  );
};

export default ItemDetailPage;