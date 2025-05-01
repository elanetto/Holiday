import { useEffect, useState } from "react";
import VenueList from "./components/VenueList";
import { useSearch } from "./contexts/useSearch";
import { ENDPOINTS } from "./utilities/constants";

function App() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { searchFilters } = useSearch();

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      let firstBatch = [];
      let restBatch = [];
      const limit = 100;

      try {
        // Fetch initial batch (fast!)
        const firstPageUrl = `${ENDPOINTS.venues}?limit=${limit}&page=1&sort=created&sortOrder=desc&_owner=true`;
        const res = await fetch(firstPageUrl);
        const data = await res.json();
        firstBatch = data.data;
        setVenues(firstBatch);
        setFilteredVenues(firstBatch);

        // Fetch the rest in the background
        let currentPage = 2;
        let hasNextPage = data.meta?.isLastPage === false;

        const fetchRest = async () => {
          while (hasNextPage) {
            const nextPageUrl = `${ENDPOINTS.venues}?limit=${limit}&page=${currentPage}&sort=created&sortOrder=desc&_owner=true`;
            const res = await fetch(nextPageUrl);
            const data = await res.json();

            restBatch = [...restBatch, ...data.data];
            setVenues((prev) => [...prev, ...data.data]);
            setFilteredVenues((prev) => [...prev, ...data.data]);

            hasNextPage = data.meta?.isLastPage === false;
            currentPage++;
          }
        };

        fetchRest().catch((err) => {
          console.error("Error fetching additional venues:", err);
        });
      } catch (err) {
        console.error("Error loading venues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSearchResults = async () => {
      const { location = "", guests = 1 } = searchFilters || {};

      // If there's no location search, just show all local venues
      if (!location) {
        setFilteredVenues(venues.length > 0 ? venues : []);
        setSearchError(null);
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
        setSearchError(null);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Search request aborted");
          return;
        }
        console.error("Error searching venues:", err);
        setSearchError(
          "An error occurred while searching for venues. Please try again."
        );
      }
    };

    fetchSearchResults();

    return () => controller.abort(); // Cancel request on unmount or new search
  }, [searchFilters, venues]);

  return (
    <div className="min-h-screen bg-creamy w-full">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-center mt-10">Loading venues...</p>
        ) : (
          <>
            {searchError && (
              <p className="text-red-500 text-center mb-4">{searchError}</p>
            )}

            {searchFilters?.location || searchFilters?.guests > 1 ? (
              <h2 className="text-2xl font-bold text-espressoy mb-4">
                Search results
                {searchFilters.location && ` for "${searchFilters.location}"`}
                {searchFilters.guests > 1 &&
                  ` with at least ${searchFilters.guests} guests`}
              </h2>
            ) : (
              <h2 className="text-2xl font-bold text-espressoy mb-4">
                Latest Venues
              </h2>
            )}

            <VenueList venues={filteredVenues} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
