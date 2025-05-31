
import { supabase } from '@/integrations/supabase/client';
import { OfferData } from '@/types/offer';

export const saveOffer = async (offerData: OfferData) => {
  try {
    let imageUrl = null;

    // Upload image if exists
    if (offerData.image) {
      const fileExt = offerData.image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('offer-images')
        .upload(filePath, offerData.image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('offer-images')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Save offer to database
    const { data, error } = await supabase
      .from('travel_offers')
      .insert({
        destination: offerData.destination,
        country: offerData.country,
        custom_country: offerData.customCountry,
        departure_date: offerData.departureDate,
        departure_time: offerData.departureTime,
        return_date: offerData.returnDate,
        return_time: offerData.returnTime,
        airline: offerData.airline,
        custom_airline: offerData.customAirline,
        airport: offerData.airport,
        custom_airport: offerData.customAirport,
        hotel: offerData.hotel,
        room_type: offerData.roomType,
        number_of_people: offerData.numberOfPeople,
        transportation: offerData.transportation,
        car_type: offerData.carType,
        base_price: offerData.basePrice,
        pricing_tiers: offerData.pricingTiers,
        image_url: imageUrl,
        description: offerData.description,
        travel_dates: offerData.travelDates,
        additional_info: offerData.additionalInfo,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving offer:', error);
    throw error;
  }
};

export const updateOffer = async (id: string, offerData: OfferData) => {
  try {
    let imageUrl = null;

    // Upload new image if exists
    if (offerData.image) {
      const fileExt = offerData.image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('offer-images')
        .upload(filePath, offerData.image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('offer-images')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    const updateData: any = {
      destination: offerData.destination,
      country: offerData.country,
      custom_country: offerData.customCountry,
      departure_date: offerData.departureDate,
      departure_time: offerData.departureTime,
      return_date: offerData.returnDate,
      return_time: offerData.returnTime,
      airline: offerData.airline,
      custom_airline: offerData.customAirline,
      airport: offerData.airport,
      custom_airport: offerData.customAirport,
      hotel: offerData.hotel,
      room_type: offerData.roomType,
      number_of_people: offerData.numberOfPeople,
      transportation: offerData.transportation,
      car_type: offerData.carType,
      base_price: offerData.basePrice,
      pricing_tiers: offerData.pricingTiers,
      description: offerData.description,
      travel_dates: offerData.travelDates,
      additional_info: offerData.additionalInfo,
      updated_at: new Date().toISOString()
    };

    if (imageUrl) {
      updateData.image_url = imageUrl;
    }

    const { data, error } = await supabase
      .from('travel_offers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating offer:', error);
    throw error;
  }
};
