
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Trash2, Upload } from 'lucide-react';
import { OfferData, PricingTier } from '@/types/offer';
import { DateRangePicker } from './DateRangePicker';

interface OfferFormProps {
  offerData: OfferData;
  setOfferData: React.Dispatch<React.SetStateAction<OfferData>>;
}

const destinations = [
  'Dubai, UAE', 'Istanbul, Turkey', 'London, UK', 'Paris, France',
  'Rome, Italy', 'Barcelona, Spain', 'Amsterdam, Netherlands',
  'Bangkok, Thailand', 'Tokyo, Japan', 'Singapore', 'Maldives',
  'Bali, Indonesia', 'Cairo, Egypt', 'Morocco', 'South Africa'
];

export const OfferForm: React.FC<OfferFormProps> = ({ offerData, setOfferData }) => {
  const addPricingTier = () => {
    setOfferData(prev => ({
      ...prev,
      pricingTiers: [...prev.pricingTiers, { label: '', price: '' }]
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
      pricingTiers: prev.pricingTiers.map((tier, i) => 
        i === index ? { ...tier, [field]: value } : tier
      )
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOfferData(prev => ({ ...prev, image: file }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="offerName">Offer Name</Label>
              <Input
                id="offerName"
                placeholder="e.g., 7 Days in Dubai Paradise"
                value={offerData.name}
                onChange={(e) => setOfferData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="destination">Destination</Label>
              <Select onValueChange={(value) => setOfferData(prev => ({ ...prev, destination: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Section */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">Pricing</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="basePrice">Base Price (Optional)</Label>
              <Input
                id="basePrice"
                placeholder="e.g., $1,200"
                value={offerData.basePrice}
                onChange={(e) => setOfferData(prev => ({ ...prev, basePrice: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Pricing Tiers</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPricingTier}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Tier
                </Button>
              </div>

              {offerData.pricingTiers.map((tier, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Label (e.g., Adult, Child)"
                    value={tier.label}
                    onChange={(e) => updatePricingTier(index, 'label', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Price"
                    value={tier.price}
                    onChange={(e) => updatePricingTier(index, 'price', e.target.value)}
                    className="flex-1"
                  />
                  {offerData.pricingTiers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePricingTier(index)}
                      className="px-3"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">Offer Image</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image">Upload Image</Label>
              <div className="mt-1 flex items-center justify-center w-full">
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 10MB)</p>
                  </div>
                  <input
                    id="image"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              {offerData.image && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ {offerData.image.name} uploaded
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travel Dates */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">Travel Dates</h3>
          <DateRangePicker
            startDate={offerData.travelDates.start}
            endDate={offerData.travelDates.end}
            onDateChange={(start, end) => 
              setOfferData(prev => ({ 
                ...prev, 
                travelDates: { start, end } 
              }))
            }
          />
        </CardContent>
      </Card>

      {/* Description and Additional Info */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the itinerary, inclusions, highlights..."
                value={offerData.description}
                onChange={(e) => setOfferData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 min-h-[120px]"
              />
            </div>

            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Terms, conditions, special notes..."
                value={offerData.additionalInfo}
                onChange={(e) => setOfferData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
