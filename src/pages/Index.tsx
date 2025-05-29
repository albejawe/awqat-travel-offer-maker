
import { TravelOfferCreator } from "@/components/TravelOfferCreator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Travel Offer Creator
          </h1>
          <p className="text-lg text-gray-600">
            Create professional travel offers with ease
          </p>
        </div>
        <TravelOfferCreator />
      </div>
    </div>
  );
};

export default Index;
