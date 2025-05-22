import { useEffect, useMemo, useState } from "react";
import { useVenueStore } from "../store/useVenueStore";
import { useSearch } from "../contexts/useSearch";
import Fuse from "fuse.js";

export function useFilteredVenues({ forceShowResults = false } = {}) {
  const { venues, isLoading } = useVenueStore();
  const { searchFilters } = useSearch();
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const isSearchActive =
    !!searchFilters?.location?.trim() || searchFilters?.guests > 1;

  const fuse = useMemo(() => {
    if (!Array.isArray(venues)) return null;
    return new Fuse(venues, {
      keys: ["name", "location.city", "location.country"],
      threshold: 0.4,
    });
  }, [venues]);

  useEffect(() => {
    setError(null); // Clear previous errors

    if (!Array.isArray(venues)) {
      const errorMessage = "Invalid input: 'venues' must be an array.";
      console.error(errorMessage);
      setError(errorMessage);
      setResults([]);
      return;
    }

    const { location = "", guests = 1 } = searchFilters || {};

    try {
      if (!isSearchActive && !forceShowResults) {
        setResults([]);
      } else if (!isSearchActive && forceShowResults) {
        setResults(venues);
      } else {
        const matches = fuse.search(location);
        const matchedVenues = matches.map((m) => m.item);
        const filtered = matchedVenues.filter((v) => v.maxGuests >= guests);
        setResults(filtered);
      }
    } catch (err) {
      console.error("Fuzzy search failed:", err);
      setError("An error occurred while searching. Please try again.");
    }
  }, [venues, fuse, searchFilters, isSearchActive, forceShowResults]);

  const isReady = !isLoading && Array.isArray(venues) && venues.length > 0;

  return { results, error, isSearchActive, isReady };
}
