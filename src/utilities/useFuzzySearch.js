import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";

/**
 * Fuzzy search hook using Fuse.js
 * @param {Array} venues - The list of venues to search within
 * @param {Object} searchFilters - Object with { location, guests }
 * @returns {Object} { results, error }
 */
export function useFuzzySearch(venues, searchFilters) {
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
    // ✅ Reset error on each new run
    setError(null);

    if (!Array.isArray(venues)) {
      const errorMessage = "Invalid input: 'venues' must be an array.";
      console.error(errorMessage);
      setError(errorMessage);
      setResults([]);
      return;
    }

    if (!fuse) {
      setResults([]);
      return;
    }

    const { location = "", guests = 1 } = searchFilters || {};

    try {
      if (!isSearchActive) {
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
  }, [venues, fuse, isSearchActive, searchFilters]);

  return { results, error };
}
