import { useEffect, useMemo, useState } from "react";
import { useVenueStore } from "../store/useVenueStore";
import Fuse from "fuse.js";

/**
 * Filters venues using fuzzy search based on the provided searchFilters.
 * Falls back to returning all venues if no search is active.
 */
export function useFilteredVenues(searchFilters) {
  const { venues } = useVenueStore();
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const location = searchFilters?.location || "";
  const guests = searchFilters?.guests || 1;
  const isSearchActive = !!location.trim() || guests > 1;

  const fuse = useMemo(() => {
    if (!Array.isArray(venues)) {
      const errorMessage = "Invalid input: 'venues' must be an array.";
      console.error(errorMessage);
      setError(errorMessage);
      setResults([]);
      return null;
    }

    return new Fuse(venues, {
      keys: ["name", "location.city", "location.country"],
      threshold: 0.4,
    });
  }, [venues]);

  useEffect(() => {
    try {
      if (!isSearchActive || !fuse) {
        setResults(Array.isArray(venues) ? venues : []);
        return;
      }

      const matches = fuse.search(location);
      const matchedVenues = matches.map((m) => m.item);
      const filtered = matchedVenues.filter((v) => v.maxGuests >= guests);
      setResults(filtered);
    } catch (err) {
      console.error("Fuzzy search failed:", err);
      setError("An error occurred while searching. Please try again.");
    }
  }, [location, guests, venues, fuse, isSearchActive]);

  return { results, error, isSearchActive };
}
