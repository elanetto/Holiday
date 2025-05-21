import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import { useSearch } from "./../../contexts/useSearch";
import { ENDPOINTS } from "./../../utilities/constants";
import VenueList from "./../../components/VenueList";

export default function SearchResults() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchError, setSearchError] = useState(null);
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
    if (!isSearchActive) return;

    const { location = "", guests = 1 } = searchFilters || {};

    try {
      const fuse = new Fuse(venues, {
        keys: ["name", "location.city", "location.country"],
        threshold: 0.4,
      });

      const results = fuse.search(location);
      const matchedVenues = results.map((result) => result.item);

      const filtered = matchedVenues.filter(
        (venue) => venue.maxGuests >= guests
      );

      setFilteredVenues(filtered);
    } catch (err) {
      console.error("Fuzzy search failed:", err);
      setSearchError("An error occurred while searching. Please try again.");
    }
  }, [searchFilters, venues, isSearchActive]);

  if (!isSearchActive) return null;

  return (
    <div className="mt-10">
      {loading ? (
        <p className="text-center mt-10">Loading venues...</p>
      ) : (
        <>
          {searchError && (
            <p className="text-red-500 text-center mb-4">{searchError}</p>
          )}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-espressoy">
              You searched
              {searchFilters.location && ` for "${searchFilters.location}"`}
              {searchFilters.guests > 1 &&
                ` with at least ${searchFilters.guests} guests`}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredVenues.length} result
              {filteredVenues.length !== 1 && "s"}
            </p>
          </div>
          <VenueList venues={filteredVenues} />
        </>
      )}
    </div>
  );
}
