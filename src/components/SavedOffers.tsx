
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Download, Edit } from 'lucide-react';
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
      // Create a temporary element for PDF generation with the exact same structure as PDFPreview
      const tempDiv = document.createElement('div');
      tempDiv.style.fontFamily = 'Cairo, sans-serif';
      tempDiv.style.direction = 'rtl';
      tempDiv.style.width = '210mm';
      tempDiv.style.background = 'white';
      tempDiv.style.padding = '2rem';

      const getImageUrl = () => {
        if (offer.image_url) {
          return offer.image_url;
        }
        return `https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=400&fit=crop`;
      };

      const getCountryDisplay = () => {
        return offer.custom_country || offer.country || '';
      };

      const getAirlineDisplay = () => {
        return offer.custom_airline || offer.airline || '';
      };

      const getAirportDisplay = () => {
        return offer.custom_airport || offer.airport || '';
      };

      tempDiv.innerHTML = `
        <div style="direction: rtl; font-family: Cairo, sans-serif;">
          <!-- Header with Company Logo -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
            <div style="flex: 1;">
              <h1 style="font-size: 2rem; font-weight: bold; color: #1f2937; margin-bottom: 0.5rem;">
                ${offer.name || 'عرض سياحي'}
              </h1>
              ${(offer.destination || getCountryDisplay()) ? `
                <p style="font-size: 1.125rem; color: #2563eb; font-weight: 600;">
                  📍 ${offer.destination}${getCountryDisplay() ? `, ${getCountryDisplay()}` : ''}
                </p>
              ` : ''}
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; margin-left: 1.5rem;">
              <img
                src="/lovable-uploads/a301b0cc-0db5-40a4-9c35-c8003adb6c82.png"
                alt="Company Logo"
                style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 0.5rem;"
              />
              <div style="text-align: center;">
                <h3 style="font-weight: bold; font-size: 1.125rem; color: #2563eb;">شركة أوقات للسياحة والسفر</h3>
                <p style="color: #6b7280; font-weight: 500; font-size: 0.875rem;">حولي - شارع تونس - بناية هيا</p>
              </div>
            </div>
          </div>

          <!-- Main Image -->
          <div style="width: 100%; height: 16rem; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); background-color: #f3f4f6; margin-bottom: 1.5rem;">
            <img
              src="${getImageUrl()}"
              alt="Travel destination"
              style="width: 100%; height: 100%; object-fit: cover;"
            />
          </div>

          <!-- Flight and Hotel Information -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
            <!-- Flight Info -->
            <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #93c5fd;">
              <div style="display: flex; align-items: center; margin-bottom: 0.75rem;">
                <div style="width: 2rem; height: 2rem; background-color: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 0.75rem;">
                  <span style="color: white; font-size: 0.875rem;">✈️</span>
                </div>
                <h3 style="font-weight: bold; font-size: 1.125rem; color: #1e40af;">معلومات الطيران</h3>
              </div>
              <div style="color: #374151; font-size: 0.875rem;">
                ${(offer.departure_date || offer.departure_time) ? `
                  <p style="margin-bottom: 0.5rem;">
                    <span style="font-weight: 600;">إقلاع الذهاب:</span> 
                    ${offer.departure_date ? ` ${offer.departure_date}` : ''}
                    ${offer.departure_time ? ` - ${offer.departure_time}` : ''}
                  </p>
                ` : ''}
                ${(offer.return_date || offer.return_time) ? `
                  <p style="margin-bottom: 0.5rem;">
                    <span style="font-weight: 600;">إقلاع العودة:</span> 
                    ${offer.return_date ? ` ${offer.return_date}` : ''}
                    ${offer.return_time ? ` - ${offer.return_time}` : ''}
                  </p>
                ` : ''}
                ${getAirlineDisplay() ? `
                  <p style="margin-bottom: 0.5rem;"><span style="font-weight: 600;">الطيران:</span> ${getAirlineDisplay()}</p>
                ` : ''}
                ${getAirportDisplay() ? `
                  <p><span style="font-weight: 600;">المطار:</span> ${getAirportDisplay()}</p>
                ` : ''}
              </div>
            </div>

            <!-- Hotel Info -->
            <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #86efac;">
              <div style="display: flex; align-items: center; margin-bottom: 0.75rem;">
                <div style="width: 2rem; height: 2rem; background-color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 0.75rem;">
                  <span style="color: white; font-size: 0.875rem;">🏨</span>
                </div>
                <h3 style="font-weight: bold; font-size: 1.125rem; color: #166534;">معلومات الإقامة</h3>
              </div>
              <div style="color: #374151; font-size: 0.875rem;">
                ${offer.hotel ? `
                  <p style="margin-bottom: 0.5rem;"><span style="font-weight: 600;">الفندق:</span> ${offer.hotel}</p>
                ` : ''}
                ${offer.room_type ? `
                  <p style="margin-bottom: 0.5rem;"><span style="font-weight: 600;">نوع الغرفة:</span> ${offer.room_type}</p>
                ` : ''}
                ${offer.number_of_people ? `
                  <p><span style="font-weight: 600;">عدد الأشخاص:</span> ${offer.number_of_people}</p>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Transportation -->
          ${(offer.transportation || offer.car_type) ? `
            <div style="background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #c4b5fd; margin-bottom: 1.5rem;">
              <div style="display: flex; align-items: center; margin-bottom: 0.75rem;">
                <div style="width: 2rem; height: 2rem; background-color: #7c3aed; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 0.75rem;">
                  <span style="color: white; font-size: 0.875rem;">🚗</span>
                </div>
                <h3 style="font-weight: bold; font-size: 1.125rem; color: #6b21a8;">التوصيل</h3>
              </div>
              <div style="color: #374151; font-size: 0.875rem;">
                ${offer.transportation ? `
                  <p style="margin-bottom: 0.5rem;"><span style="font-weight: 600;">التوصيل:</span> ${offer.transportation}</p>
                ` : ''}
                ${offer.car_type ? `
                  <p><span style="font-weight: 600;">نوع السيارة:</span> ${offer.car_type}</p>
                ` : ''}
              </div>
            </div>
          ` : ''}

          <!-- Pricing Section -->
          <div style="background: linear-gradient(135deg, #fefbf3 0%, #fef3c7 100%); padding: 1.5rem; border-radius: 0.75rem; border: 1px solid #fbbf24; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
              <div style="width: 2rem; height: 2rem; background-color: #d97706; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 0.75rem;">
                <span style="color: white; font-size: 0.875rem;">💰</span>
              </div>
              <h3 style="font-weight: bold; font-size: 1.25rem; color: #92400e;">الأسعار</h3>
            </div>
            
            ${offer.base_price ? `
              <div style="margin-bottom: 1rem; padding: 1rem; background-color: white; border-radius: 0.5rem; border-left: 4px solid #d97706;">
                <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">يبدأ من</p>
                <span style="font-size: 1.5rem; font-weight: bold; color: #b45309;">
                  ${offer.base_price}
                </span>
              </div>
            ` : ''}
            
            ${offer.pricing_tiers && offer.pricing_tiers.length > 0 && offer.pricing_tiers.some(tier => tier.price) ? `
              <div style="display: grid; grid-template-columns: 1fr; gap: 0.75rem;">
                ${offer.pricing_tiers
                  .filter(tier => tier.label && tier.price)
                  .map(tier => `
                    <div style="display: flex; justify-content: space-between; align-items: center; background-color: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;">
                      <span style="font-weight: 600; color: #374151; font-size: 1.125rem;">${tier.label}</span>
                      <span style="font-weight: bold; font-size: 1.25rem; color: #b45309;">${tier.price}</span>
                    </div>
                  `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Description -->
          ${offer.description ? `
            <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.75rem; border: 1px solid #e5e7eb; margin-bottom: 1.5rem;">
              <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                <div style="width: 2rem; height: 2rem; background-color: #4b5563; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 0.75rem;">
                  <span style="color: white; font-size: 0.875rem;">📝</span>
                </div>
                <h3 style="font-weight: bold; font-size: 1.25rem; color: #1f2937;">التفاصيل</h3>
              </div>
              <div style="color: #374151; white-space: pre-wrap; line-height: 1.6; font-size: 1rem; font-family: Arial, sans-serif; direction: rtl; unicode-bidi: embed;">
                ${offer.description}
              </div>
            </div>
          ` : ''}

          <!-- Additional Info -->
          ${offer.additional_info ? `
            <div style="background-color: #fef2f2; padding: 1.5rem; border-radius: 0.75rem; border: 1px solid #fca5a5; margin-bottom: 1.5rem;">
              <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                <div style="width: 2rem; height: 2rem; background-color: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 0.75rem;">
                  <span style="color: white; font-size: 0.875rem;">ℹ️</span>
                </div>
                <h3 style="font-weight: bold; font-size: 1.25rem; color: #991b1b;">معلومات إضافية</h3>
              </div>
              <div style="color: #b91c1c; white-space: pre-wrap; line-height: 1.6; font-size: 1rem; font-family: Arial, sans-serif; direction: rtl; unicode-bidi: embed;">
                ${offer.additional_info}
              </div>
            </div>
          ` : ''}

          <!-- Footer -->
          <div style="border-top: 2px solid #2563eb; padding-top: 1.5rem; margin-top: 2rem;">
            <div style="background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 1.5rem; border-radius: 0.75rem;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <h3 style="font-weight: bold; font-size: 1.5rem; margin-bottom: 0.5rem;">جاهز للحجز؟</h3>
                  <p style="color: #bfdbfe; font-size: 1.125rem;">تواصل معنا للمزيد من المعلومات والحجوزات</p>
                </div>
                <div style="text-align: right;">
                  <p style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.25rem;">📞 22289080</p>
                  <p style="color: #bfdbfe;">متاح 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      await generatePDF(tempDiv, offer.name || 'Travel Offer');

      toast({
        title: "تم تحميل العرض",
        description: "تم تحميل ملف PDF بنجاح",
      });
    } catch (error: any) {
      console.error('Error generating PDF:', error);
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
