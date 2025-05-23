import summerResortImage from "./../../../assets/venue/summer/travel-summer-6.jpg";
import profilePic from "./../../../assets/venue/journalist/CedricDiggeroy.jpg";
import poolsidePic from "./../../../assets/venue/unique/unique-beach-4.jpg";
import sunsetPic from "./../../../assets/venue/summer/travel-summer-3.jpg";

const SummerResortsBlog = () => {
  return (
    <div className="flex flex-col items-center px-4 sm:px-8 py-8">
      <img
        src={summerResortImage}
        alt="Relaxing summer resort getaway"
        className="w-full lg:w-5/6 h-88 object-cover mx-auto mb-8 rounded-lg shadow-md"
      />

      {/* Main Content + Sidebar wrapper */}
      <div className="w-full lg:w-5/6 flex flex-col lg:flex-row gap-8">
        {/* Main Text Section */}
        <div className="lg:w-3/4 text-gray-800 space-y-6 pr-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-espressoy mb-2 pt-4">
            Summer Resorts – Escape to Paradise
          </h1>
          <p className="text-base sm:text-lg leading-relaxed pt-8">
            When the sun is high and the days are long, there’s no better place to
            be than a luxurious summer resort. These serene havens offer crystal-clear
            waters, golden sands, and the kind of calm that only comes from a seaside escape.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            Picture yourself lounging by an infinity pool with a chilled drink in hand,
            the ocean breeze whispering through palm trees overhead. Every moment is a
            gentle reminder that you’ve arrived somewhere truly special.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            Our curated collection of summer resorts spans the world’s most breathtaking
            coastlines. Whether you’re exploring the Greek isles, sipping cocktails in
            the Caribbean, or enjoying a sunset massage in Bali, these destinations
            redefine relaxation.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            With gourmet cuisine, world-class spas, and activities for every type of traveler,
            our summer resorts are designed for ultimate rejuvenation. Discover yoga at dawn,
            snorkeling at noon, and stargazing after dinner.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            Your summer sanctuary is calling. Dive in and experience the magic of
            sun-soaked serenity.
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
                  Written by Cedric Diggoroy
                </p>
                <p className="text-sm text-gray-500">May 23, 2025</p>
              </div>
            </div>
          </div>

          {/* Image 1 */}
          <div className="order-1 lg:order-2">
            <img
              src={sunsetPic}
              alt="Poolside relaxation"
              className="w-full rounded-md shadow-md"
            />
            <p className="text-gray-600 italic text-sm mt-2">
              Soak up the sun poolside
            </p>
          </div>

          {/* Image 2 */}
          <div className="order-2 lg:order-3">
            <img
              src={poolsidePic}
              alt="Resort sunset view"
              className="w-full rounded-md shadow-md"
            />
            <p className="text-gray-600 italic text-sm mt-2">
              Catch golden hour from paradise
            </p>
          </div>
        </div>
      </div>

      {/* Optional: Add <SummerResortsVenues /> here if you want to feature related venues */}
    </div>
  );
};

export default SummerResortsBlog;
