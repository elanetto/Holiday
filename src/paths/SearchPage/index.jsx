import { useEffect, useState } from "react";
import { useFuzzySearch } from "./../../utilities/useFuzzySearch";
import { useSearch } from "./../../contexts/useSearch";
import { useVenueStore } from "./../../store/useVenueStore";
import { SearchBar } from "./../../components/SearchBar";
import VenueList from "./../../components/VenueList";
import backgroundImage from "./../../assets/background/travel-street.jpg";
import { ENDPOINTS } from "./../../utilities/constants";

function SearchPage() {
  const { searchFilters } = useSearch();
  const { venues, loading, setVenues, setLoading } = useVenueStore();

  const [activeResults, setActiveResults] = useState([]);

  const isSearchActive = !!searchFilters?.location || searchFilters?.guests > 1;

  const { results: fuzzyResults, error: searchError } = useFuzzySearch(
    venues,
    searchFilters
  );

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
  }, [setVenues, setLoading]);

  // Always show all venues if search is not active or no filters
  useEffect(() => {
    if (
      !searchFilters?.location &&
      (!searchFilters?.guests || searchFilters?.guests <= 1)
    ) {
      setActiveResults(venues);
    } else {
      setActiveResults(fuzzyResults);
    }
  }, [searchFilters, venues, fuzzyResults]);

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

            {isSearchActive ? (
              <>
                <h2 className="text-2xl font-bold text-espressoy mb-1">
                  Search results
                  {searchFilters.location && ` for "${searchFilters.location}"`}
                  {searchFilters.guests > 1 &&
                    ` with at least ${searchFilters.guests} guests`}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Showing {activeResults.length} result
                  {activeResults.length !== 1 && "s"}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-espressoy mb-1">
                  Latest Venues
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {activeResults.length} venue
                  {activeResults.length !== 1 && "s"}
                </p>
              </>
            )}

            <VenueList venues={activeResults} />
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
