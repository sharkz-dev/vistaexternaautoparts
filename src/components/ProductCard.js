// src/components/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  EyeIcon,
  TagIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { 
  getProductImageUrl, 
  formatPrice, 
  calculateDiscountedPrice,
  handleImageError 
} from '../utils/helpers';

const ProductCard = ({ product }) => {
  if (!product) return null;

  const hasDiscount = product.onSale && product.discountPercentage > 0;
  const discountedPrice = hasDiscount 
    ? calculateDiscountedPrice(product.price, product.discountPercentage)
    : product.price;
  
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Badge de descuento */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <TagIcon className="w-3 h-3 mr-1" />
            -{product.discountPercentage}%
          </span>
        </div>
      )}

      {/* Badge de stock agotado */}
      {isOutOfStock && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-gray-800 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
            Agotado
          </span>
        </div>
      )}

      {/* Imagen del producto */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={getProductImageUrl(product)}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            isOutOfStock ? 'filter grayscale opacity-60' : ''
          }`}
          onError={handleImageError}
        />
        
        {/* Overlay con acciones */}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-3">
            <Link
              to={`/product/${product.slug || product._id}`}
              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Ver detalles"
            >
              <EyeIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-4">
        {/* Marca */}
        {product.brand && (
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
        )}

        {/* Nombre del producto */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          <Link to={`/product/${product.slug || product._id}`}>
            {product.name}
          </Link>
        </h3>

        {/* Descripción corta */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Precio */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(discountedPrice)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Stock e información adicional */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            {isOutOfStock ? (
              <span className="text-red-600 font-medium">Sin stock</span>
            ) : product.stockQuantity <= 5 ? (
              <span className="text-orange-600 font-medium">
                Solo {product.stockQuantity} disponibles
              </span>
            ) : (
              <span className="text-green-600 font-medium">Disponible</span>
            )}
          </div>
          
          {product.featured && (
            <span className="text-yellow-600 text-xs font-medium">Destacado</span>
          )}
        </div>

        {/* Botón de acción */}
        <div className="mt-4">
          <Link
            to={`/product/${product.slug || product._id}`}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium text-center block"
          >
            Ver Producto
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;