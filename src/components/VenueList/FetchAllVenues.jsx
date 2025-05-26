import { useVenueStore } from "../../store/useVenueStore";
import VenueList from "./index";

export default function FetchAllVenues() {
  const { venues, isLoading } = useVenueStore();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-gray-200 rounded-xl animate-pulse shadow"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-espressoy">All Venues</h2>
        <p className="text-sm text-gray-600 mt-1">
          Showing {venues.length} result{venues.length !== 1 && "s"}
        </p>
      </div>
      <VenueList venues={venues} />
    </div>
  );
}
