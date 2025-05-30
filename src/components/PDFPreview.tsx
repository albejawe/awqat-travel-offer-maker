
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';
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

  const getCountryDisplay = () => {
    return offerData.customCountry || offerData.country || '';
  };

  const getAirlineDisplay = () => {
    return offerData.customAirline || offerData.airline || '';
  };

  const getAirportDisplay = () => {
    return offerData.customAirport || offerData.airport || '';
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
          تحميل PDF
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <div 
              ref={previewRef}
              className="bg-white p-8 min-h-[600px] mx-auto"
              style={{ 
                width: '210mm', 
                fontFamily: 'Cairo, sans-serif',
                direction: 'rtl'
              }}
            >
              {/* PDF Content Preview */}
              <div className="space-y-6">
                {/* Header with Company Logo */}
                <div className="flex items-center justify-between border-b-2 border-blue-600 pb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      {offerData.name || 'عرض سياحي'}
                    </h1>
                    {(offerData.destination || getCountryDisplay()) && (
                      <p className="text-lg text-blue-600 font-semibold">
                        📍 {offerData.destination}{getCountryDisplay() && `, ${getCountryDisplay()}`}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-center ml-6">
                    <img
                      src="/lovable-uploads/a301b0cc-0db5-40a4-9c35-c8003adb6c82.png"
                      alt="Company Logo"
                      className="w-20 h-20 object-contain mb-2"
                    />
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-blue-600">شركة أوقات للسياحة والسفر</h3>
                      <p className="text-gray-600 font-medium text-sm">حولي - شارع تونس - بناية هيا</p>
                    </div>
                  </div>
                </div>

                {/* Main Image */}
                <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg bg-gray-100">
                  <img
                    src={getImageUrl()}
                    alt="Travel destination"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Flight and Hotel Information */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Flight Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">✈️</span>
                      </div>
                      <h3 className="font-bold text-lg text-blue-800">معلومات الطيران</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      {(offerData.departureDate || offerData.departureTime) && (
                        <p>
                          <span className="font-semibold">إقلاع الذهاب:</span> 
                          {offerData.departureDate && ` ${offerData.departureDate}`}
                          {offerData.departureTime && ` - ${offerData.departureTime}`}
                        </p>
                      )}
                      {(offerData.returnDate || offerData.returnTime) && (
                        <p>
                          <span className="font-semibold">إقلاع العودة:</span> 
                          {offerData.returnDate && ` ${offerData.returnDate}`}
                          {offerData.returnTime && ` - ${offerData.returnTime}`}
                        </p>
                      )}
                      {getAirlineDisplay() && (
                        <p><span className="font-semibold">الطيران:</span> {getAirlineDisplay()}</p>
                      )}
                      {getAirportDisplay() && (
                        <p><span className="font-semibold">المطار:</span> {getAirportDisplay()}</p>
                      )}
                    </div>
                  </div>

                  {/* Hotel Info */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">🏨</span>
                      </div>
                      <h3 className="font-bold text-lg text-green-800">معلومات الإقامة</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      {offerData.hotel && (
                        <p><span className="font-semibold">الفندق:</span> {offerData.hotel}</p>
                      )}
                      {offerData.roomType && (
                        <p><span className="font-semibold">نوع الغرفة:</span> {offerData.roomType}</p>
                      )}
                      {offerData.numberOfPeople && (
                        <p><span className="font-semibold">عدد الأشخاص:</span> {offerData.numberOfPeople}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Transportation */}
                {(offerData.transportation || offerData.carType) && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">🚗</span>
                      </div>
                      <h3 className="font-bold text-lg text-purple-800">التوصيل</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      {offerData.transportation && (
                        <p><span className="font-semibold">التوصيل:</span> {offerData.transportation}</p>
                      )}
                      {offerData.carType && (
                        <p><span className="font-semibold">نوع السيارة:</span> {offerData.carType}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Pricing Section */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-xl border border-amber-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm">💰</span>
                    </div>
                    <h3 className="font-bold text-xl text-amber-800">الأسعار</h3>
                  </div>
                  
                  {offerData.basePrice && (
                    <div className="mb-4 p-4 bg-white rounded-lg border-l-4 border-amber-600">
                      <p className="text-sm text-gray-600 mb-1">يبدأ من</p>
                      <span className="text-2xl font-bold text-amber-700">
                        {offerData.basePrice}
                      </span>
                    </div>
                  )}
                  
                  {offerData.pricingTiers.some(tier => tier.price) && (
                    <div className="grid grid-cols-1 gap-3">
                      {offerData.pricingTiers
                        .filter(tier => tier.label && tier.price)
                        .map((tier, index) => (
                          <div key={index} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
                            <span className="font-semibold text-gray-700 text-lg">{tier.label}</span>
                            <span className="font-bold text-xl text-amber-700">{tier.price}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                {offerData.description && (
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">📝</span>
                      </div>
                      <h3 className="font-bold text-xl text-gray-800">تفاصيل العرض</h3>
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
                      <h3 className="font-bold text-xl text-red-800">معلومات مهمة</h3>
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
                        <h3 className="font-bold text-2xl mb-2">جاهز للحجز؟</h3>
                        <p className="text-blue-100 text-lg">تواصل معنا للمزيد من المعلومات والحجوزات</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold mb-1">📞 22289080</p>
                        <p className="text-blue-100">متاح 24/7</p>
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
