
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LogIn, MapPin, Calendar, Users, Plane, Car, Hotel, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Offer {
  id: string;
  name: string;
  destination: string;
  country: string;
  custom_country: string;
  departure_date: string;
  departure_time: string;
  return_date: string;
  return_time: string;
  airline: string;
  custom_airline: string;
  airport: string;
  custom_airport: string;
  hotel: string;
  room_type: string;
  number_of_people: string;
  transportation: string;
  car_type: string;
  base_price: string;
  pricing_tiers: any;
  image_url: string;
  description: string;
  additional_info: string;
}

export const PublicOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const navigate = useNavigate();

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

  const handleBooking = (offer: Offer) => {
    const whatsappNumber = "+96522227779";
    const message = `مرحباً، أريد حجز العرض السياحي: ${offer.name} - ${offer.destination}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">جارٍ تحميل العروض...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/a301b0cc-0db5-40a4-9c35-c8003adb6c82.png" 
                alt="شعار الشركة" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-blue-600">شركة أوقات للسياحة والسفر</h1>
                <p className="text-sm text-gray-600">حولي - شارع تونس - بناية هيا</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              تسجيل الدخول
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">العروض السياحية المتاحة</h2>
          <p className="text-lg text-gray-600">اكتشف أفضل الوجهات السياحية بأسعار مميزة</p>
        </div>

        {offers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">لا توجد عروض متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {offer.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={offer.image_url} 
                      alt={offer.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=400&fit=crop';
                      }}
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-right text-xl text-blue-700">{offer.name}</CardTitle>
                  <div className="flex items-center justify-end gap-2 text-gray-600">
                    <span>{offer.destination}</span>
                    <MapPin className="w-4 h-4" />
                  </div>
                  {offer.base_price && (
                    <div className="text-2xl font-bold text-green-600 text-right">
                      {offer.base_price} د.ك
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {offer.departure_date && (
                      <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                        <span>تاريخ المغادرة: {offer.departure_date}</span>
                        <Calendar className="w-4 h-4" />
                      </div>
                    )}
                    {offer.number_of_people && (
                      <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                        <span>{offer.number_of_people} أشخاص</span>
                        <Users className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setSelectedOffer(offer)}
                        >
                          عرض التفاصيل
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                        <DialogHeader className="text-right">
                          <DialogTitle className="text-right text-2xl text-blue-700">
                            {selectedOffer?.name}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedOffer && (
                          <div className="space-y-6 text-right" dir="rtl">
                            {selectedOffer.image_url && (
                              <img 
                                src={selectedOffer.image_url} 
                                alt={selectedOffer.name}
                                className="w-full h-64 object-cover rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=400&fit=crop';
                                }}
                              />
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
                              <div className="space-y-4 text-right" dir="rtl">
                                <h3 className="font-semibold text-lg text-gray-800 text-right">تفاصيل الرحلة</h3>
                                {selectedOffer.destination && (
                                  <div className="flex items-center justify-end gap-2 text-right" dir="rtl">
                                    <span className="text-right">{selectedOffer.destination}</span>
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                  </div>
                                )}
                                {selectedOffer.departure_date && (
                                  <div className="flex items-center justify-end gap-2 text-right" dir="rtl">
                                    <span className="text-right">المغادرة: {selectedOffer.departure_date} {selectedOffer.departure_time}</span>
                                    <Calendar className="w-4 h-4 text-green-500" />
                                  </div>
                                )}
                                {selectedOffer.return_date && (
                                  <div className="flex items-center justify-end gap-2 text-right" dir="rtl">
                                    <span className="text-right">العودة: {selectedOffer.return_date} {selectedOffer.return_time}</span>
                                    <Calendar className="w-4 h-4 text-red-500" />
                                  </div>
                                )}
                                {selectedOffer.number_of_people && (
                                  <div className="flex items-center justify-end gap-2 text-right" dir="rtl">
                                    <span className="text-right">عدد الأشخاص: {selectedOffer.number_of_people}</span>
                                    <Users className="w-4 h-4 text-purple-500" />
                                  </div>
                                )}
                              </div>

                              <div className="space-y-4 text-right" dir="rtl">
                                <h3 className="font-semibold text-lg text-gray-800 text-right">خدمات الرحلة</h3>
                                {(selectedOffer.airline || selectedOffer.custom_airline) && (
                                  <div className="flex items-center justify-end gap-2 text-right" dir="rtl">
                                    <span className="text-right">الطيران: {selectedOffer.custom_airline || selectedOffer.airline}</span>
                                    <Plane className="w-4 h-4 text-blue-500" />
                                  </div>
                                )}
                                {selectedOffer.hotel && (
                                  <div className="flex items-center justify-end gap-2 text-right" dir="rtl">
                                    <span className="text-right">الفندق: {selectedOffer.hotel}</span>
                                    <Hotel className="w-4 h-4 text-orange-500" />
                                  </div>
                                )}
                                {selectedOffer.transportation && (
                                  <div className="flex items-center justify-end gap-2 text-right" dir="rtl">
                                    <span className="text-right">المواصلات: {selectedOffer.transportation}</span>
                                    <Car className="w-4 h-4 text-green-500" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {selectedOffer.description && (
                              <div dir="rtl" className="text-right">
                                <h3 className="font-semibold text-lg text-gray-800 mb-3 text-right">التفاصيل</h3>
                                <div 
                                  className="text-gray-600 leading-relaxed whitespace-pre-wrap text-right"
                                  style={{ 
                                    fontFamily: 'Cairo, Arial, sans-serif', 
                                    direction: 'rtl', 
                                    textAlign: 'right',
                                    unicodeBidi: 'plaintext'
                                  }}
                                >
                                  {selectedOffer.description}
                                </div>
                              </div>
                            )}

                            {selectedOffer.pricing_tiers && selectedOffer.pricing_tiers.length > 0 && (
                              <div dir="rtl" className="text-right">
                                <h3 className="font-semibold text-lg text-gray-800 mb-3 text-right">الأسعار</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {selectedOffer.pricing_tiers.map((tier: any, index: number) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                      <div className="flex justify-between items-center text-right" dir="rtl">
                                        <span className="font-semibold text-green-600 text-right">{tier.price} د.ك</span>
                                        <span className="text-gray-700 text-right">{tier.label}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {selectedOffer.additional_info && (
                              <div dir="rtl" className="text-right">
                                <h3 className="font-semibold text-lg text-gray-800 mb-3 text-right">معلومات إضافية</h3>
                                <div 
                                  className="text-gray-600 whitespace-pre-wrap text-right"
                                  style={{ 
                                    fontFamily: 'Cairo, Arial, sans-serif', 
                                    direction: 'rtl', 
                                    textAlign: 'right',
                                    unicodeBidi: 'plaintext'
                                  }}
                                >
                                  {selectedOffer.additional_info}
                                </div>
                              </div>
                            )}

                            <Button 
                              onClick={() => handleBooking(selectedOffer)}
                              className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
                              size="lg"
                            >
                              <MessageCircle className="w-5 h-5" />
                              احجز الآن عبر الواتساب
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      onClick={() => handleBooking(offer)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      احجز الآن
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <img 
              src="/lovable-uploads/a301b0cc-0db5-40a4-9c35-c8003adb6c82.png" 
              alt="شعار الشركة" 
              className="w-16 h-16 object-contain"
            />
            <div>
              <h3 className="text-xl font-bold">شركة أوقات للسياحة والسفر</h3>
              <p className="text-gray-300">حولي - شارع تونس - بناية هيا</p>
            </div>
          </div>
          <div className="space-y-2 text-gray-300">
            <p>هاتف: +965 2222 7779</p>
            <p>واتساب: +965 2222 7779</p>
            <p>© 2024 شركة أوقات للسياحة والسفر. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicOffers;
