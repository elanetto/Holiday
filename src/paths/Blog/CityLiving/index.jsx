import cityLivingImage from "./../../../assets/venue/city/travel-singapore-3.jpg";
import profilePic from "./../../../assets/venue/journalist/ritaskeeter.jpg";
import hotelPic from "./../../../assets/venue/hotel-details/hotel-detail-6.jpg";
import streetPic from "./../../../assets/venue/city/travel-france-3.jpg";
import CityLivingVenues from "./CityLivingVenues";

const CityLivingBlog = () => {
  return (
    <div className="flex flex-col items-center px-4 sm:px-8 py-8">
      <img
        src={cityLivingImage}
        alt="City Living - explore the city"
        className="w-full lg:w-5/6 h-88 object-cover mx-auto mb-8 rounded-lg shadow-md"
      />

      {/* Main Content + Sidebar wrapper */}
      <div className="w-full lg:w-5/6 flex flex-col lg:flex-row gap-8">
        {/* Main Text Section */}
        <div className="lg:w-3/4 text-gray-800 space-y-6 pr-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-espressoy mb-2 pt-4">
            City Living – A World of Urban Adventures Awaits
          </h1>
          <p className="text-base sm:text-lg leading-relaxed pt-8">
            Have you ever dreamed of exploring vibrant cityscapes while enjoying
            the luxuries of a five-star retreat? Our collection of premium
            hotels turns this dream into reality, offering you the perfect blend
            of urban adventure and sophisticated comfort.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            Imagine waking up to panoramic city views from your penthouse suite,
            where floor-to-ceiling windows frame the urban landscape like a
            living masterpiece. Start your day with a gourmet breakfast prepared
            by world-class chefs, then step out into the heart of the world's
            most exciting metropolises.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            Whether you're savoring authentic street food in Bangkok,
            discovering hidden art galleries in Paris, or watching the sunset
            over New York's skyline from your private terrace, our properties
            serve as your luxury base camp for urban exploration.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            Return each evening to your urban sanctuary, where spa treatments,
            rooftop pools, and Michelin-starred dining experiences await. This
            is more than just travel – it's an invitation to experience the
            world's greatest cities while living in unparalleled luxury.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            Your next urban adventure begins here. Where will your wanderlust
            take you?
          </p>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/4 flex flex-col space-y-6">
          {/* Author info — show last on mobile, first on desktop */}
          <div className="order-3 lg:order-1 lg:pt-0 pt-10">
            <div className="flex items-center gap-4">
              <img
                src={profilePic}
                alt="Author profile"
                className="w-22 h-22 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-espressoy">
                  Written by Rita Skeeter
                </p>
                <p className="text-sm text-gray-500">May 23, 2025</p>
              </div>
            </div>
          </div>

          {/* Image 1 */}
          <div className="order-1 lg:order-2">
            <img
              src={hotelPic}
              alt="Urban inspiration"
              className="w-full rounded-md shadow-md"
            />
            <p className="text-gray-600 italic text-sm mt-2">
              Find your base in the city centre
            </p>
          </div>

          {/* Image 2 */}
          <div className="order-2 lg:order-3">
            <img
              src={streetPic}
              alt="Urban inspiration"
              className="w-full rounded-md shadow-md"
            />
            <p className="text-gray-600 italic text-sm mt-2">
              Explore the urban streets
            </p>
          </div>
        </div>
      </div>
      <CityLivingVenues />
    </div>
  );
};

export default CityLivingBlog;
