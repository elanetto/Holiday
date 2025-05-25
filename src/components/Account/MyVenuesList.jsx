import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../utilities/constants";
import { useUser } from "../../contexts/useUser";
import { PLACEHOLDER_VENUE } from "../../utilities/placeholders";
import { toast } from "react-hot-toast";
import axios from "axios";
import ConfirmModal from "../Modals/ConfirmModal";

const MyVenuesList = () => {
  const { name, isLoggedIn } = useUser();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      if (!isLoggedIn) return;

      try {
        const token = localStorage.getItem("token");
        const apiKey = localStorage.getItem("apiKey");

        const res = await axios.get(`${ENDPOINTS.profiles}/${name}/venues`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        });

        setVenues(res.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch your venues.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [name, isLoggedIn]);

  const handleDeleteClick = (venueId) => {
    setVenueToDelete(venueId);
    setShowConfirm(true);
  };

  const confirmDeleteVenue = async () => {
    if (!venueToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const apiKey = localStorage.getItem("apiKey");

      await axios.delete(`${ENDPOINTS.venues}/${venueToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
      });

      toast.success("Venue deleted");
      setVenues((prev) => prev.filter((v) => v.id !== venueToDelete));
    } catch (err) {
      toast.error("Failed to delete venue");
      console.error(err);
    } finally {
      setShowConfirm(false);
      setVenueToDelete(null);
    }
  };

  if (loading) return <p>Loading your venues...</p>;
  if (!venues.length)
    return (
      <div className="text-center mt-12">
        <p className="mb-4 text-espressoy text-sm">
          You haven't created any venues yet.
        </p>
        <button
          onClick={() => navigate(`/account/${name}?tab=new`)}
          className="bg-sunny text-espressoy px-5 py-2 rounded-full font-semibold hover:bg-orangey hover:text-white transition cursor-pointer"
        >
          Create your first venue
        </button>
      </div>
    );

  return (
    <>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="border rounded-xl p-4 bg-white shadow hover:shadow-md transition"
          >
            <img
              src={venue.media?.[0]?.url || PLACEHOLDER_VENUE}
              alt={venue.media?.[0]?.alt || venue.name}
              className="w-full h-48 object-cover rounded"
            />
            <h3
              className="mt-2 text-lg font-bold text-espressoy truncate"
              title={venue.name}
            >
              {venue.name}
            </h3>

            <p className="text-sm text-gray-600">
              {venue.location.city}, {venue.location.country}
            </p>
            <p className="text-sm mt-1">
              💰 {venue.price} NOK/night · 👥 Max {venue.maxGuests}
            </p>
            <div className="mt-3 flex justify-between items-center">
              <button
                onClick={() => navigate(`/venue/${venue.id}`)}
                className="text-sunny font-semibold hover:underline"
              >
                View
              </button>
              <div className="flex gap-2">
                <Link
                  to={`/edit-venue/${venue.id}`}
                  className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteClick(venue.id)}
                  className="px-2 py-1 text-sm bg-error text-white rounded hover:bg-red-700"
                  aria-label={`Delete ${venue.name}`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Delete Venue"
          message="Are you sure you want to delete this venue? This action cannot be undone."
          onConfirm={confirmDeleteVenue}
          onCancel={() => {
            setShowConfirm(false);
            setVenueToDelete(null);
          }}
        />
      )}
    </>
  );
};

export default MyVenuesList;
