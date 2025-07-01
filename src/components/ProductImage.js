import React, { useState } from 'react';
import { getImageUrl } from '../utils/helpers';

const PLACEHOLDER_SVG = "data:image/svg+xml,%3csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='%23f3f4f6'/%3e%3cg%3e%3crect x='150' y='150' width='100' height='60' rx='8' fill='%23d1d5db'/%3e%3ccircle cx='170' cy='170' r='8' fill='%23f3f4f6'/%3e%3cpath d='m185 185 15-15 25 25 15-15' stroke='%23f3f4f6' stroke-width='2' fill='none'/%3e%3c/g%3e%3ctext x='50%25' y='280' font-family='Arial, sans-serif' font-size='16' fill='%236b7280' text-anchor='middle'%3eImagen no disponible%3c/text%3e%3c/svg%3e";

const ProductImage = ({ 
  src, 
  alt, 
  className = "", 
  onError = null,
  ...props 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = (event) => {
    if (!hasError) {
      setHasError(true);
      setIsLoading(false);
      event.target.src = PLACEHOLDER_SVG;
      
      if (onError) {
        onError(event);
      }
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const imageSrc = src ? getImageUrl(src) : PLACEHOLDER_SVG;

  return (
    <div className={`relative ${className}`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded"></div>
      )}
      <img
        src={imageSrc}
        alt={alt || "Imagen del producto"}
        onError={handleImageError}
        onLoad={handleImageLoad}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
};

export default ProductImage;