import { useFilteredVenues } from "../../utilities/useFilteredVenues";
import { useSearch } from "../../contexts/useSearch";
import { useVenueStore } from "../../store/useVenueStore";
import VenueList from "../VenueList";

export default function SearchResults({ forceShowResults = false }) {
  const { searchFilters } = useSearch();
  const { isLoading } = useVenueStore();
  const location = searchFilters?.location || "";
  const guests = searchFilters?.guests || 1;
  const isSearchActive = !!location.trim() || guests > 1;

  const { results, error, isReady } = useFilteredVenues({ forceShowResults });
  const shouldShowResults = forceShowResults || isSearchActive;

  if (isLoading || !isReady) {
    return <p className="text-center mt-10">Loading venues...</p>;
  }
  

  if (!shouldShowResults) return null;

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
          Showing {results.length} result
          {results.length !== 1 && "s"}
        </p>
      </div>

      <VenueList venues={results} />
    </div>
  );
}
