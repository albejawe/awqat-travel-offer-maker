
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface ImageGalleryProps {
  coverImage?: string;
  galleryImages?: string[];
  altText?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  coverImage,
  galleryImages = [],
  altText = "صورة العرض"
}) => {
  const allImages = coverImage ? [coverImage, ...galleryImages] : galleryImages;

  if (allImages.length === 0) {
    return (
      <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-lg font-semibold">لا توجد صور</div>
        </div>
      </div>
    );
  }

  if (allImages.length === 1) {
    return (
      <img 
        src={allImages[0]} 
        alt={altText}
        className="w-full h-48 object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=400&fit=crop';
        }}
      />
    );
  }

  return (
    <Carousel className="w-full h-48">
      <CarouselContent>
        {allImages.map((imageUrl, index) => (
          <CarouselItem key={index}>
            <img 
              src={imageUrl} 
              alt={`${altText} ${index + 1}`}
              className="w-full h-48 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=400&fit=crop';
              }}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};
