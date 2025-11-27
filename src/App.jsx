import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

// Lazy loading de componentes para mejorar rendimiento inicial
const HomePage = lazy(() => import('./assets/pages/HomePage.jsx'));
const ItemDetailPage = lazy(() => import('./assets/pages/ItemDetailPage.jsx'));
const ItemFormPage = lazy(() => import('./assets/pages/ItemFormPage.jsx'));

// Componente de loading simple para transiciones entre páginas
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'var(--color-bg-primary)',
    color: 'var(--color-neon-cyan)',
    fontSize: '1.5rem',
    fontFamily: 'var(--font-pixel)',
    textShadow: 'var(--glow-cyan)',
    letterSpacing: '3px'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid transparent',
      borderTop: '3px solid var(--color-neon-cyan)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '1rem',
      boxShadow: 'var(--glow-cyan)'
    }}></div>
    LOADING...
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
  };

  // Mostrar pantalla de carga inicial
  if (showLoadingScreen) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <Router>
      <div className="App">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/item/:id" element={<ItemDetailPage />} />
            <Route path="/add" element={<ItemFormPage />} />
            <Route path="/edit/:id" element={<ItemFormPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;