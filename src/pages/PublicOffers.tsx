import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Calendar, Users, Car, Plane, Building, Youtube, MessageCircle, Phone, Mail, Play, Download, ArrowLeft } from 'lucide-react';
import { extractYouTubeVideoId } from '@/utils/youtubeUtils';
import { ImageGallery } from '@/components/ImageGallery';
import { generatePDF } from '@/utils/pdfGenerator';

const PublicOffers = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffersByCategory = async (categoryId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('travel_offers')
        .select('*')
        .eq('category_id', categoryId)
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

  const formatPrice = (price: string) => {
    if (!price) return '';
    // Remove existing currency symbols and add KWD in Arabic
    const cleanPrice = price.replace(/ريال|د\.ك|KWD|SAR/gi, '').trim();
    return `${cleanPrice} د.ك`;
  };

  const handleDownloadPDF = async (offer: any) => {
    // Create a temporary container for PDF generation
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '794px';
    tempContainer.style.fontFamily = 'Cairo, sans-serif';
    tempContainer.style.direction = 'rtl';
    
    // Create PDF content similar to PDFPreview component
    tempContainer.innerHTML = `
      <div style="background: white; padding: 32px; min-height: 600px; font-family: Cairo, sans-serif; direction: rtl;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 24px; margin-bottom: 24px;">
          <div style="flex: 1;">
            <h1 style="font-size: 32px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${offer.name || 'عرض سياحي'}</h1>
            ${(offer.destination || offer.country || offer.custom_country) ? `
              <p style="font-size: 18px; color: #2563eb; font-weight: 600;">
                📍 ${offer.destination || ''}${(offer.country || offer.custom_country) ? `, ${offer.country || offer.custom_country}` : ''}
              </p>
            ` : ''}
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; margin-left: 24px;">
            <img src="/lovable-uploads/a301b0cc-0db5-40a4-9c35-c8003adb6c82.png" alt="Company Logo" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 8px;" />
            <div style="text-align: center;">
              <h3 style="font-weight: bold; font-size: 18px; color: #2563eb; margin: 0;">شركة أوقات للسياحة والسفر</h3>
              <p style="color: #6b7280; font-weight: 500; font-size: 14px; margin: 0;">حولي - شارع تونس - بناية هيا</p>
            </div>
          </div>
        </div>
        
        ${offer.image_url ? `
          <div style="width: 100%; height: 256px; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); background: #f3f4f6; margin-bottom: 24px;">
            <img src="${offer.image_url}" alt="Travel destination" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
        ` : ''}

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
          <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 20px; border-radius: 12px; border: 1px solid #93c5fd;">
            <h3 style="font-weight: bold; font-size: 18px; color: #1e40af; margin-bottom: 12px;">✈️ معلومات الطيران</h3>
            <div style="font-size: 14px;">
              ${offer.departure_date ? `<p><span style="font-weight: 600;">تاريخ الذهاب:</span> ${offer.departure_date}</p>` : ''}
              ${offer.return_date ? `<p><span style="font-weight: 600;">تاريخ العودة:</span> ${offer.return_date}</p>` : ''}
              ${(offer.airline || offer.custom_airline) ? `<p><span style="font-weight: 600;">الطيران:</span> ${offer.custom_airline || offer.airline}</p>` : ''}
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 20px; border-radius: 12px; border: 1px solid #86efac;">
            <h3 style="font-weight: bold; font-size: 18px; color: #166534; margin-bottom: 12px;">🏨 معلومات الإقامة</h3>
            <div style="font-size: 14px;">
              ${offer.hotel ? `<p><span style="font-weight: 600;">الفندق:</span> ${offer.hotel}</p>` : ''}
              ${offer.room_type ? `<p><span style="font-weight: 600;">نوع الغرفة:</span> ${offer.room_type}</p>` : ''}
              ${offer.number_of_people ? `<p><span style="font-weight: 600;">عدد الأشخاص:</span> ${offer.number_of_people}</p>` : ''}
            </div>
          </div>
        </div>

        ${(offer.base_price || (offer.pricing_tiers && offer.pricing_tiers.length > 0)) ? `
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 24px; border-radius: 12px; border: 1px solid #f59e0b; margin-bottom: 24px;">
            <h3 style="font-weight: bold; font-size: 20px; color: #92400e; margin-bottom: 16px;">💰 الأسعار</h3>
            ${offer.base_price ? `
              <div style="margin-bottom: 16px; padding: 16px; background: white; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">يبدأ من</p>
                <span style="font-size: 24px; font-weight: bold; color: #92400e;">${formatPrice(offer.base_price)}</span>
              </div>
            ` : ''}
            ${offer.pricing_tiers && offer.pricing_tiers.length > 0 ? offer.pricing_tiers
              .filter(tier => tier.label && tier.price)
              .map(tier => `
                <div style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; margin-bottom: 12px;">
                  <span style="font-weight: 600; color: #374151; font-size: 16px;">${tier.label}</span>
                  <span style="font-weight: bold; font-size: 18px; color: #92400e;">${formatPrice(tier.price)}</span>
                </div>
              `).join('') : ''}
          </div>
        ` : ''}

        ${offer.description ? `
          <div style="background: #f9fafb; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 24px;">
            <h3 style="font-weight: bold; font-size: 20px; color: #374141; margin-bottom: 16px;">📝 تفاصيل العرض</h3>
            <div style="color: #374151; white-space: pre-wrap; line-height: 1.6; font-size: 16px;">${offer.description}</div>
          </div>
        ` : ''}

        <div style="border-top: 2px solid #2563eb; padding-top: 24px; margin-top: 32px;">
          <div style="background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%); color: white; padding: 24px; border-radius: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <h3 style="font-weight: bold; font-size: 24px; margin-bottom: 8px;">جاهز للحجز؟</h3>
                <p style="color: #dbeafe; font-size: 18px;">تواصل معنا للمزيد من المعلومات والحجوزات</p>
              </div>
              <div style="text-align: right;">
                <p style="font-size: 24px; font-weight: bold; margin-bottom: 4px;">📞 22289080</p>
                <p style="color: #dbeafe;">متاح 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(tempContainer);
    
    try {
      await generatePDF(tempContainer, offer.name || 'travel-offer');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('حدث خطأ في تحميل الملف');
    } finally {
      document.body.removeChild(tempContainer);
    }
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

  // Show categories view
  if (!selectedCategory) {
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

        {/* Categories Grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">اختر وجهتك المفضلة</h2>
            <p className="text-lg text-gray-600">استكشف عروضنا المميزة حسب الوجهة</p>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">لا توجد فئات متاحة حالياً</h2>
                <p className="text-gray-600">تابعونا قريباً للحصول على أفضل العروض السياحية</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card 
                  key={category.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0 shadow-lg cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(category);
                    fetchOffersByCategory(category.id);
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    {category.image_url ? (
                      <img 
                        src={category.image_url} 
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🌍</div>
                          <div className="text-lg font-semibold">{category.name}</div>
                        </div>
                      </div>
                    )}
                    
                    {category.min_price && (
                      <div className="absolute bottom-3 left-3 bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg">
                        <span className="font-bold text-lg">يبدأ من {formatPrice(category.min_price)}</span>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-medium">عرض العروض</span>
                      <ArrowLeft className="w-5 h-5 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
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
  }

  // Show offers for selected category
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للفئات
            </Button>
            <div className="flex justify-center items-center">
              <img
                src="/lovable-uploads/a301b0cc-0db5-40a4-9c35-c8003adb6c82.png"
                alt="شركة أوقات للسياحة والسفر"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div></div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              عروض {selectedCategory.name}
            </h1>
            {selectedCategory.description && (
              <p className="text-lg text-gray-600 mb-4">
                {selectedCategory.description}
              </p>
            )}
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">لا توجد عروض متاحة في هذه الفئة حالياً</h2>
              <p className="text-gray-600">تابعونا قريباً للحصول على أفضل العروض السياحية</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => {
              const videoId = offer.youtube_video ? extractYouTubeVideoId(offer.youtube_video) : null;
              const galleryImages = offer.gallery_images || [];

              return (
                <Card key={offer.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0 shadow-lg">
                  {/* Image/Video Section */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageGallery 
                      coverImage={offer.image_url}
                      galleryImages={galleryImages}
                      altText={offer.name}
                    />
                    
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
                        <span className="font-bold text-lg">{formatPrice(offer.base_price)}</span>
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
                              <span className="font-bold text-amber-600">{formatPrice(tier.price)}</span>
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
                              <div className="flex items-center justify-between">
                                <DialogTitle className="text-2xl font-bold text-right">
                                  {selectedOffer?.name}
                                </DialogTitle>
                                <Button
                                  onClick={() => handleDownloadPDF(selectedOffer)}
                                  className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
                                  size="sm"
                                >
                                  <Download className="w-4 h-4" />
                                  تحميل PDF
                                </Button>
                              </div>
                            </DialogHeader>
                            {selectedOffer && (
                              <div className="space-y-6" dir="rtl">
                                {/* Image Gallery */}
                                <div className="h-96">
                                  <ImageGallery 
                                    coverImage={selectedOffer.image_url}
                                    galleryImages={selectedOffer.gallery_images || []}
                                    altText={selectedOffer.name}
                                  />
                                </div>

                                {/* Video */}
                                {selectedOffer.youtube_video && extractYouTubeVideoId(selectedOffer.youtube_video) && (
                                  <div>
                                    <h3 className="font-semibold text-lg text-gray-800 mb-3 text-right flex items-center justify-end gap-2">
                                      <Youtube className="w-5 h-5 text-red-500" />
                                      فيديو العرض
                                    </h3>
                                    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                                      <iframe
                                        src={`https://www.youtube.com/embed/${extractYouTubeVideoId(selectedOffer.youtube_video)}?rel=0&modestbranding=1`}
                                        className="w-full h-full"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        title="فيديو العرض"
                                        frameBorder="0"
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
                                          {formatPrice(selectedOffer.base_price)}
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
                                              <span className="font-bold text-xl text-amber-700">{formatPrice(tier.price)}</span>
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
                          onClick={() => handleDownloadPDF(offer)}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-4"
                        >
                          <Download className="w-4 h-4" />
                        </Button>

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

export default PublicOffers;