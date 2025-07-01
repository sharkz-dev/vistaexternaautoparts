// src/pages/ProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { productService } from '../services/api';
import { 
  getImageUrl,
  formatPrice, 
  calculateDiscountedPrice,
  handleImageError
} from '../utils/helpers';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Cargar producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await productService.getProduct(id);
        setProduct(response.data.data);
      } catch (err) {
        console.error('Error al cargar producto:', err);
        if (err.response?.status === 404) {
          setError('Producto no encontrado');
        } else {
          setError('Error al cargar el producto. Intente nuevamente.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="flex gap-8">
              <div className="w-1/2 h-96 bg-gray-300 rounded-lg"></div>
              <div className="w-1/2 space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Volver
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const hasDiscount = product.onSale && product.discountPercentage > 0;
  const discountedPrice = hasDiscount 
    ? calculateDiscountedPrice(product.price, product.discountPercentage)
    : product.price;
  
  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [null]; // Usar null para activar el placeholder desde helpers

  // Navegar entre imágenes
  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Calcular rating promedio
  const averageRating = product.averageRating || 0;
  const totalReviews = product.numReviews || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-blue-600">Inicio</Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/catalog" className="hover:text-blue-600">Catálogo</Link>
            </li>
            {product.category && (
              <>
                <li>/</li>
                <li>
                  <Link 
                    to={`/catalog?category=${product.category._id}`}
                    className="hover:text-blue-600"
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li>/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Volver
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Galería de imágenes */}
            <div className="space-y-4">
              {/* Imagen principal */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={getImageUrl(images[selectedImageIndex])}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
                
                {/* Navegación de imágenes */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  {hasDiscount && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <TagIcon className="w-4 h-4 mr-1" />
                      -{product.discountPercentage}%
                    </span>
                  )}
                  {product.featured && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Destacado
                    </span>
                  )}
                  {isOutOfStock && (
                    <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                      Agotado
                    </span>
                  )}
                </div>
              </div>

              {/* Miniaturas */}
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index
                          ? 'border-blue-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="space-y-6">
              {/* Header del producto */}
              <div>
                {product.brand && (
                  <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                )}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                {/* Rating */}
                {totalReviews > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(averageRating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {averageRating.toFixed(1)} ({totalReviews} reseña{totalReviews !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}

                {/* SKU */}
                {product.sku && (
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                )}
              </div>

              {/* Precio */}
              <div className="border-t border-b border-gray-200 py-6">
                <div className="flex items-center space-x-4">
                  {hasDiscount ? (
                    <>
                      <span className="text-3xl font-bold text-red-600">
                        {formatPrice(discountedPrice)}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                        Ahorra {formatPrice(product.price - discountedPrice)}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Estado del stock */}
              <div>
                {isOutOfStock ? (
                  <div className="flex items-center text-red-600">
                    <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                    <span className="font-medium">Producto agotado</span>
                  </div>
                ) : isLowStock ? (
                  <div className="flex items-center text-orange-600">
                    <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                    <span className="font-medium">
                      Solo quedan {product.stockQuantity} unidades
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600">
                    <ShieldCheckIcon className="w-5 h-5 mr-2" />
                    <span className="font-medium">En stock ({product.stockQuantity} disponibles)</span>
                  </div>
                )}
              </div>

              {/* Descripción */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Especificaciones técnicas */}
              {(product.specifications && Object.keys(product.specifications).length > 0) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Especificaciones</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1">
                        <span className="text-gray-600">{key}:</span>
                        <span className="text-gray-900 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modelos compatibles */}
              {product.compatibleModels && product.compatibleModels.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Modelos compatibles</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.compatibleModels.map((model, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                      >
                        {typeof model === 'object' 
                          ? `${model.make} ${model.model} ${model.year}` 
                          : model
                        }
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones de acción adicionales */}
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {isFavorite ? (
                    <HeartIconSolid className="w-5 h-5 text-red-500 mr-2" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-gray-400 mr-2" />
                  )}
                  {isFavorite ? 'Favorito' : 'Añadir a favoritos'}
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: product.description,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Enlace copiado al portapapeles');
                    }
                  }}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <ShareIcon className="w-5 h-5 text-gray-400 mr-2" />
                  Compartir
                </button>
              </div>

              {/* Información adicional */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <TruckIcon className="w-5 h-5 mr-2" />
                  <span>Envío gratis en compras sobre $50.000</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 mr-2" />
                  <span>Garantía de calidad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;