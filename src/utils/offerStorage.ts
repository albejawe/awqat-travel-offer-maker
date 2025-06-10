import { supabase } from '@/integrations/supabase/client';
import { OfferData } from '@/types/offer';

export const saveOffer = async (offerData: OfferData) => {
  try {
    let imageUrl = null;
    let galleryImageUrls: string[] = [];

    // Upload cover image if exists
    if (offerData.coverImage) {
      const fileExt = offerData.coverImage.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('offer-images')
        .upload(filePath, offerData.coverImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('offer-images')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    // Upload gallery images if exist
    if (offerData.galleryImages && offerData.galleryImages.length > 0) {
      for (const image of offerData.galleryImages) {
        const fileExt = image.name.split('.').pop();
        const fileName = `gallery_${Date.now()}_${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('offer-images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('offer-images')
          .getPublicUrl(filePath);

        galleryImageUrls.push(publicUrl);
      }
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Save offer to database - using any to bypass type checking since destination column exists but types aren't updated
    const { data, error } = await supabase
      .from('travel_offers')
      .insert({
        name: offerData.name,
        destination: offerData.destination,
        country: offerData.country,
        custom_country: offerData.customCountry,
        category_id: offerData.categoryId,
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
        gallery_images: galleryImageUrls,
        description: offerData.description,
        travel_dates: offerData.travelDates,
        additional_info: offerData.additionalInfo,
        youtube_video: offerData.youtubeVideo,
        user_id: user.id
      } as any)
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
    let galleryImageUrls: string[] = [];

    // Upload new cover image if exists
    if (offerData.coverImage) {
      const fileExt = offerData.coverImage.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('offer-images')
        .upload(filePath, offerData.coverImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('offer-images')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    // Upload new gallery images if exist
    if (offerData.galleryImages && offerData.galleryImages.length > 0) {
      for (const image of offerData.galleryImages) {
        const fileExt = image.name.split('.').pop();
        const fileName = `gallery_${Date.now()}_${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('offer-images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('offer-images')
          .getPublicUrl(filePath);

        galleryImageUrls.push(publicUrl);
      }
    }

    const updateData: any = {
      name: offerData.name,
      destination: offerData.destination,
      country: offerData.country,
      custom_country: offerData.customCountry,
      category_id: offerData.categoryId,
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
      youtube_video: offerData.youtubeVideo,
      updated_at: new Date().toISOString()
    };

    if (imageUrl) {
      updateData.image_url = imageUrl;
    }

    if (galleryImageUrls.length > 0) {
      updateData.gallery_images = galleryImageUrls;
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