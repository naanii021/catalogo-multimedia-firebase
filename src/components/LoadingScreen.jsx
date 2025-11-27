import { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Simular carga progresiva
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onLoadingComplete(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Animación de puntos
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-container">
        {/* Logo/Título */}
        <div className="loading-logo">
          <h1 className="loading-title">CATÁLOGO</h1>
          <h2 className="loading-subtitle">MULTIMEDIA</h2>
        </div>

        {/* Animación retro */}
        <div className="loading-animation">
          <div className="pixel-spinner">
            <div className="pixel-box"></div>
            <div className="pixel-box"></div>
            <div className="pixel-box"></div>
            <div className="pixel-box"></div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="loading-bar-container">
          <div className="loading-bar">
            <div 
              className="loading-bar-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="loading-percentage">{progress}%</div>
        </div>

        {/* Texto de carga */}
        <div className="loading-text">
          LOADING{dots}
        </div>

        {/* Instrucciones retro */}
        <div className="loading-instructions">
          <p>▶ PRESS START</p>
        </div>
      </div>

      {/* Efecto de escaneo */}
      <div className="scanline"></div>
    </div>
  );
};

export default LoadingScreen;