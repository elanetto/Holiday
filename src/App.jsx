import { useEffect, useState } from "react";
import VenueList from "./components/VenueList";
import { useSearch } from "./contexts/useSearch";
import { VENUE_UTILS } from "./utilities/constants";

function App() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const { searchFilters } = useSearch(); // 👈 global search filters

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(VENUE_UTILS.latest);

        if (!res.ok) {
          throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setVenues(data.data);
        setFilteredVenues(data.data); // default = all
      } catch (err) {
        console.error("Error loading venues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    if (!searchFilters || !venues.length) {
      setFilteredVenues(venues);
      return;
    }

    const { location = "", guests = 1 } = searchFilters;
    const searchTerm = location.toLowerCase();

    const results = venues.filter((venue) => {
      const name = venue.name?.toLowerCase() || "";
      const description = venue.description?.toLowerCase() || "";
      const altTexts = (venue.media || [])
        .map((mediaItem) => mediaItem.alt?.toLowerCase() || "")
        .join(" ");
      const locationFields = [
        venue.location?.city,
        venue.location?.country,
        venue.location?.address,
        venue.location?.continent,
        venue.location?.zip,
      ]
        .map((part) => part?.toLowerCase() || "")
        .join(" ");

      const fullText = `${name} ${description} ${altTexts} ${locationFields}`;
      const matchText = fullText.includes(searchTerm);
      const matchGuests = venue.maxGuests >= guests;

      return matchText && matchGuests;
    });

    setFilteredVenues(results);
  }, [searchFilters, venues]);

  return (
    <div className="min-h-screen bg-creamy w-full">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-center mt-10">Loading venues...</p>
        ) : (
          <>
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
