
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface ZoomableImageGalleryProps {
  coverImage?: string;
  galleryImages?: string[];
  altText?: string;
  className?: string;
}

export const ZoomableImageGallery: React.FC<ZoomableImageGalleryProps> = ({
  coverImage,
  galleryImages = [],
  altText = "صورة العرض",
  className = ""
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const allImages = coverImage ? [coverImage, ...galleryImages] : galleryImages;

  if (allImages.length === 0) {
    return (
      <div className={`w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white ${className}`}>
        <div className="text-center">
          <div className="text-lg font-semibold">لا توجد صور</div>
        </div>
      </div>
    );
  }

  const openZoom = (index: number) => {
    setCurrentImageIndex(index);
    setIsZoomOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (allImages.length === 1) {
    return (
      <>
        <div className={`relative group cursor-pointer ${className}`}>
          <img 
            src={allImages[0]} 
            alt={altText}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            onClick={() => openZoom(0)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=400&fit=crop';
            }}
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-4 h-4" />
          </div>
        </div>
        
        <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <div className="relative">
              <img 
                src={allImages[currentImageIndex]}
                alt={`${altText} ${currentImageIndex + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 bg-white hover:bg-gray-100"
                onClick={() => setIsZoomOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Carousel className={`w-full h-48 ${className}`}>
        <CarouselContent>
          {allImages.map((imageUrl, index) => (
            <CarouselItem key={index}>
              <div className="relative group cursor-pointer">
                <img 
                  src={imageUrl} 
                  alt={`${altText} ${index + 1}`}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  onClick={() => openZoom(index)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=400&fit=crop';
                  }}
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] p-0">
          <div className="relative">
            <img 
              src={allImages[currentImageIndex]}
              alt={`${altText} ${currentImageIndex + 1}`}
              className="w-full h-auto max-h-[85vh] object-contain"
            />
            
            {/* Navigation Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {allImages.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="bg-white hover:bg-gray-100"
                onClick={() => setIsZoomOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {allImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
