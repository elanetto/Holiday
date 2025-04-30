import { useEffect, useState } from "react";
import VenueCard from "../VenueCard";

const VenueList = ({ venues = [] }) => {
  const [sortedVenues, setSortedVenues] = useState([]);
  const [visibleVenues, setVisibleVenues] = useState([]);
  const [sortBy, setSortBy] = useState("created");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 21;

  // Sort venues
  useEffect(() => {
    if (!venues.length) {
      setSortedVenues([]);
      return;
    }

    const sorted = [...venues].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "created" || sortBy === "updated") {
        aVal = new Date(aVal || 0);
        bVal = new Date(bVal || 0);
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setSortedVenues(sorted);
    setVisibleVenues(sorted.slice(0, limit)); // Show first page immediately
  }, [venues, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedVenues.length / limit);
  const start = (page - 1) * limit;

  useEffect(() => {
    setIsLoadingMore(true);
    const timeout = setTimeout(() => {
      setVisibleVenues(sortedVenues.slice(start, start + limit));
      setIsLoadingMore(false);
    }, 300); // Simulate async loading

    return () => clearTimeout(timeout);
  }, [sortedVenues, page]);

  useEffect(() => {
    const preloadNextPage = () => {
      const nextPageStart = (page + 1 - 1) * limit;
      const nextVenues = sortedVenues.slice(
        nextPageStart,
        nextPageStart + limit
      );
      if (nextVenues.length) {
        // you could cache this if desired
      }
    };

    preloadNextPage();
  }, [page, sortedVenues]);

  return (
    <div className="p-4">
      {/* Sorting Controls */}
      <div className="flex flex-wrap justify-end mb-4 gap-2">
        <div className="flex items-center gap-2">
          <label className="text-sm">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="created">Newest</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Venue Cards */}
      {visibleVenues.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          No venues found. Try adjusting your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {visibleVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}

      {isLoadingMore && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueList;
