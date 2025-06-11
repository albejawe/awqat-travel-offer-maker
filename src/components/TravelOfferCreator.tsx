import React, { useState } from 'react';
import { OfferForm } from './OfferForm';
import { PDFPreview } from './PDFPreview';
import { SavedOffers } from './SavedOffers';
import { CategoryManager } from './CategoryManager';
import { Auth } from './Auth';
import { OfferData } from '@/types/offer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, List, FolderOpen, Sparkles, Settings, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const TravelOfferCreator = () => {
  const {
    user,
    loading,
    signOut
  } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'saved' | 'categories'>('create');
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [offerData, setOfferData] = useState<OfferData>({
    name: '',
    destination: '',
    country: '',
    customCountry: '',
    categoryId: '',
    departureDate: '',
    departureTime: '',
    returnDate: '',
    returnTime: '',
    airline: '',
    customAirline: '',
    airport: '',
    customAirport: '',
    hotel: '',
    roomType: '',
    numberOfPeople: '',
    transportation: '',
    carType: '',
    basePrice: '',
    pricingTiers: [{
      label: 'بالغ',
      price: ''
    }],
    coverImage: null,
    galleryImages: [],
    description: '',
    travelDates: {
      start: undefined,
      end: undefined
    },
    additionalInfo: '',
    youtubeVideo: ''
  });

  const handleEditOffer = (offer: any) => {
    setOfferData({
      name: offer.name,
      destination: offer.destination || '',
      country: offer.country || '',
      customCountry: offer.custom_country || '',
      categoryId: offer.category_id || '',
      departureDate: offer.departure_date || '',
      departureTime: offer.departure_time || '',
      returnDate: offer.return_date || '',
      returnTime: offer.return_time || '',
      airline: offer.airline || '',
      customAirline: offer.custom_airline || '',
      airport: offer.airport || '',
      customAirport: offer.custom_airport || '',
      hotel: offer.hotel || '',
      roomType: offer.room_type || '',
      numberOfPeople: offer.number_of_people || '',
      transportation: offer.transportation || '',
      carType: offer.car_type || '',
      basePrice: offer.base_price || '',
      pricingTiers: offer.pricing_tiers || [{
        label: 'بالغ',
        price: ''
      }],
      coverImage: null,
      galleryImages: [],
      description: offer.description || '',
      travelDates: offer.travel_dates || {
        start: undefined,
        end: undefined
      },
      additionalInfo: offer.additional_info || '',
      youtubeVideo: offer.youtube_video || ''
    });
    setEditingOffer({
      ...offer,
      imageUrl: offer.image_url,
      galleryImages: offer.gallery_images || []
    });
    setActiveTab('create');
  };

  const handleNewOffer = () => {
    setEditingOffer(null);
    setOfferData({
      name: '',
      destination: '',
      country: '',
      customCountry: '',
      categoryId: '',
      departureDate: '',
      departureTime: '',
      returnDate: '',
      returnTime: '',
      airline: '',
      customAirline: '',
      airport: '',
      customAirport: '',
      hotel: '',
      roomType: '',
      numberOfPeople: '',
      transportation: '',
      carType: '',
      basePrice: '',
      pricingTiers: [{
        label: 'بالغ',
        price: ''
      }],
      coverImage: null,
      galleryImages: [],
      description: '',
      travelDates: {
        start: undefined,
        end: undefined
      },
      additionalInfo: '',
      youtubeVideo: ''
    });
    setActiveTab('create');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-12 bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-indigo-400 animate-pulse mx-auto"></div>
            </div>
            <p className="mt-6 text-lg font-medium text-gray-700">جارٍ تحميل المنصة...</p>
            <p className="mt-2 text-sm text-gray-500">يرجى الانتظار قليلاً</p>
          </div>
        </Card>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl mb-8 shadow-xl">
              <div className="text-4xl text-white">🔐</div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
              منشئ العروض السياحية
            </h1>
            <p className="text-xl text-gray-600 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              منصة احترافية لإنشاء عروض سياحية استثنائية بأحدث التقنيات والتصاميم
            </p>
          </div>
          <Auth onAuthChange={() => {}} />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">مرحباً بك</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={signOut}
            className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 shadow-md"
          >
            <LogOut className="w-4 h-4 mr-2" />
            تسجيل الخروج
          </Button>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <Card className="p-2 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <div className="flex rounded-lg overflow-hidden">
              <Button 
                variant={activeTab === 'create' ? 'default' : 'ghost'} 
                onClick={() => setActiveTab('create')} 
                className={`flex items-center gap-3 px-6 py-3 font-medium transition-all duration-300 ${
                  activeTab === 'create' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Plus className="w-5 h-5" />
                إنشاء عرض جديد
              </Button>
              <Button 
                variant={activeTab === 'saved' ? 'default' : 'ghost'} 
                onClick={() => setActiveTab('saved')} 
                className={`flex items-center gap-3 px-6 py-3 font-medium transition-all duration-300 ${
                  activeTab === 'saved' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <FileText className="w-5 h-5" />
                العروض المحفوظة
              </Button>
              <Button 
                variant={activeTab === 'categories' ? 'default' : 'ghost'} 
                onClick={() => setActiveTab('categories')} 
                className={`flex items-center gap-3 px-6 py-3 font-medium transition-all duration-300 ${
                  activeTab === 'categories' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Settings className="w-5 h-5" />
                إدارة الفئات
              </Button>
            </div>
          </Card>
        </div>

        {/* Enhanced Content Sections */}
        {activeTab === 'create' ? (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-8">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <span className="text-2xl text-white">📝</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">
                            {editingOffer ? 'تعديل العرض السياحي' : 'إنشاء عرض سياحي جديد'}
                          </h2>
                          <p className="text-blue-100 mt-1">املأ التفاصيل لإنشاء عرض احترافي</p>
                        </div>
                      </div>
                      {editingOffer && (
                        <Button 
                          variant="outline" 
                          onClick={handleNewOffer}
                          className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                        >
                          عرض جديد
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="p-8">
                    <OfferForm offerData={offerData} setOfferData={setOfferData} editingOffer={editingOffer} />
                  </div>
                </Card>
              </div>

              <div className="space-y-8">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl text-white">👀</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">معاينة وتصدير</h2>
                        <p className="text-green-100 mt-1">شاهد النتيجة النهائية وقم بالتصدير</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <PDFPreview offerData={offerData} editingOffer={editingOffer} onOfferSaved={() => setActiveTab('saved')} />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        ) : activeTab === 'saved' ? (
          <div className="max-w-6xl mx-auto">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <div className="p-8">
                <SavedOffers onEditOffer={handleEditOffer} user={user} />
              </div>
            </Card>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <div className="p-8">
                <CategoryManager user={user} />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
