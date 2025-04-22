import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../../utilities/constants";
import VenueForm from "../../components/Account/VenueForm";

export default function EditVenuePage() {
  const { id } = useParams();
  const [venueData, setVenueData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await fetch(
          `${ENDPOINTS.venueById(id, {
            includeOwner: true,
            includeBookings: false,
          })}`
        );
        const data = await res.json();
        setVenueData(data.data);
      } catch (err) {
        console.error("Failed to load venue for editing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  if (loading) return <p className="p-4">Loading venue for editing...</p>;
  if (!venueData) return <p className="p-4">Venue not found.</p>;

  return (
    <div className="min-h-screen bg-creamy py-8 px-4">
      <VenueForm mode="edit" venue={venueData} />
    </div>
  );
}
