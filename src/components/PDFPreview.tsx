
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Eye } from 'lucide-react';
import { OfferData } from '@/types/offer';
import { generatePDF } from '@/utils/pdfGenerator';
import { format } from 'date-fns';

interface PDFPreviewProps {
  offerData: OfferData;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ offerData }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = async () => {
    if (previewRef.current) {
      await generatePDF(previewRef.current, offerData.name || 'Travel Offer');
    }
  };

  const getImageUrl = () => {
    if (offerData.image) {
      return URL.createObjectURL(offerData.image);
    }
    return `https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=400&fit=crop`;
  };

  const formatDateRange = () => {
    if (offerData.travelDates.start && offerData.travelDates.end) {
      return `${format(offerData.travelDates.start, 'MMM dd')} - ${format(offerData.travelDates.end, 'MMM dd, yyyy')}`;
    } else if (offerData.travelDates.start) {
      return `Starting ${format(offerData.travelDates.start, 'MMM dd, yyyy')}`;
    }
    return 'Dates to be confirmed';
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={handleGeneratePDF}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          disabled={!offerData.name}
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div 
            ref={previewRef}
            className="bg-white p-8 min-h-[600px]"
            style={{ width: '794px', margin: '0 auto', transform: 'scale(0.6)', transformOrigin: 'top left' }}
          >
            {/* PDF Content Preview */}
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {offerData.name || 'Your Travel Offer'}
                </h1>
                {offerData.destination && (
                  <p className="text-lg text-blue-600 font-semibold">
                    {offerData.destination}
                  </p>
                )}
              </div>

              {/* Image */}
              <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={getImageUrl()}
                  alt="Travel destination"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Travel Dates */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Travel Dates</h3>
                <p className="text-gray-700">{formatDateRange()}</p>
              </div>

              {/* Pricing */}
              {(offerData.basePrice || offerData.pricingTiers.some(tier => tier.price)) && (
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Pricing</h3>
                  {offerData.basePrice && (
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-amber-600">
                        {offerData.basePrice}
                      </span>
                    </div>
                  )}
                  {offerData.pricingTiers.some(tier => tier.price) && (
                    <div className="grid grid-cols-2 gap-2">
                      {offerData.pricingTiers
                        .filter(tier => tier.label && tier.price)
                        .map((tier, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="font-medium">{tier.label}:</span>
                            <span className="font-bold text-amber-600">{tier.price}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {offerData.description && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Description</h3>
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {offerData.description}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              {offerData.additionalInfo && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Additional Information</h3>
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {offerData.additionalInfo}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="border-t pt-6 mt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">Awqat Travel</h3>
                    <p className="text-gray-600">Contact: 22289080</p>
                  </div>
                  <div className="w-24 h-12 bg-gray-100 rounded flex items-center justify-center">
                    <img
                      src="https://awqattravel.com/logo.png"
                      alt="Awqat Travel Logo"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
