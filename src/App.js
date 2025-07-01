// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta principal - Catálogo */}
          <Route path="/" element={<CatalogPage />} />
          
          {/* Ruta del catálogo */}
          <Route path="/catalog" element={<CatalogPage />} />
          
          {/* Ruta de detalle del producto */}
          <Route path="/product/:id" element={<ProductDetailPage />} />
          
          {/* Ruta por defecto - redirige al catálogo */}
          <Route path="*" element={<CatalogPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;