import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createItemDoc, getItemById, updateItem } from '../services/itemsService.js';
import { ITEM_TYPES, ITEM_CATEGORIES } from '../models.js';

const ItemFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    type: ITEM_TYPES.VIDEOJUEGO,
    titulo: '',
    genero: '',
    anio: '',
    descripcion: '',
    imagen: '',
    plataforma: '',
    temporadas: '',
    duracion: ''
  });
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadItem();
    }
  }, [id]);

  const loadItem = async () => {
    try {
      const item = await getItemById(id);
      setFormData({
        type: item.type,
        titulo: item.titulo || '',
        genero: item.genero || '',
        anio: item.anio || '',
        descripcion: item.descripcion || '',
        imagen: item.imagen || '',
        plataforma: item.plataforma || '',
        temporadas: item.temporadas || '',
        duracion: item.duracion || ''
      });
    } catch (error) {
      console.error('Error loading item:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditing) {
        await updateItem(id, formData);
      } else {
        await createItemDoc(formData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const currentCategory = ITEM_CATEGORIES[formData.type];

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="item-form-page">
      <header className="page-header">
        <h1>{isEditing ? 'Editar Ítem' : 'Agregar Nuevo Ítem'}</h1>
        <button onClick={() => navigate('/')} className="back-button">Volver</button>
      </header>

      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-group" >
          <label htmlFor="type">Tipo de ítem:</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={isEditing} // No permitir cambiar tipo en edición
          >
            <option value={ITEM_TYPES.VIDEOJUEGO} >Videojuego</option>
            <option value={ITEM_TYPES.SERIE}>Serie</option>
            <option value={ITEM_TYPES.PELICULA}>Película</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="genero">Género:</label>
          <input
            type="text"
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="anio">Año:</label>
          <input
            type="number"
            id="anio"
            name="anio"
            value={formData.anio}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear() + 1}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imagen">URL de imagen:</label>
          <input
            type="url"
            id="imagen"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
          />
        </div>

        {formData.type === ITEM_TYPES.VIDEOJUEGO && (
          <div className="form-group">
            <label htmlFor="plataforma">Plataforma:</label>
            <input
              type="text"
              id="plataforma"
              name="plataforma"
              value={formData.plataforma}
              onChange={handleChange}
            />
          </div>
        )}

        {formData.type === ITEM_TYPES.SERIE && (
          <div className="form-group">
            <label htmlFor="temporadas">Número de temporadas:</label>
            <input
              type="number"
              id="temporadas"
              name="temporadas"
              value={formData.temporadas}
              onChange={handleChange}
              min="1"
            />
          </div>
        )}

        {formData.type === ITEM_TYPES.PELICULA && (
          <div className="form-group">
            <label htmlFor="duracion">Duración (minutos):</label>
            <input
              type="number"
              id="duracion"
              name="duracion"
              value={formData.duracion}
              onChange={handleChange}
              min="1"
            />
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
          </button>
          <button type="button" onClick={() => navigate('/')} className="cancel-button">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemFormPage;