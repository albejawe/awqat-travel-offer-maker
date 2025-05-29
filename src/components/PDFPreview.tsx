
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
          <div className="overflow-hidden">
            <div 
              ref={previewRef}
              className="bg-white p-8 min-h-[600px] mx-auto"
              style={{ 
                width: '794px', 
                transform: 'scale(0.7)', 
                transformOrigin: 'top center',
                marginBottom: '-200px' // Adjust for scaling
              }}
            >
              {/* PDF Content Preview */}
              <div className="space-y-8">
                {/* Header with Company Logo */}
                <div className="flex items-center justify-between border-b-2 border-blue-600 pb-6">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                      {offerData.name || 'Your Travel Offer'}
                    </h1>
                    {offerData.destination && (
                      <p className="text-xl text-blue-600 font-semibold">
                        📍 {offerData.destination}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-center ml-6">
                    <img
                      src="/lovable-uploads/a301b0cc-0db5-40a4-9c35-c8003adb6c82.png"
                      alt="Company Logo"
                      className="w-24 h-24 object-contain mb-2"
                    />
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-blue-600">Awqat Travel</h3>
                      <p className="text-gray-600 font-medium">للسياحة والسفر</p>
                    </div>
                  </div>
                </div>

                {/* Main Image */}
                <div className="w-full h-72 rounded-xl overflow-hidden shadow-lg bg-gray-100">
                  <img
                    src={getImageUrl()}
                    alt="Travel destination"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Travel Dates and Pricing Section */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Travel Dates */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">📅</span>
                      </div>
                      <h3 className="font-bold text-xl text-blue-800">Travel Dates</h3>
                    </div>
                    <p className="text-lg font-semibold text-blue-700">{formatDateRange()}</p>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-xl border border-amber-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">💰</span>
                      </div>
                      <h3 className="font-bold text-xl text-amber-800">Pricing</h3>
                    </div>
                    
                    {offerData.basePrice && (
                      <div className="mb-4 p-3 bg-white rounded-lg border-l-4 border-amber-600">
                        <p className="text-sm text-gray-600 mb-1">Starting from</p>
                        <span className="text-3xl font-bold text-amber-700">
                          {offerData.basePrice}
                        </span>
                      </div>
                    )}
                    
                    {offerData.pricingTiers.some(tier => tier.price) && (
                      <div className="space-y-2">
                        {offerData.pricingTiers
                          .filter(tier => tier.label && tier.price)
                          .map((tier, index) => (
                            <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                              <span className="font-semibold text-gray-700">{tier.label}</span>
                              <span className="font-bold text-xl text-amber-700">{tier.price}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {offerData.description && (
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">📝</span>
                      </div>
                      <h3 className="font-bold text-xl text-gray-800">Package Details</h3>
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
                      {offerData.description}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                {offerData.additionalInfo && (
                  <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">ℹ️</span>
                      </div>
                      <h3 className="font-bold text-xl text-red-800">Important Information</h3>
                    </div>
                    <div className="text-red-700 whitespace-pre-wrap leading-relaxed text-base">
                      {offerData.additionalInfo}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t-2 border-blue-600 pt-6 mt-8">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-2xl mb-2">Ready to Book?</h3>
                        <p className="text-blue-100 text-lg">Contact us for more information and reservations</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold mb-1">📞 22289080</p>
                        <p className="text-blue-100">Available 24/7</p>
                      </div>
                    </div>
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
