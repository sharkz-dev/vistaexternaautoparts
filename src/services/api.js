// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Servicio de productos
export const productService = {
  // Obtener productos con filtros
  getProducts: (params = {}) => {
    return api.get('/products', { params });
  },
  
  // Obtener producto individual por slug o ID
  getProduct: (slugOrId) => {
    return api.get(`/products/${slugOrId}`);
  },
  
  // Obtener productos en oferta
  getProductsOnSale: (params = {}) => {
    return api.get('/products/on-sale', { params });
  },
  
  // Obtener marcas disponibles
  getBrands: () => {
    return api.get('/products/brands');
  },
  
  // Búsqueda de productos
  searchProducts: (query, filters = {}) => {
    return api.get('/products', {
      params: { search: query, ...filters }
    });
  }
};

// Servicio de categorías
export const categoryService = {
  getCategories: () => {
    return api.get('/categories');
  },
  
  getCategory: (slugOrId) => {
    return api.get(`/categories/${slugOrId}`);
  }
};

export default api;