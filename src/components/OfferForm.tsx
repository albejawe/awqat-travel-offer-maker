import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Trash2, Upload, Youtube } from 'lucide-react';
import { OfferData, PricingTier } from '@/types/offer';
import { DateRangePicker } from './DateRangePicker';
import { extractYouTubeVideoId } from '@/utils/youtubeUtils';

interface OfferFormProps {
  offerData: OfferData;
  setOfferData: React.Dispatch<React.SetStateAction<OfferData>>;
  editingOffer?: any;
}

const countries = ['Turkey', 'UAE', 'UK', 'France', 'Italy', 'Spain', 'Netherlands', 'Thailand', 'Japan', 'Singapore', 'Maldives', 'Indonesia', 'Egypt', 'Morocco', 'South Africa'];
const airlines = ['الجزيرة', 'الخطوط السعودية', 'الطيران العربي', 'فلاي دبي', 'الاتحاد', 'الكويتية', 'Turkish Airlines', 'Emirates', 'Qatar Airways', 'Etihad', 'Flydubai'];
const airports = ['اتاتورك', 'صبيحة كوكجن', 'دبي الدولي', 'ابو ظبي الدولي', 'الملك عبدالعزيز', 'الملك خالد الدولي', 'الكويت الدولي', 'حمد الدولي'];
const roomTypes = ['سويت غرفه وصاله', 'غرفة مفردة', 'غرفة مزدوجة', 'غرفة ثلاثية', 'غرفة عائلية', 'جناح ملكي', 'استوديو'];
const carTypes = ['مرسيدس ميني باص', 'تويوتا هايس', 'كوستر', 'سيارة عادية', 'سيارة فان', 'حافلة صغيرة', 'حافلة كبيرة'];

