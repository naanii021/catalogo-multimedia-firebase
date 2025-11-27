import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import './App.css';

// Lazy loading de componentes para mejorar rendimiento inicial
const HomePage = lazy(() => import('./assets/pages/HomePage.jsx'));
const ItemDetailPage = lazy(() => import('./assets/pages/ItemDetailPage.jsx'));
const ItemFormPage = lazy(() => import('./assets/pages/ItemFormPage.jsx'));

// Componente de loading futurista
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    color: '#ba68c8',
    fontSize: '1.5rem',
    fontWeight: '600',
    textShadow: '0 0 20px rgba(186, 104, 200, 0.5)'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(186, 104, 200, 0.3)',
      borderTop: '3px solid #ba68c8',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '1rem'
    }}></div>
    Cargando...
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Suspense fallback={<LoadingSpinner />}>
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
