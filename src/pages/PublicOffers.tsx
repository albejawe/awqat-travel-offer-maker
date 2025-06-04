
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Calendar, Users, Car, Plane, Building, Youtube, MessageCircle, Phone, Mail } from 'lucide-react';
import { extractYouTubeVideoId } from '@/utils/youtubeUtils';

export const PublicOffers = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatWhatsAppMessage = (offer: any) => {
    const message = `مرحباً، أود الاستفسار عن العرض السياحي: ${offer.name}
الوجهة: ${offer.destination || ''} ${offer.country || offer.custom_country || ''}
السعر: ${offer.base_price || 'حسب العرض'}

يرجى إرسال المزيد من التفاصيل والتوفر.
شكراً لكم`;
    
    return `https://wa.me/96522289080?text=${encodeURIComponent(message)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">جارٍ تحميل العروض...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <img
                src="/lovable-uploads/a301b0cc-0db5-40a4-9c35-c8003adb6c82.png"
                alt="شركة أوقات للسياحة والسفر"
                className="w-20 h-20 object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              شركة أوقات للسياحة والسفر
            </h1>
            <p className="text-xl text-blue-600 mb-4">
              اكتشف العالم معنا - عروض سياحية مميزة
            </p>
            <div className="flex justify-center items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>22289080</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>حولي - شارع تونس - بناية هيا</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="container mx-auto px-4 py-8">
        {offers.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">لا توجد عروض متاحة حالياً</h2>
              <p className="text-gray-600">تابعونا قريباً للحصول على أفضل العروض السياحية</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => {
              const videoId = offer.youtube_video ? extractYouTubeVideoId(offer.youtube_video) : null;
              const getImageUrl = () => {
                if (offer.image_url) {
                  return offer.image_url;
                }
                return `https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=400&fit=crop`;
              };

              return (
                <Card key={offer.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0 shadow-lg">
                  {/* Image/Video Section */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                    {offer.image_url ? (
                      <img 
                        src={getImageUrl()} 
                        alt={offer.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=400&fit=crop';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <div className="text-center">
                          <MapPin className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-lg font-semibold">{offer.destination}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Video Badge */}
                    {videoId && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Youtube className="w-4 h-4" />
                        <span className="text-sm font-medium">فيديو</span>
                      </div>
                    )}

                    {/* Price Badge */}
                    {offer.base_price && (
                      <div className="absolute bottom-3 left-3 bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg">
                        <span className="font-bold text-lg">{offer.base_price}</span>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Title and Location */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                          {offer.name}
                        </h3>
                        <div className="flex items-center text-blue-600 mb-3">
                          <MapPin className="w-4 h-4 ml-1" />
                          <span className="font-medium">
                            {offer.destination} {offer.country || offer.custom_country}
                          </span>
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {(offer.departure_date || offer.return_date) && (
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 ml-1" />
                            <span>{offer.departure_date || 'تاريخ مرن'}</span>
                          </div>
                        )}
                        
                        {offer.number_of_people && (
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 ml-1" />
                            <span>{offer.number_of_people} أشخاص</span>
                          </div>
                        )}

                        {(offer.airline || offer.custom_airline) && (
                          <div className="flex items-center text-gray-600">
                            <Plane className="w-4 h-4 ml-1" />
                            <span className="truncate">{offer.custom_airline || offer.airline}</span>
                          </div>
                        )}

                        {offer.hotel && (
                          <div className="flex items-center text-gray-600">
                            <Building className="w-4 h-4 ml-1" />
                            <span className="truncate">{offer.hotel}</span>
                          </div>
                        )}
                      </div>

                      {/* Pricing Tiers */}
                      {offer.pricing_tiers && offer.pricing_tiers.length > 0 && (
                        <div className="space-y-2">
                          {offer.pricing_tiers
                            .filter(tier => tier.label && tier.price)
                            .slice(0, 2)
                            .map((tier, index) => (
                            <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded-lg">
                              <span className="font-medium text-gray-700">{tier.label}</span>
                              <span className="font-bold text-amber-600">{tier.price}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                              onClick={() => setSelectedOffer(offer)}
                            >
                              عرض التفاصيل
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-right">
                                {selectedOffer?.name}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedOffer && (
                              <div className="space-y-6" dir="rtl">
                                {/* Image */}
                                {selectedOffer.image_url && (
                                  <div>
                                    <img 
                                      src={selectedOffer.image_url} 
                                      alt={selectedOffer.name}
                                      className="w-full h-64 object-cover rounded-lg shadow-lg"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=400&fit=crop';
                                      }}
                                    />
                                  </div>
                                )}

                                {/* Video */}
                                {selectedOffer.youtube_video && extractYouTubeVideoId(selectedOffer.youtube_video) && (
                                  <div>
                                    <h3 className="font-semibold text-lg text-gray-800 mb-3 text-right flex items-center justify-end gap-2">
                                      <Youtube className="w-5 h-5 text-red-500" />
                                      فيديو العرض
                                    </h3>
                                    <div className="w-full aspect-video">
                                      <iframe
                                        src={`https://www.youtube.com/embed/${extractYouTubeVideoId(selectedOffer.youtube_video)}`}
                                        className="w-full h-full rounded-lg"
                                        allowFullScreen
                                        title="فيديو العرض"
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Flight Info */}
                                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                      <Plane className="w-5 h-5" />
                                      معلومات الطيران
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      {selectedOffer.departure_date && (
                                        <p><strong>تاريخ الذهاب:</strong> {selectedOffer.departure_date}</p>
                                      )}
                                      {selectedOffer.return_date && (
                                        <p><strong>تاريخ العودة:</strong> {selectedOffer.return_date}</p>
                                      )}
                                      {(selectedOffer.airline || selectedOffer.custom_airline) && (
                                        <p><strong>شركة الطيران:</strong> {selectedOffer.custom_airline || selectedOffer.airline}</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Hotel Info */}
                                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                                      <Building className="w-5 h-5" />
                                      معلومات الإقامة
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      {selectedOffer.hotel && (
                                        <p><strong>الفندق:</strong> {selectedOffer.hotel}</p>
                                      )}
                                      {selectedOffer.room_type && (
                                        <p><strong>نوع الغرفة:</strong> {selectedOffer.room_type}</p>
                                      )}
                                      {selectedOffer.number_of_people && (
                                        <p><strong>عدد الأشخاص:</strong> {selectedOffer.number_of_people}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Pricing */}
                                {(selectedOffer.base_price || (selectedOffer.pricing_tiers && selectedOffer.pricing_tiers.length > 0)) && (
                                  <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                                    <h4 className="font-semibold text-amber-800 mb-4 text-xl flex items-center gap-2">
                                      💰 الأسعار
                                    </h4>
                                    
                                    {selectedOffer.base_price && (
                                      <div className="mb-4 p-4 bg-white rounded-lg border-l-4 border-amber-600">
                                        <p className="text-sm text-gray-600 mb-1">يبدأ من</p>
                                        <span className="text-2xl font-bold text-amber-700">
                                          {selectedOffer.base_price}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {selectedOffer.pricing_tiers && selectedOffer.pricing_tiers.length > 0 && (
                                      <div className="grid grid-cols-1 gap-3">
                                        {selectedOffer.pricing_tiers
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
                                )}

                                {/* Description */}
                                {selectedOffer.description && (
                                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                    <h4 className="font-semibold text-gray-800 mb-4 text-xl">📝 تفاصيل العرض</h4>
                                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                      {selectedOffer.description}
                                    </div>
                                  </div>
                                )}

                                {/* WhatsApp Button */}
                                <div className="bg-green-600 text-white p-6 rounded-lg text-center">
                                  <h4 className="font-bold text-xl mb-4">📞 احجز الآن أو استفسر</h4>
                                  <Button
                                    asChild
                                    className="bg-white text-green-600 hover:bg-gray-100 font-bold text-lg px-8 py-3"
                                  >
                                    <a
                                      href={formatWhatsAppMessage(selectedOffer)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2"
                                    >
                                      <MessageCircle className="w-5 h-5" />
                                      تواصل عبر الواتساب
                                    </a>
                                  </Button>
                                  <p className="text-green-100 mt-2">22289080</p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          asChild
                          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4"
                        >
                          <a
                            href={formatWhatsAppMessage(offer)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <MessageCircle className="w-4 h-4" />
                            واتساب
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <img
              src="/lovable-uploads/a301b0cc-0db5-40a4-9c35-c8003adb6c82.png"
              alt="شركة أوقات للسياحة والسفر"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h3 className="text-xl font-bold mb-2">شركة أوقات للسياحة والسفر</h3>
          <p className="text-gray-300 mb-4">رحلات مميزة وذكريات لا تُنسى</p>
          <div className="flex justify-center items-center gap-8 text-gray-300">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>22289080</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>حولي - شارع تونس - بناية هيا</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
