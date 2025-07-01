// src/utils/helpers.js

// URL base para imágenes
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// SVG placeholder como Data URL
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='%23f3f4f6'/%3e%3cg%3e%3crect x='150' y='150' width='100' height='60' rx='8' fill='%23d1d5db'/%3e%3ccircle cx='170' cy='170' r='8' fill='%23f3f4f6'/%3e%3cpath d='m185 185 15-15 25 25 15-15' stroke='%23f3f4f6' stroke-width='2' fill='none'/%3e%3c/g%3e%3ctext x='50%25' y='280' font-family='Arial, sans-serif' font-size='16' fill='%236b7280' text-anchor='middle'%3eImagen no disponible%3c/text%3e%3c/svg%3e";

/**
 * Construye la URL completa para una imagen
 */
export const getImageUrl = (imageName) => {
  if (!imageName) {
    return PLACEHOLDER_IMAGE;
  }

  // Si ya es una URL completa
  if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }

  // Si ya tiene /uploads/ al inicio
  if (imageName.startsWith('/uploads/')) {
    return `${API_BASE_URL}${imageName}`;
  }

  // Si tiene uploads/ sin la barra inicial
  if (imageName.startsWith('uploads/')) {
    return `${API_BASE_URL}/${imageName}`;
  }

  // Si es solo el nombre del archivo
  return `${API_BASE_URL}/uploads/${imageName}`;
};

/**
 * Obtiene la URL de la primera imagen de un producto
 */
export const getProductImageUrl = (product) => {
  if (!product || !product.images || product.images.length === 0) {
    return PLACEHOLDER_IMAGE;
  }
  return getImageUrl(product.images[0]);
};

/**
 * Formatear precio en formato chileno
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(price);
};

/**
 * Calcular precio con descuento
 */
export const calculateDiscountedPrice = (price, discountPercentage) => {
  if (!discountPercentage || discountPercentage <= 0) return price;
  return price - (price * discountPercentage / 100);
};

/**
 * Manejo de errores de imagen - usa el placeholder SVG
 */
export const handleImageError = (event) => {
  const img = event.target;
  if (!img.dataset.errorHandled) {
    img.dataset.errorHandled = 'true';
    img.src = PLACEHOLDER_IMAGE;
  }
};

/**
 * Crear slug a partir de texto
 */
export const createSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};