import { useEffect, useMemo, useState } from "react";
import { useVenueStore } from "./../store/useVenueStore";
import { useSearch } from "./../contexts/useSearch";
import Fuse from "fuse.js";

export function useFilteredVenues() {
  const { venues } = useVenueStore();
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
    try {
      if (!isSearchActive || !fuse) {
        setResults(Array.isArray(venues) ? venues : []);
        return;
      }

      const { location = "", guests = 1 } = searchFilters || {};
      const matches = fuse.search(location);
      const matchedVenues = matches.map((m) => m.item);
      const filtered = matchedVenues.filter((v) => v.maxGuests >= guests);
      setResults(filtered);
    } catch (err) {
      console.error("Fuzzy search failed:", err);
      setError("An error occurred while searching. Please try again.");
    }
  }, [searchFilters, venues, fuse, isSearchActive]);

  return { results, error, isSearchActive };
}
