
export interface PricingTier {
  label: string;
  price: string;
}

export interface TravelDates {
  start?: Date;
  end?: Date;
}

export interface OfferData {
  name: string;
  destination: string;
  basePrice: string;
  pricingTiers: PricingTier[];
  image: File | null;
  description: string;
  travelDates: TravelDates;
  additionalInfo: string;
}
