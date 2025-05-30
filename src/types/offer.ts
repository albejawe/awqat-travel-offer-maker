
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
  country?: string;
  departureDate?: string;
  returnDate?: string;
  airline?: string;
  airport?: string;
  hotel?: string;
  roomType?: string;
  numberOfPeople?: string;
  transportation?: string;
  carType?: string;
  basePrice: string;
  pricingTiers: PricingTier[];
  image: File | null;
  description: string;
  travelDates: TravelDates;
  additionalInfo: string;
}
