import { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../../../../utilities/constants";
import { toast } from "react-hot-toast";
import { useUser } from "../../../../contexts/useUser";
import { formatPrice } from "../../../../utilities/formatPrice";
import { useNavigate } from "react-router-dom";

const VenueBookingsTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { name, isVenueManager } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenueBookings = async () => {
      const token = localStorage.getItem("token");
      const apiKey = localStorage.getItem("apiKey");

      if (!isVenueManager || !name) return;

      try {
        const venuesRes = await axios.get(`${ENDPOINTS.profiles}/${name}/venues`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        });

        const venues = venuesRes.data.data;

        const venueBookingPromises = venues.map((venue) =>
          axios.get(`${ENDPOINTS.venues}/${venue.id}?_bookings=true`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey,
            },
          })
        );

        const venueBookingResponses = await Promise.all(venueBookingPromises);

        const allBookings = venueBookingResponses.flatMap((res, index) =>
          res.data.data.bookings.map((booking) => ({
            ...booking,
            venue: venues[index],
          }))
        );

        setBookings(allBookings);
      } catch (err) {
        console.error("Error fetching your venue bookings:", err);
        toast.error("Could not fetch bookings for your venues.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenueBookings();
  }, [name, isVenueManager]);

  const now = new Date();
  const upcoming = bookings.filter((b) => new Date(b.dateTo) >= now);

  const truncateTitle = (title, maxLength = 25) => {
    return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
  };

  if (loading) return <p className="p-4">Loading bookings...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-espressoy">
        Upcoming Venue Bookings
      </h2>

      {upcoming.length === 0 ? (
        <p className="text-sm text-gray-500">No upcoming bookings at your venues.</p>
      ) : (
        <ul className="space-y-4">
          {upcoming.map((booking) => (
            <li
              key={booking.id}
              onClick={() => navigate(`/venue/${booking.venue.id}`)}
              className="bg-white p-4 rounded shadow-sm border border-lightyellow flex flex-col sm:flex-row gap-4 cursor-pointer hover:shadow-md transition"
            >
              {booking.venue?.media?.[0]?.url && (
                <img
                  src={booking.venue.media[0].url}
                  alt={booking.venue.media[0].alt || "Venue image"}
                  className="w-full sm:w-1/2 h-40 object-cover rounded"
                />
              )}
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-lg text-espressoy break-words">
                  {truncateTitle(booking.venue?.name || "Unnamed Venue")}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(booking.dateFrom).toLocaleDateString()} → {" "}
                  {new Date(booking.dateTo).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  {booking.guests} guest{booking.guests !== 1 && "s"}
                </p>
                {booking.customer?.name && (
                  <p className="text-sm text-gray-600">
                    Booked by: <span className="font-medium">{booking.customer.name}</span>
                  </p>
                )}
                <p className="text-sm font-medium text-espressoy">
                  Total: {formatPrice(booking.guests * booking.venue.price)} NOK
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VenueBookingsTab;
