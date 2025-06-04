
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
  customCountry?: string;
  departureDate?: string;
  departureTime?: string;
  returnDate?: string;
  returnTime?: string;
  airline?: string;
  customAirline?: string;
  airport?: string;
  customAirport?: string;
  hotel?: string;
  roomType?: string;
  numberOfPeople?: string;
  transportation?: string;
  carType?: string;
  basePrice: string;
  pricingTiers: PricingTier[];
  coverImage: File | null;
  galleryImages: File[];
  description: string;
  travelDates: TravelDates;
  additionalInfo: string;
  youtubeVideo?: string;
}
