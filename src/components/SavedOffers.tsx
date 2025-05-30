
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Download, Edit, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { OfferData } from '@/types/offer';
import { generatePDF } from '@/utils/pdfGenerator';

interface SavedOffersProps {
  onEditOffer: (offer: any) => void;
  user: any;
}

export const SavedOffers: React.FC<SavedOffersProps> = ({ onEditOffer, user }) => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchOffers();
    }
  }, [user]);

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل العروض",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteOffer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('travel_offers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setOffers(offers.filter(offer => offer.id !== id));
      toast({
        title: "تم حذف العرض",
        description: "تم حذف العرض بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في حذف العرض",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const downloadOffer = async (offer: any) => {
    try {
      // Convert the saved offer back to OfferData format
      const offerData: OfferData = {
        name: offer.name,
        destination: offer.destination,
        country: offer.country,
        customCountry: offer.custom_country,
        departureDate: offer.departure_date,
        departureTime: offer.departure_time,
        returnDate: offer.return_date,
        returnTime: offer.return_time,
        airline: offer.airline,
        customAirline: offer.custom_airline,
        airport: offer.airport,
        customAirport: offer.custom_airport,
        hotel: offer.hotel,
        roomType: offer.room_type,
        numberOfPeople: offer.number_of_people,
        transportation: offer.transportation,
        carType: offer.car_type,
        basePrice: offer.base_price,
        pricingTiers: offer.pricing_tiers,
        image: null, // We'll need to handle stored images separately
        description: offer.description,
        travelDates: offer.travel_dates,
        additionalInfo: offer.additional_info
      };

      // Create a temporary element for PDF generation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <div style="font-family: Cairo, sans-serif; direction: rtl; background: white; padding: 2rem; width: 210mm;">
          <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
            <div>
              <h1 style="font-size: 2rem; font-weight: bold; color: #1f2937; margin-bottom: 0.5rem;">${offer.name}</h1>
              ${offer.destination ? `<p style="font-size: 1.125rem; color: #2563eb; font-weight: 600;">📍 ${offer.destination}${offer.country || offer.custom_country ? `, ${offer.custom_country || offer.country}` : ''}</p>` : ''}
            </div>
            <div style="text-align: center;">
              <img src="/lovable-uploads/a301b0cc-0db5-40a4-9c35-c8003adb6c82.png" alt="Company Logo" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 0.5rem;">
              <h3 style="font-weight: bold; font-size: 1.125rem; color: #2563eb;">شركة أوقات للسياحة والسفر</h3>
              <p style="color: #6b7280; font-weight: 500; font-size: 0.875rem;">حولي - شارع تونس - بناية هيا</p>
            </div>
          </div>
          <!-- Add more content here based on the offer data -->
        </div>
      `;
      
      await generatePDF(tempDiv, offer.name);
      tempDiv.remove();

      toast({
        title: "تم تحميل العرض",
        description: "تم تحميل ملف PDF بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل العرض",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">جارٍ تحميل العروض...</div>;
  }

  if (!offers.length) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">لا توجد عروض محفوظة</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">العروض المحفوظة</h2>
      {offers.map((offer) => (
        <Card key={offer.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{offer.name}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditOffer(offer)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadOffer(offer)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteOffer(offer.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              الوجهة: {offer.destination} {offer.country || offer.custom_country}
            </p>
            <p className="text-sm text-gray-600">
              تاريخ الإنشاء: {new Date(offer.created_at).toLocaleDateString('ar')}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
