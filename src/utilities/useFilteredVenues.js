// src/utilities/useFilteredVenues.js

import { useEffect, useMemo, useState } from "react";
import { useVenueStore } from "../store/useVenueStore";
import { useSearch } from "../contexts/useSearch";
import Fuse from "fuse.js";

export function useFilteredVenues({ forceShowResults = false } = {}) {
  const { venues, isLoading } = useVenueStore();
  const { searchFilters } = useSearch();
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const { dateFrom, dateTo } = useMemo(() => {
    const rawFrom = searchFilters?.dateFrom;
    const rawTo = searchFilters?.dateTo;
    return {
      dateFrom: rawFrom ? new Date(rawFrom) : null,
      dateTo: rawTo ? new Date(rawTo) : null,
    };
  }, [searchFilters?.dateFrom, searchFilters?.dateTo]);

  const { location, guests } = useMemo(() => ({
    location: searchFilters?.location?.toLowerCase?.() || "",
    guests: searchFilters?.guests || 1,
  }), [searchFilters?.location, searchFilters?.guests]);

  const isSearchActive =
    !!location.trim() || guests > 1 || (dateFrom && dateTo);

  const fuse = useMemo(() => {
    if (!Array.isArray(venues)) return null;
    return new Fuse(venues, {
      keys: ["name", "location.city", "location.country"],
      threshold: 0.4,
    });
  }, [venues]);

  useEffect(() => {
    setError(null);

    if (!Array.isArray(venues)) {
      const errorMessage = "Invalid input: 'venues' must be an array.";
      console.error(errorMessage);
      setError(errorMessage);
      setResults([]);
      return;
    }

    try {
      if (!isSearchActive && !forceShowResults) {
        setResults([]);
        return;
      }

      const matchedVenues = fuse
        ? fuse.search(location).map((r) => r.item)
        : venues;

      const enrichedVenues = matchedVenues.map((venue) => {
        const venueBookings = venue.bookings || [];

        const isBooked = dateFrom && dateTo
          ? venueBookings.some((booking) => {
              const bookingStart = new Date(booking.dateFrom);
              const bookingEnd = new Date(booking.dateTo);
              return bookingStart < dateTo && dateFrom < bookingEnd;
            })
          : false;

        const tooSmallForGuests = venue.maxGuests < guests;

        return {
          ...venue,
          isBookedForSelectedDates: isBooked,
          tooSmallForGuests,
        };
      });

      setResults(enrichedVenues);
    } catch (err) {
      console.error("Fuzzy search failed:", err);
      setError("An error occurred while searching. Please try again.");
    }
  }, [venues, fuse, location, guests, dateFrom, dateTo, isSearchActive, forceShowResults]);

  const isReady = !isLoading && Array.isArray(venues) && venues.length > 0;

  return { results, error, isSearchActive, isReady, loading: isLoading };
}
