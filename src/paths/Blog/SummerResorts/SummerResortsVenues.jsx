import { useFetchVenues } from "../../../hooks/useFetchVenues";
import VenueCard from "../../../components/VenueCard";

const SummerResortsVenues = () => {
  const { venues, loading, error } = useFetchVenues("SummerResorts");

  if (loading) {
    return <div className="text-center py-8">Loading venues...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-16 mb-18">
      <h2 className="text-2xl font-bold text-espressoy text-center mb-8 p-8">
        Discover your perfect summer escape...
      </h2>

      {venues.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No summer resorts available at the moment.
        </p>
      )}
    </div>
  );
};

export default SummerResortsVenues;
