import { useFilteredVenues } from "../../utilities/useFilteredVenues";
import { useSearch } from "../../contexts/useSearch";
import VenueList from "../VenueList";

export default function SearchResults({ forceShowResults = false }) {
  const { searchFilters } = useSearch();
  const location = searchFilters?.location || "";
  const guests = searchFilters?.guests || 1;
  const isSearchActive = !!location.trim() || guests > 1;

  const { results, error, isReady, loading } = useFilteredVenues({ forceShowResults });
  const shouldShowResults = forceShowResults || isSearchActive;

  // Filter out any undefined or null venues to avoid rendering crashes
  const validResults = Array.isArray(results) ? results.filter((v) => v && v.id) : [];

  if (loading || (!shouldShowResults && !isReady)) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center text-center min-h-[200px]">
        <div className="w-16 h-16 border-4 border-sunny border-t-transparent rounded-full animate-spin shadow-lg" />
        <p className="text-gray-600 mt-4 text-sm">Loading venues...</p>
      </div>
    );
  }

  if (!shouldShowResults || !isReady) return null;

  return (
    <div className="mt-10">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="mb-4">
        <h2 className="text-2xl font-bold text-espressoy">
          {isSearchActive ? "You searched" : "Latest Venues"}
          {location && ` for "${location}"`}
          {guests > 1 && ` with at least ${guests} guests`}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Showing {validResults.length} result{validResults.length !== 1 && "s"}
        </p>
      </div>

      <VenueList venues={validResults} />
    </div>
  );
}
