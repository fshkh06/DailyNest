import React, { useState } from 'react';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState<string>(images[0] || '');

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[500px] no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-neutral-50 ${
                selectedImage === img
                  ? 'border-[#0F3427] shadow-md scale-102'
                  : 'border-transparent hover:border-slate-300 opacity-70 hover:opacity-100'
              }`}
            >
              <ImageWithFallback
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Large Image */}
      <div className="flex-1 rounded-3xl overflow-hidden bg-neutral-50/80 border border-emerald-950/5 shadow-subtle aspect-square relative group">
        <ImageWithFallback
          src={selectedImage || images[0]}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out cursor-zoom-in"
        />
      </div>
    </div>
  );
};
