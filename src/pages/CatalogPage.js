// src/pages/CatalogPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/ProductCard';

const CatalogPage = () => {
  // Estados principales
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [showOnSale, setShowOnSale] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);

  // Estados de UI
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError('');

        // Cargar productos, categorías y marcas en paralelo
        const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
          productService.getProducts({ limit: 100 }),
          categoryService.getCategories(),
          productService.getBrands()
        ]);

        setProducts(productsResponse.data.data || []);
        setCategories(categoriesResponse.data.data || []);
        setBrands(brandsResponse.data.data || []);

      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar el catálogo. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filtrar y ordenar productos
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Filtro por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por categoría
    if (selectedCategory) {
      result = result.filter(product => 
        product.category?._id === selectedCategory || 
        product.category?.slug === selectedCategory
      );
    }

    // Filtro por marca
    if (selectedBrand) {
      result = result.filter(product => 
        product.brand === selectedBrand
      );
    }

    // Filtro por rango de precio
    if (priceRange.min !== '') {
      result = result.filter(product => 
        product.price >= parseFloat(priceRange.min)
      );
    }
    if (priceRange.max !== '') {
      result = result.filter(product => 
        product.price <= parseFloat(priceRange.max)
      );
    }

    // Filtros de estado
    if (showOnSale) {
      result = result.filter(product => product.onSale);
    }
    if (showInStock) {
      result = result.filter(product => product.stockQuantity > 0);
    }
    if (showFeatured) {
      result = result.filter(product => product.featured);
    }

    // Ordenar
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'discount':
          return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [
    products, 
    searchTerm, 
    selectedCategory, 
    selectedBrand, 
    priceRange, 
    sortBy, 
    showOnSale, 
    showInStock, 
    showFeatured
  ]);

  // Paginación
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = processedProducts.slice(startIndex, startIndex + itemsPerPage);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange({ min: '', max: '' });
    setShowOnSale(false);
    setShowInStock(false);
    setShowFeatured(false);
    setCurrentPage(1);
  };

  // Contar filtros activos
  const activeFiltersCount = [
    searchTerm,
    selectedCategory,
    selectedBrand,
    priceRange.min,
    priceRange.max,
    showOnSale,
    showInStock,
    showFeatured
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando catálogo...</p>
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
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Productos</h1>
          <p className="text-gray-600">
            Encontramos {processedProducts.length} producto(s) 
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        </div>

        {/* Barra de búsqueda y controles */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos, marcas, descripciones..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Ordenar */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Ordenar por nombre</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="newest">Más recientes</option>
                <option value="discount">Mayor descuento</option>
              </select>
            </div>

            {/* Botón de filtros móvil */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panel de filtros */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Limpiar ({activeFiltersCount})
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Categorías */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Marcas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Todas las marcas</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rango de precio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rango de precio
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Mín"
                      value={priceRange.min}
                      onChange={(e) => {
                        setPriceRange({ ...priceRange, min: e.target.value });
                        setCurrentPage(1);
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Máx"
                      value={priceRange.max}
                      onChange={(e) => {
                        setPriceRange({ ...priceRange, max: e.target.value });
                        setCurrentPage(1);
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filtros de estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showOnSale}
                        onChange={(e) => {
                          setShowOnSale(e.target.checked);
                          setCurrentPage(1);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">En oferta</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showInStock}
                        onChange={(e) => {
                          setShowInStock(e.target.checked);
                          setCurrentPage(1);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Con stock</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showFeatured}
                        onChange={(e) => {
                          setShowFeatured(e.target.checked);
                          setCurrentPage(1);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Destacados</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de productos */}
          <div className="flex-1">
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Anterior
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-2 border rounded-md ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <MagnifyingGlassIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
                  <p className="mb-4">
                    {searchTerm || activeFiltersCount > 0
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'No hay productos disponibles en este momento'
                    }
                  </p>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;