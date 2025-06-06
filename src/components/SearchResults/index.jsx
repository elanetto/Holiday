import { useFilteredVenues } from "../../utilities/useFilteredVenues";
import { useSearch } from "../../contexts/useSearch";
import VenueList from "../VenueList";
import { useMemo } from "react";

export default function SearchResults({ forceShowResults = false }) {
  const { searchFilters } = useSearch();
  const location = searchFilters?.location || "";
  const guests = searchFilters?.guests || 1;
  const selectedFrom = searchFilters?.dateFrom
    ? new Date(searchFilters.dateFrom)
    : null;
  const selectedTo = searchFilters?.dateTo
    ? new Date(searchFilters.dateTo)
    : null;

  const isSearchActive =
    !!location.trim() || guests > 1 || (selectedFrom && selectedTo);

  const { results, error, isReady, loading } = useFilteredVenues({
    forceShowResults,
  });
  const shouldShowResults = forceShowResults || isSearchActive;

  const validResults = useMemo(() => {
    return Array.isArray(results)
      ? results.filter((v) => v && v.id)
      : [];
  }, [results]);

  if (error) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center text-center min-h-[200px]">
        <p className="text-red-500 text-center mb-4">{error}</p>
      </div>
    );
  }

  if (loading || (!shouldShowResults && !isReady)) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center text-center min-h-[200px]">
        <div className="w-16 h-16 border-4 border-sunny border-t-transparent rounded-full animate-spin shadow-lg" />
        <p className="text-gray-600 mt-4 text-sm">Loading venues...</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-espressoy">
          {isSearchActive ? "You searched" : "Latest Venues"}
          {location && ` for "${location}"`}
          {guests > 1 && ` with at least ${guests} guests`}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Showing {validResults.length} result
          {validResults.length !== 1 && "s"}
        </p>
      </div>

      <VenueList
        venues={validResults}
        selectedFrom={selectedFrom}
        selectedTo={selectedTo}
      />
    </div>
  );
}
