import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "./components/SearchBar";
import backgroundImage from "./assets/background/travel-street.jpg";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import { FaArrowRightLong } from "react-icons/fa6";
import { useUser } from "./contexts/useUser";
import SearchResults from "./components/SearchResults";
import { useVenueStore } from "./store/useVenueStore";
import { ENDPOINTS } from "./utilities/constants";
import { useSearch } from "./contexts/useSearch";

import uniqueVenuesImage from "./assets/venue/unique/unique-stay-japan-2.jpg";
import sunnyResortsImage from "./assets/venue/summer/travel-summer-6.jpg";
import cityLivingImage from "./assets/venue/city/travel-singapore-3.jpg";

function App() {
  const { isLoggedIn, isVenueManager, name } = useUser();
  const { searchFilters } = useSearch();
  const { setVenues, venues, setLoading } = useVenueStore();

  const hasFetchedOnce = useRef(false);

  const location = searchFilters?.location || "";
  const guests = searchFilters?.guests || 1;
  const isSearchActive = !!location.trim() || guests > 1;

  useEffect(() => {
    const fetchVenues = async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      setLoading(true);

      const limit = 100;
      let currentPage = 1;
      let allVenues = [];

      try {
        while (true) {
          const url = ENDPOINTS.venuesWithQuery({
            page: currentPage,
            limit,
            sort: "created",
            sortOrder: "desc",
            includeOwner: true,
            includeBookings: true,
          });

          const res = await fetch(url, { signal });
          const data = await res.json();

          if (!Array.isArray(data.data))
            throw new Error("Unexpected response format");

          allVenues = [...allVenues, ...data.data];

          if (data.meta?.isLastPage || data.data.length < limit) break;
          currentPage++;
        }

        setVenues(allVenues);
        hasFetchedOnce.current = true;
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error loading venues:", err);
        }
      } finally {
        setLoading(false);
      }

      // ✅ Clean up fetch if unmounted
      return () => controller.abort();
    };

    if (!hasFetchedOnce.current && venues.length === 0) {
      fetchVenues();
    }
  }, [venues.length, setVenues, setLoading]);

  const background = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const blogCards = [
    {
      title: "Unique Venues",
      image: uniqueVenuesImage,
      link: "/blog/unique-venues",
    },
    {
      title: "Summer Resorts",
      image: sunnyResortsImage,
      link: "/blog/summer-resorts",
    },
    { title: "City Living", image: cityLivingImage, link: "/blog/city-living" },
  ];

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div
          style={background}
          className="h-[480px] md:h-80 w-full flex items-center justify-center rounded-2xl shadow relative z-50"
        >
          <SearchBar />
        </div>

        {isSearchActive ? (
          <div className="mt-10">
            <SearchResults forceShowResults={true} />
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {blogCards.map((card) => (
                <Link
                  to={card.link}
                  key={card.title}
                  className="relative rounded-2xl overflow-hidden shadow-lg group h-60 hover:scale-105 transition-transform"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                  <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
                    <h3 className="text-white text-xl font-bold group-hover:text-white transition">
                      {card.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {!isLoggedIn && (
              <div className="mt-14 mb-20 w-full bg-sunny rounded-2xl shadow px-6 py-8">
                <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-10 text-center sm:text-left">
                  <div className="text-6xl text-yellow-100">
                    <LiaMapMarkedAltSolid />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl sm:text-4xl font-bold text-espressoy font-ledger">
                      Host venues for free
                    </h2>
                    <span className="flex gap-2 items-center">
                      <FaArrowRightLong />
                      <p className="italic">Become a venue manager today</p>
                    </span>
                  </div>
                  <Link
                    to="/register"
                    className="bg-espressoy text-white px-6 py-2 rounded-xl hover:bg-orangey transition"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}

            {isLoggedIn && !isVenueManager && (
              <div className="mt-14 mb-20 w-full bg-sunny rounded-2xl shadow px-6 py-8">
                <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-10 text-center sm:text-left">
                  <div className="text-6xl text-yellow-100">
                    <LiaMapMarkedAltSolid />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl sm:text-4xl font-bold text-espressoy font-ledger">
                      Ready to start hosting?
                    </h2>
                    <span className="flex gap-2 items-center">
                      <FaArrowRightLong />
                      <p className="italic">
                        Upgrade to a venue manager account
                      </p>
                    </span>
                  </div>
                  <Link
                    to={`/account/${encodeURIComponent(name)}?tab=become`}
                    className="bg-espressoy text-white px-6 py-2 rounded-xl hover:bg-orangey transition"
                  >
                    Become a Manager
                  </Link>
                </div>
              </div>
            )}

            {isLoggedIn && isVenueManager && (
              <div className="mt-14 mb-20 w-full bg-sunny rounded-2xl shadow px-6 py-8">
                <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-10 text-center sm:text-left">
                  <div className="text-6xl text-espressoy">
                    <LiaMapMarkedAltSolid />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl sm:text-4xl font-bold text-espressoy font-ledger">
                      Manage your venues
                    </h2>
                    <span className="flex gap-2 items-center">
                      <FaArrowRightLong />
                      <p className="italic">
                        Keep track of your listings and bookings
                      </p>
                    </span>
                  </div>
                  <Link
                    to={`/account/${encodeURIComponent(name)}?tab=venues`}
                    className="bg-espressoy text-white px-6 py-2 rounded-xl hover:bg-orangey transition"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
