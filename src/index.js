import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Ocultar el loading fallback cuando React se monta
const hideLoadingFallback = () => {
  const loadingElement = document.getElementById('loading-fallback');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Ocultar loading después de que React se monte
hideLoadingFallback();

// Si quieres empezar a medir performance en tu app, pasa una función
// para logear los resultados (por ejemplo: reportWebVitals(console.log))
// o envía a un endpoint de analytics. Aprende más: https://bit.ly/CRA-vitals
reportWebVitals();