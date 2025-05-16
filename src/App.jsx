import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VenueList from "./components/VenueList";
import { useSearch } from "./contexts/useSearch";
import { ENDPOINTS } from "./utilities/constants";
import { SearchBar } from "./components/SearchBar";
import backgroundImage from "./assets/background/travel-street.jpg";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import { FaArrowRightLong } from "react-icons/fa6";
import { useUser } from "./contexts/useUser";

// Blog card background images
import uniqueVenuesImage from "./assets/background/travel-ancient-gate.jpg";
import sunnyResortsImage from "./assets/background/travel-greece.jpg";
import cityLivingImage from "./assets/background/travel_cliff.jpg";

function App() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, isAdmin, name } = useUser();

  const { searchFilters } = useSearch();

  const isSearchActive = !!searchFilters?.location || searchFilters?.guests > 1;

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchVenues = async () => {
      setLoading(true);
      const limit = 100;
      let currentPage = 1;
      let allVenues = [];

      try {
        while (true) {
          const url = `${ENDPOINTS.venues}?limit=${limit}&page=${currentPage}&sort=created&sortOrder=desc&_owner=true`;
          const res = await fetch(url, { signal });
          const data = await res.json();

          allVenues = [...allVenues, ...data.data];

          if (data.meta?.isLastPage || data.data.length < limit) {
            break;
          }

          currentPage++;
        }

        setVenues(allVenues);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error loading venues:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSearchResults = async () => {
      setSearchError(null);
      const { location = "", guests = 1 } = searchFilters || {};

      if (!location) {
        setFilteredVenues([]);
        return;
      }

      try {
        const res = await fetch(
          `${ENDPOINTS.venues}/search?q=${encodeURIComponent(location)}`,
          { signal }
        );
        if (!res.ok) throw new Error("Search request failed");

        const data = await res.json();
        const filtered = data.data.filter((venue) => venue.maxGuests >= guests);
        setFilteredVenues(filtered);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error searching venues:", err);
          setSearchError(
            "An error occurred while searching for venues. Please try again."
          );
        }
      }
    };

    fetchSearchResults();

    return () => controller.abort();
  }, [searchFilters, venues]);

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
      title: "Sunny Resorts",
      image: sunnyResortsImage,
      link: "/blog/sunny-resorts",
    },
    {
      title: "City Living",
      image: cityLivingImage,
      link: "/blog/city-living",
    },
  ];

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search area with background */}
        <div
          style={background}
          className="h-80 w-full flex items-center justify-center rounded-2xl shadow relative z-50"
        >
          <SearchBar />
        </div>

        {/* Show blog cards when no search is active */}
        {!isSearchActive && (
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
        )}

        {!isSearchActive && !isLoggedIn && (
          // 👇 Default banner for guests
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

        {!isSearchActive && isLoggedIn && !isAdmin && (
          // 👇 Banner for logged-in non-managers
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
                  <p className="italic">Upgrade to a venue manager account</p>
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

        {!isSearchActive && isLoggedIn && isAdmin && (
          // 👇 Banner for venue managers
          <div className="mt-14 mb-20 w-full bg-green-200 rounded-2xl shadow px-6 py-8">
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

        {/* Show search results if search is active */}
        {isSearchActive && (
          <div className="mt-10">
            {loading ? (
              <p className="text-center mt-10">Loading venues...</p>
            ) : (
              <>
                {searchError && (
                  <p className="text-red-500 text-center mb-4">{searchError}</p>
                )}
                <h2 className="text-2xl font-bold text-espressoy mb-4">
                  Search results
                  {searchFilters.location && ` for "${searchFilters.location}"`}
                  {searchFilters.guests > 1 &&
                    ` with at least ${searchFilters.guests} guests`}
                </h2>
                <VenueList venues={filteredVenues} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
