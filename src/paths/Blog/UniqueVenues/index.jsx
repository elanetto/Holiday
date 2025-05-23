import uniqueVenueImage from "./../../../assets/venue/unique/unique-stay-japan-2.jpg";
import profilePic from "./../../../assets/venue/journalist/MollyWeasley.jpg";
import domePic from "./../../../assets/venue/unique/unique-dome-1.jpg";
import streetPic from "./../../../assets/venue/unique/unique-stay-japan-4.jpg";

const UniqueVenuesBlog = () => {
  return (
    <div className="flex flex-col items-center px-4 sm:px-8 py-8">
      <img
        src={uniqueVenueImage}
        alt="Unique stay in a Japanese village"
        className="w-full lg:w-5/6 h-88 object-cover mx-auto mb-8 rounded-lg shadow-md"
      />

      {/* Main Content + Sidebar wrapper */}
      <div className="w-full lg:w-5/6 flex flex-col lg:flex-row gap-8">
        {/* Main Text Section */}
        <div className="lg:w-3/4 text-gray-800 space-y-6 pr-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-espressoy mb-2 pt-4">
            Unique Venues – Sleep in a Dome, a Treehouse, or a Hidden Village
          </h1>
          <p className="text-base sm:text-lg leading-relaxed pt-8">
            Are you tired of the usual hotel experience? Ready to trade elevators for ladders and check-in counters for cozy cabins under the stars? Welcome to the enchanting world of unique venues — where every stay tells a story.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            Picture yourself waking up in a treehouse, suspended among whispering pines, with birdsong as your morning alarm. Or perhaps you’re tucked inside a glass-domed retreat, gazing at the stars from the comfort of your bed.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            From the rustic charm of Scandinavian glamping sites to tranquil Japanese countryside inns, our handpicked collection of unique venues delivers unforgettable moments wrapped in natural beauty and cultural immersion.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            Whether it’s a hobbit-style home carved into a hillside or a solar-powered eco-cabin in the desert, these stays are more than accommodation — they’re an experience. A chance to reconnect with nature, escape the noise, and find a little magic in the everyday.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            Embrace the extraordinary. Your next getaway doesn’t need four walls and a minibar — it needs character, charm, and a view worth writing home about.
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
                  Written by Molly Weasley
                </p>
                <p className="text-sm text-gray-500">May 23, 2025</p>
              </div>
            </div>
          </div>

          {/* Image 1 */}
          <div className="order-1 lg:order-2">
            <img
              src={domePic}
              alt="Treehouse hideaway"
              className="w-full rounded-md shadow-md"
            />
            <p className="text-gray-600 italic text-sm mt-2">
              Treehouses, domes, and magical getaways
            </p>
          </div>

          {/* Image 2 */}
          <div className="order-2 lg:order-3">
            <img
              src={streetPic}
              alt="Japanese countryside village"
              className="w-full rounded-md shadow-md"
            />
            <p className="text-gray-600 italic text-sm mt-2">
              Stay in a serene village in the Japanese countryside
            </p>
          </div>
        </div>
      </div>
      {/* You can add <UniqueVenues /> here if you want to list venues created by a “UniqueVenues” manager */}
    </div>
  );
};

export default UniqueVenuesBlog;