export const OfferForm: React.FC<OfferFormProps> = ({
  offerData,
  setOfferData,
  editingOffer
}) => {
  const addPricingTier = () => {
    setOfferData(prev => ({
      ...prev,
      pricingTiers: [...prev.pricingTiers, {
        label: '',
        price: ''
      }]
    }));
  };
  const removePricingTier = (index: number) => {
    if (offerData.pricingTiers.length > 1) {
      setOfferData(prev => ({
        ...prev,
        pricingTiers: prev.pricingTiers.filter((_, i) => i !== index)
      }));
    }
  };
  const updatePricingTier = (index: number, field: keyof PricingTier, value: string) => {
    setOfferData(prev => ({
      ...prev,
      pricingTiers: prev.pricingTiers.map((tier, i) => i === index ? {
        ...tier,
        [field]: value
      } : tier)
    }));
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOfferData(prev => ({
        ...prev,
        image: file
      }));
    }
  };
  const handleYouTubeVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setOfferData(prev => ({
      ...prev,
      youtubeVideo: url
    }));
  };

  const videoId = offerData.youtubeVideo ? extractYouTubeVideoId(offerData.youtubeVideo) : null;

  return <div className="space-y-6" style={{
    fontFamily: 'Cairo, sans-serif',
    direction: 'rtl'
  }}>
      {/* Basic Information */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">المعلومات الأساسية</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="offerName">اسم العرض</Label>
              <Input 
                id="offerName" 
                placeholder="مثال: 7 أيام في إسطنبول" 
                value={offerData.name} 
                onChange={e => setOfferData(prev => ({
                  ...prev,
                  name: e.target.value
                }))} 
                className="mt-1" 
                dir="rtl" 
              />
            </div>

            <div>
              <Label htmlFor="country">الدولة</Label>
              <div className="flex gap-2">
                <Select 
                  value={offerData.country}
                  onValueChange={value => setOfferData(prev => ({
                    ...prev,
                    country: value
                  }))}
                >
                  <SelectTrigger className="mt-1 flex-1">
                    <SelectValue placeholder="اختر الدولة" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="أو اكتب الدولة" 
                  value={offerData.customCountry || ''} 
                  onChange={e => setOfferData(prev => ({
                    ...prev,
                    customCountry: e.target.value
                  }))} 
                  className="mt-1 flex-1" 
                  dir="rtl" 
                />
              </div>
            </div>

            <div>
              <Label htmlFor="destination">اسم المدينة</Label>
              <Input 
                id="destination" 
                placeholder="مثال: تقسيم" 
                value={offerData.destination} 
                onChange={e => setOfferData(prev => ({
                  ...prev,
                  destination: e.target.value
                }))} 
                className="mt-1" 
                dir="rtl" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flight Information */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">معلومات الطيران</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>إقلاع الذهاب</Label>
                <div className="space-y-2">
                  <Input placeholder="التاريخ (مثال: 10-6)" value={offerData.departureDate || ''} onChange={e => setOfferData(prev => ({
                  ...prev,
                  departureDate: e.target.value
                }))} className="mt-1" dir="rtl" />
                  <Input placeholder="الوقت (مثال: 14:30)" value={offerData.departureTime || ''} onChange={e => setOfferData(prev => ({
                  ...prev,
                  departureTime: e.target.value
                }))} dir="rtl" />
                </div>
              </div>

              <div>
                <Label>إقلاع العودة</Label>
                <div className="space-y-2">
                  <Input placeholder="التاريخ (مثال: 20-6)" value={offerData.returnDate || ''} onChange={e => setOfferData(prev => ({
                  ...prev,
                  returnDate: e.target.value
                }))} className="mt-1" dir="rtl" />
                  <Input placeholder="الوقت (مثال: 16:45)" value={offerData.returnTime || ''} onChange={e => setOfferData(prev => ({
                  ...prev,
                  returnTime: e.target.value
                }))} dir="rtl" />
                </div>
              </div>
            </div>

            <div>
              <Label>الطيران</Label>
              <div className="flex gap-2">
                <Select onValueChange={value => setOfferData(prev => ({
                ...prev,
                airline: value
              }))}>
                  <SelectTrigger className="mt-1 flex-1">
                    <SelectValue placeholder="اختر شركة الطيران" />
                  </SelectTrigger>
                  <SelectContent>
                    {airlines.map(airline => <SelectItem key={airline} value={airline}>{airline}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input placeholder="أو اكتب اسم الطيران" value={offerData.customAirline || ''} onChange={e => setOfferData(prev => ({
                ...prev,
                customAirline: e.target.value
              }))} className="mt-1 flex-1" dir="rtl" />
              </div>
            </div>

            <div>
              <Label>المطار</Label>
              <div className="flex gap-2">
                <Select onValueChange={value => setOfferData(prev => ({
                ...prev,
                airport: value
              }))}>
                  <SelectTrigger className="mt-1 flex-1">
                    <SelectValue placeholder="اختر المطار" />
                  </SelectTrigger>
                  <SelectContent>
                    {airports.map(airport => <SelectItem key={airport} value={airport}>{airport}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input placeholder="أو اكتب اسم المطار" value={offerData.customAirport || ''} onChange={e => setOfferData(prev => ({
                ...prev,
                customAirport: e.target.value
              }))} className="mt-1 flex-1" dir="rtl" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotel Information */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">معلومات الفندق</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="hotel">الفندق</Label>
              <Input id="hotel" placeholder="مثال: وادي اسطنبول" value={offerData.hotel || ''} onChange={e => setOfferData(prev => ({
              ...prev,
              hotel: e.target.value
            }))} className="mt-1" dir="rtl" />
            </div>

            <div>
              <Label htmlFor="roomType">نوع الغرفة</Label>
              <Select onValueChange={value => setOfferData(prev => ({
              ...prev,
              roomType: value
            }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="اختر نوع الغرفة" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="numberOfPeople">عدد الأشخاص</Label>
              <Input id="numberOfPeople" type="number" placeholder="مثال: 2" value={offerData.numberOfPeople || ''} onChange={e => setOfferData(prev => ({
              ...prev,
              numberOfPeople: e.target.value
            }))} className="mt-1" dir="rtl" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transportation */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">التوصيل</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="transportation">التوصيل</Label>
              <Input id="transportation" placeholder="مثال: من المطار الى الفندق" value={offerData.transportation || ''} onChange={e => setOfferData(prev => ({
              ...prev,
              transportation: e.target.value
            }))} className="mt-1" dir="rtl" />
            </div>

            <div>
              <Label htmlFor="carType">نوع السيارة</Label>
              <Select onValueChange={value => setOfferData(prev => ({
              ...prev,
              carType: value
            }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="اختر نوع السيارة" />
                </SelectTrigger>
                <SelectContent>
                  {carTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Section */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">الأسعار</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="basePrice">السعر الأساسي (اختياري)</Label>
              <Input id="basePrice" placeholder="مثال: 1200 ريال" value={offerData.basePrice} onChange={e => setOfferData(prev => ({
              ...prev,
              basePrice: e.target.value
            }))} className="mt-1" dir="rtl" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>تفاصيل الأسعار</Label>
                <Button type="button" variant="outline" size="sm" onClick={addPricingTier} className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  إضافة سعر
                </Button>
              </div>

              {offerData.pricingTiers.map((tier, index) => <div key={index} className="flex gap-2 mb-2">
                  <Input placeholder="التسمية (مثال: بالغ، طفل)" value={tier.label} onChange={e => updatePricingTier(index, 'label', e.target.value)} className="flex-1" dir="rtl" />
                  <Input placeholder="السعر" value={tier.price} onChange={e => updatePricingTier(index, 'price', e.target.value)} className="flex-1" dir="rtl" />
                  {offerData.pricingTiers.length > 1 && <Button type="button" variant="outline" size="sm" onClick={() => removePricingTier(index)} className="px-3">
                      <Trash2 className="w-4 h-4" />
                    </Button>}
                </div>)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">صورة العرض</h3>
          <div className="space-y-4">
            {/* Show existing image if editing */}
            {editingOffer?.imageUrl && !offerData.image && (
              <div className="mb-4">
                <Label>الصورة الحالية</Label>
                <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <img 
                    src={editingOffer.imageUrl} 
                    alt="Current offer image" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <p className="text-sm text-green-600 mt-2 text-center">
                    ✓ صورة محفوظة - اختر صورة جديدة للاستبدال
                  </p>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="image">رفع صورة {editingOffer?.imageUrl ? '(جديدة)' : ''}</Label>
              <div className="mt-1 flex items-center justify-center w-full">
                <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">اضغط للرفع</span> أو اسحب الصورة
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG أو GIF (حد أقصى 10MB)</p>
                  </div>
                  <input id="image" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              {offerData.image && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ تم رفع {offerData.image.name}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* YouTube Video */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">فيديو يوتيوب</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="youtubeVideo">رابط فيديو يوتيوب</Label>
              <div className="mt-1 relative">
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Youtube className="w-5 h-5 text-red-500" />
                </div>
                <Input
                  id="youtubeVideo"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={offerData.youtubeVideo || ''}
                  onChange={handleYouTubeVideoChange}
                  className="pr-12"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">
                يمكنك لصق رابط فيديو من يوتيوب هنا ليظهر في العرض
              </p>
            </div>
            
            {videoId && (
              <div>
                <Label>معاينة الفيديو</Label>
                <div className="mt-2 w-full aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    title="معاينة فيديو يوتيوب"
                  />
                </div>
              </div>
            )}
            
            {offerData.youtubeVideo && !videoId && (
              <p className="text-sm text-red-600 mt-2">
                ⚠️ الرابط غير صحيح. تأكد من أنه رابط يوتيوب صالح
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Travel Dates */}
      <Card>
        
      </Card>

      {/* Description and Additional Info */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">التفاصيل</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">وصف مفصل للعرض</Label>
              <Textarea id="description" placeholder="اكتب تفاصيل البرنامج، المشمولات، الأنشطة..." value={offerData.description} onChange={e => setOfferData(prev => ({
              ...prev,
              description: e.target.value
            }))} className="mt-1 min-h-[120px]" dir="rtl" />
            </div>

            <div>
              <Label htmlFor="additionalInfo">معلومات إضافية</Label>
              <Textarea id="additionalInfo" placeholder="الشروط والأحكام، ملاحظات خاصة..." value={offerData.additionalInfo} onChange={e => setOfferData(prev => ({
              ...prev,
              additionalInfo: e.target.value
            }))} className="mt-1" dir="rtl" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
