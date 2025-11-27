import { useState, useEffect, useRef } from 'react';

import { searchOMDB, getOMDBDetails, searchRAWG, getRAWGDetails } from "../assets/services/externalApis";
import './AutocompleteSearch.css';

/**
 * Componente de búsqueda con autocompletado
 * Busca en OMDB (películas/series) o RAWG (videojuegos) según el tipo
 * @param {string} type - Tipo de ítem ('pelicula', 'serie', 'videojuego')
 * @param {function} onSelect - Callback cuando se selecciona un resultado
 */
const AutocompleteSearch = ({ type, onSelect }) => {
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  // Estado para los resultados de la búsqueda
  const [results, setResults] = useState([]);
  // Estado de carga mientras busca
  const [loading, setLoading] = useState(false);
  // Estado para mostrar/ocultar dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  // Referencia al contenedor para detectar clicks fuera
  const containerRef = useRef(null);

  /**
   * useEffect para buscar cuando cambia el término de búsqueda
   * Usa debounce (espera 500ms después de que el usuario deje de escribir)
   */
  useEffect(() => {
    // Si el término está vacío, limpiar resultados
    if (searchTerm.trim().length === 0) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    // Debounce: esperar 500ms antes de buscar
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 500);

    // Cleanup: cancelar el timeout si el usuario sigue escribiendo
    return () => clearTimeout(timeoutId);
  }, [searchTerm, type]);

  /**
   * useEffect para detectar clicks fuera del componente y cerrar el dropdown
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Realizar la búsqueda según el tipo de contenido
   */
  const performSearch = async () => {
    setLoading(true);
    try {
      let searchResults = [];

      // Buscar en la API correspondiente según el tipo
      if (type === 'videojuego') {
        // Buscar videojuegos en RAWG
        searchResults = await searchRAWG(searchTerm);
      } else {
        // Buscar películas/series en OMDB
        searchResults = await searchOMDB(searchTerm);
      }

      setResults(searchResults);
      setShowDropdown(searchResults.length > 0);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejar la selección de un resultado
   * @param {Object} item - Item seleccionado
   */
  const handleSelect = async (item) => {
    setLoading(true);
    try {
      let details = null;

      // Obtener detalles completos según el tipo
      if (type === 'videojuego') {
        details = await getRAWGDetails(item.id);
      } else {
        details = await getOMDBDetails(item.imdbID);
      }

      // Si se obtuvieron los detalles, llamar al callback
      if (details) {
        onSelect(details);
        // Limpiar búsqueda
        setSearchTerm('');
        setResults([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Error obteniendo detalles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="autocomplete-container" ref={containerRef}>
      {/* Input de búsqueda */}
      <div className="autocomplete-input-wrapper">
        <input
          type="text"
          className="autocomplete-input"
          placeholder={`🔍 Buscar ${type === 'videojuego' ? 'videojuego' : type}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
        />
        {loading && <span className="autocomplete-loader">⏳</span>}
      </div>

      {/* Dropdown de resultados */}
      {showDropdown && results.length > 0 && (
        <div className="autocomplete-dropdown">
          <div className="autocomplete-header">
            📋 {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
          </div>
          {results.map((item, index) => (
            <div
              key={index}
              className="autocomplete-item"
              onClick={() => handleSelect(item)}
            >
              {/* Imagen del resultado */}
              {item.poster && (
                <img
                  src={item.poster}
                  alt={item.title}
                  className="autocomplete-item-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              
              {/* Información del resultado */}
              <div className="autocomplete-item-info">
                <div className="autocomplete-item-title">{item.title}</div>
                <div className="autocomplete-item-meta">
                  {item.year && <span>📅 {item.year}</span>}
                  {item.platforms && <span>🎮 {item.platforms}</span>}
                  {item.genres && <span>🎭 {item.genres}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {showDropdown && results.length === 0 && !loading && searchTerm.length > 0 && (
        <div className="autocomplete-dropdown">
          <div className="autocomplete-no-results">
            😔 No se encontraron resultados para "{searchTerm}"
          </div>
        </div>
      )}
    </div>
  );
};

export default AutocompleteSearch;