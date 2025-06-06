import { useEffect, useRef } from "react";
import { useVenueStore } from "../../store/useVenueStore";
import { SearchBar } from "../../components/SearchBar";
import SearchResults from "../../components/SearchResults";
import backgroundImage from "../../assets/venue/unique/unique-beach-4.jpg";
import FetchAllVenues from "../../components/VenueList/FetchAllVenues";
import { ENDPOINTS } from "../../utilities/constants";
import { useSearch } from "../../contexts/useSearch";

function SearchPage() {
  const { setVenues, venues, setLoading, loading } = useVenueStore();
  const { searchFilters } = useSearch();
  const hasFetchedOnce = useRef(false);

  useEffect(() => {
    const store = useVenueStore.getState();
    store.setVenues([]);
    store.setLoading(true);
  }, []);

  useEffect(() => {
    if (hasFetchedOnce.current || venues.length > 0) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchVenues = async () => {
      setLoading(true);
      const limit = 100;
      let currentPage = 1;
      let allVenues = [];

      try {
        while (true) {
          const url = `${ENDPOINTS.venues}?limit=${limit}&page=${currentPage}&sort=created&sortOrder=desc&_owner=true&_bookings=true`;

          const res = await fetch(url, { signal });

          if (!res.ok) {
            throw new Error(`Failed to fetch venues: ${res.statusText}`);
          }

          const data = await res.json();

          if (!Array.isArray(data.data)) {
            throw new Error("Unexpected response format");
          }

          allVenues = [...allVenues, ...data.data];

          if (data.meta?.isLastPage || data.data.length < limit) {
            break;
          }

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
    };

    fetchVenues();
    return () => controller.abort();
  }, [setVenues, setLoading, venues]);

  const isSearchActive =
    !!searchFilters?.location?.trim() ||
    searchFilters?.guests > 1 ||
    (searchFilters?.dateFrom && searchFilters?.dateTo);

  const background = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div
          style={background}
          className="h-[480px] md:h-80 w-full flex items-center justify-center rounded-2xl shadow"
        >
          <SearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-xl animate-pulse shadow"
              />
            ))}
          </div>
        ) : isSearchActive ? (
          <SearchResults forceShowResults={true} />
        ) : (
          <FetchAllVenues />
        )}
      </div>
    </div>
  );
}

export default SearchPage;
