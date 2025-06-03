
import React, { useState } from 'react';
import { OfferForm } from './OfferForm';
import { PDFPreview } from './PDFPreview';
import { SavedOffers } from './SavedOffers';
import { Auth } from './Auth';
import { OfferData } from '@/types/offer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, List } from 'lucide-react';

export const TravelOfferCreator = () => {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [offerData, setOfferData] = useState<OfferData>({
    name: '',
    destination: '',
    country: '',
    customCountry: '',
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
    pricingTiers: [{ label: 'بالغ', price: '' }],
    image: null,
    description: '',
    travelDates: {
      start: undefined,
      end: undefined
    },
    additionalInfo: '',
    youtubeVideo: ''
  });

  const handleEditOffer = (offer: any) => {
    // Convert saved offer back to form format
    setOfferData({
      name: offer.name,
      destination: offer.destination || '',
      country: offer.country || '',
      customCountry: offer.custom_country || '',
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
      pricingTiers: offer.pricing_tiers || [{ label: 'بالغ', price: '' }],
      image: null,
      description: offer.description || '',
      travelDates: offer.travel_dates || { start: undefined, end: undefined },
      additionalInfo: offer.additional_info || '',
      youtubeVideo: offer.youtube_video || ''
    });
    setEditingOffer(offer);
    setActiveTab('create');
  };

  const handleNewOffer = () => {
    setEditingOffer(null);
    setOfferData({
      name: '',
      destination: '',
      country: '',
      customCountry: '',
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
      pricingTiers: [{ label: 'بالغ', price: '' }],
      image: null,
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              منشئ العروض السياحية
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              إنشاء عروض سياحية احترافية بسهولة
            </p>
          </div>
          <Auth onAuthChange={() => {}} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              منشئ العروض السياحية
            </h1>
            <p className="text-lg text-gray-600">
              إنشاء عروض سياحية احترافية بسهولة
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              مرحباً، {user?.email}
            </span>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            <Button
              variant={activeTab === 'create' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('create')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إنشاء عرض جديد
            </Button>
            <Button
              variant={activeTab === 'saved' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('saved')}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              العروض المحفوظة
            </Button>
          </div>
        </div>

        {activeTab === 'create' ? (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                      <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                        1
                      </span>
                      {editingOffer ? 'تعديل العرض السياحي' : 'إنشاء عرض سياحي'}
                    </h2>
                    {editingOffer && (
                      <Button variant="outline" onClick={handleNewOffer}>
                        عرض جديد
                      </Button>
                    )}
                  </div>
                  <OfferForm 
                    offerData={offerData} 
                    setOfferData={setOfferData}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                      2
                    </span>
                    معاينة وتصدير
                  </h2>
                  <PDFPreview 
                    offerData={offerData} 
                    editingOffer={editingOffer}
                    onOfferSaved={() => setActiveTab('saved')}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <SavedOffers onEditOffer={handleEditOffer} user={user} />
          </div>
        )}
      </div>
    </div>
  );
};
