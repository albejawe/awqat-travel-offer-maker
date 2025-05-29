
import React, { useState } from 'react';
import { OfferForm } from './OfferForm';
import { PDFPreview } from './PDFPreview';
import { OfferData } from '@/types/offer';

export const TravelOfferCreator = () => {
  const [offerData, setOfferData] = useState<OfferData>({
    name: '',
    destination: '',
    basePrice: '',
    pricingTiers: [{ label: 'Adult', price: '' }],
    image: null,
    description: '',
    travelDates: {
      start: undefined,
      end: undefined
    },
    additionalInfo: ''
  });

  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                1
              </span>
              Create Your Travel Offer
            </h2>
            <OfferForm offerData={offerData} setOfferData={setOfferData} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                2
              </span>
              Preview & Export
            </h2>
            <PDFPreview offerData={offerData} />
          </div>
        </div>
      </div>
    </div>
  );
};
