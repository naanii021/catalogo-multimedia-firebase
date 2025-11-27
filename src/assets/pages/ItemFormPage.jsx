import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createItemDoc, updateItem, getItemById } from '../services/itemsService.js';
import { ITEM_TYPES, ITEM_CATEGORIES } from '../models.js';
import AutocompleteSearch from '../../components/AutocompleteSearch.jsx';

const ItemFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Si hay ID, estamos editando
  const isEditing = Boolean(id);

  // Estado del formulario
  const [formData, setFormData] = useState({
    type: '',
    titulo: '',
    genero: '',
    anio: '',
    descripcion: '',
    imagen: '',
    // Campos específicos por tipo
    plataforma: '',
    temporadas: '',
    duracion: '',
    estudio: ''
  });

  // Estado de carga y errores
  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);

  /**
   * Cargar datos del ítem si estamos editando
   */
  useEffect(() => {
    if (isEditing) {
      loadItem();
    }
  }, [id]);

  /**
   * Función para cargar un ítem existente
   */
  const loadItem = async () => {
    setLoadingItem(true);
    try {
      const item = await getItemById(id);
      setFormData({
        type: item.type || '',
        titulo: item.titulo || '',
        genero: item.genero || '',
        anio: item.anio || '',
        descripcion: item.descripcion || '',
        imagen: item.imagen || '',
        plataforma: item.plataforma || '',
        temporadas: item.temporadas || '',
        duracion: item.duracion || '',
        estudio: item.estudio || ''
      });
    } catch (error) {
      console.error('Error loading item:', error);
      alert('Error al cargar el ítem');
      navigate('/');
    } finally {
      setLoadingItem(false);
    }
  };

  /**
   * Manejar cambios en los campos del formulario
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Manejar selección de resultado del autocompletado
   * @param {Object} selectedData - Datos obtenidos de la API externa
   */
  const handleAutocompleteSelect = (selectedData) => {
    console.log('📦 Datos seleccionados:', selectedData);
    
    // Rellenar el formulario con los datos obtenidos
    setFormData(prev => ({
      ...prev,
      titulo: selectedData.titulo || prev.titulo,
      descripcion: selectedData.descripcion || prev.descripcion,
      anio: selectedData.anio || prev.anio,
      genero: selectedData.genero || prev.genero,
      imagen: selectedData.imagen || prev.imagen,
      estudio: selectedData.estudio || prev.estudio,
      // Campos específicos
      plataforma: selectedData.plataforma || prev.plataforma,
      temporadas: selectedData.temporadas || prev.temporadas,
      duracion: selectedData.duracion || prev.duracion
    }));

    // Mostrar notificación de éxito
    alert('✅ Datos importados correctamente. Revisa y completa la información.');
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formData.type || !formData.titulo || !formData.anio) {
      alert('Por favor completa los campos obligatorios (Tipo, Título, Año)');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        // Actualizar ítem existente
        await updateItem(id, formData);
        alert('✅ Ítem actualizado correctamente');
      } else {
        // Crear nuevo ítem
        await createItemDoc(formData);
        alert('✅ Ítem creado correctamente');
      }
      navigate('/'); // Volver a la página principal
    } catch (error) {
      console.error('Error saving item:', error);
      alert('❌ Error al guardar el ítem');
    } finally {
      setLoading(false);
    }
  };

  if (loadingItem) {
    return <div className="loading">Cargando ítem...</div>;
  }

  return (
    <div className="item-form-page">
      <header className="page-header">
        <h1>{isEditing ? 'Editar Ítem' : 'Agregar Nuevo Ítem'}</h1>
        <button onClick={() => navigate('/')} className="back-button">
          ← Volver
        </button>
      </header>

      <form onSubmit={handleSubmit} className="item-form">
        
        {/* ============================================
            TIPO DE CONTENIDO
            ============================================ */}
        <div className="form-group">
          <label>Tipo *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            disabled={isEditing} // No permitir cambiar tipo al editar
          >
            <option value="">Selecciona un tipo</option>
            <option value={ITEM_TYPES.PELICULA}>Película</option>
            <option value={ITEM_TYPES.SERIE}>Serie</option>
            <option value={ITEM_TYPES.VIDEOJUEGO}>Videojuego</option>
          </select>
        </div>

        {/* ============================================
            AUTOCOMPLETADO - Solo si hay tipo seleccionado y NO estamos editando
            ============================================ */}
        {formData.type && !isEditing && (
          <div className="autocomplete-section">
            <div className="autocomplete-label">
              <span className="label-icon">🔍</span>
              <strong>Búsqueda automática:</strong> Busca y autocompleta los datos
            </div>
            <AutocompleteSearch
              type={formData.type}
              onSelect={handleAutocompleteSelect}
            />
            <div className="autocomplete-hint">
              💡 <em>Busca el contenido para rellenar automáticamente los campos</em>
            </div>
          </div>
        )}

        {/* ============================================
            CAMPOS DEL FORMULARIO
            ============================================ */}
        
        {/* Título */}
        <div className="form-group">
          <label>Título *</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ej: The Legend of Zelda"
            required
          />
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Escribe una breve descripción..."
            rows={5}
          />
        </div>

        {/* Género */}
        <div className="form-group">
          <label>Género</label>
          <input
            type="text"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            placeholder="Ej: Aventura, Acción"
          />
        </div>

        {/* Año */}
        <div className="form-group">
          <label>Año de Lanzamiento *</label>
          <input
            type="number"
            name="anio"
            value={formData.anio}
            onChange={handleChange}
            placeholder="Ej: 2024"
            min="1900"
            max={new Date().getFullYear() + 5}
            required
          />
        </div>

        {/* Estudio/Productora */}
        <div className="form-group">
          <label>Estudio/Productora/Desarrolladora</label>
          <input
            type="text"
            name="estudio"
            value={formData.estudio}
            onChange={handleChange}
            placeholder="Ej: Nintendo, Marvel Studios"
          />
        </div>

        {/* ============================================
            CAMPOS ESPECÍFICOS POR TIPO
            ============================================ */}

        {/* Plataforma (solo videojuegos) */}
        {formData.type === ITEM_TYPES.VIDEOJUEGO && (
          <div className="form-group">
            <label>Plataforma</label>
            <input
              type="text"
              name="plataforma"
              value={formData.plataforma}
              onChange={handleChange}
              placeholder="Ej: Nintendo Switch, PC, PS5"
            />
          </div>
        )}

        {/* Temporadas (solo series) */}
        {formData.type === ITEM_TYPES.SERIE && (
          <div className="form-group">
            <label>Temporadas</label>
            <input
              type="text"
              name="temporadas"
              value={formData.temporadas}
              onChange={handleChange}
              placeholder="Ej: 3"
            />
          </div>
        )}

        {/* Duración (solo películas) */}
        {formData.type === ITEM_TYPES.PELICULA && (
          <div className="form-group">
            <label>Duración (minutos)</label>
            <input
              type="number"
              name="duracion"
              value={formData.duracion}
              onChange={handleChange}
              placeholder="Ej: 120"
            />
          </div>
        )}

        {/* URL de Imagen */}
        <div className="form-group">
          <label>URL de Imagen</label>
          <input
            type="url"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          {formData.imagen && (
            <div className="image-preview">
              <img src={formData.imagen} alt="Preview" />
            </div>
          )}
        </div>

        {/* ============================================
            BOTONES DE ACCIÓN
            ============================================ */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="cancel-button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Ítem'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemFormPage;