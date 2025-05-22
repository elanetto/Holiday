import { useEffect, useRef } from "react";
import { useSearch } from "../../contexts/useSearch";
import { useVenueStore } from "../../store/useVenueStore";
import { useFilteredVenues } from "../../utilities/useFilteredVenues";
import { SearchBar } from "../../components/SearchBar";
import VenueList from "../../components/VenueList";
import backgroundImage from "../../assets/background/travel-street.jpg";
import { ENDPOINTS } from "../../utilities/constants";

function SearchPage() {
  const { searchFilters } = useSearch();
  const { setVenues, venues, setLoading, loading } = useVenueStore();
  const hasFetchedOnce = useRef(false);

  // ✅ Fetch all venues only once (even if filters change)
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
          const url = `${ENDPOINTS.venues}?limit=${limit}&page=${currentPage}&sort=created&sortOrder=desc&_owner=true`;

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

  // ✅ Filter venues AFTER fetching
  const {
    results: activeResults,
    error: searchError,
    isSearchActive,
  } = useFilteredVenues();

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
          className="h-80 w-full flex items-center justify-center rounded-2xl shadow"
        >
          <SearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-center mt-10">Fetching venues. Please wait...</p>
        ) : (
          <>
            {searchError && (
              <p className="text-red-500 text-center mb-4">{searchError}</p>
            )}

            <h2 className="text-2xl font-bold text-espressoy mb-1">
              {isSearchActive ? "Search results" : "Latest Venues"}
              {searchFilters?.location && ` for "${searchFilters.location}"`}
              {searchFilters?.guests > 1 &&
                ` with at least ${searchFilters.guests} guests`}
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Showing {activeResults.length} result
              {activeResults.length !== 1 && "s"}
            </p>

            <VenueList venues={activeResults} />
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
