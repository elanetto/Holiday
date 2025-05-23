import { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../../../utilities/constants";
import VenueCard from "../../../components/VenueCard";

const UniqueVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVenues = async () => {
      const token = localStorage.getItem("token");
      const apiKey = localStorage.getItem("apiKey");
      const username = "UniqueVenues";

      if (!token || !apiKey) {
        setError("Missing authentication credentials.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `${ENDPOINTS.profiles}/${username}/venues`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );
        setVenues(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load venues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading venues...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-16 mb-18">
      <h2 className="text-2xl font-bold text-espressoy text-center mb-8 p-8">
        Experience something extraordinary...
      </h2>

      {venues.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No unique stays are available at the moment.
        </p>
      )}
    </div>
  );
};

export default UniqueVenues;
