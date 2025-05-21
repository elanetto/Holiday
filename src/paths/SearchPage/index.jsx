import { useEffect, useState, useMemo } from "react";
import Fuse from "fuse.js";
import VenueList from "./../../components/VenueList";
import { useSearch } from "./../../contexts/useSearch";
import { SearchBar } from "./../../components/SearchBar";
import backgroundImage from "./../../assets/background/travel-street.jpg";
import { useVenueStore } from "./../../store/useVenueStore";

function SearchPage() {
  const { searchFilters } = useSearch();
  const { venues, isLoading } = useVenueStore();
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [searchError, setSearchError] = useState(null);

  const isSearchActive = !!searchFilters?.location || searchFilters?.guests > 1;

  const fuse = useMemo(() => {
    return new Fuse(venues, {
      keys: ["name", "location.city", "location.country"],
      threshold: 0.4,
    });
  }, [venues]);

  useEffect(() => {
    if (!isSearchActive) {
      setFilteredVenues(venues);
      return;
    }

    const { location = "", guests = 1 } = searchFilters || {};

    try {
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
  }, [searchFilters, venues, isSearchActive, fuse]);

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
        {isLoading ? (
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
                  Showing {filteredVenues.length} result
                  {filteredVenues.length !== 1 && "s"}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-espressoy mb-1">
                  Latest Venues
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {filteredVenues.length} venue
                  {filteredVenues.length !== 1 && "s"}
                </p>
              </>
            )}

            <VenueList venues={filteredVenues} />
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
