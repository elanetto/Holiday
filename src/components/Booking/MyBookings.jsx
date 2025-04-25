import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ENDPOINTS } from "../../utilities/constants";
import { PLACEHOLDER_VENUE } from "../../utilities/placeholders";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");
  const user = localStorage.getItem("name");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `${ENDPOINTS.profiles}/${user}/bookings?_venue=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset to midnight

        const futureBookings = response.data.data.filter((booking) => {
          const bookingStart = new Date(booking.dateFrom);
          return bookingStart >= today;
        });

        setBookings(futureBookings);
      } catch (err) {
        toast.error("Failed to load bookings.");
        console.error("Bookings fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token && user) {
      fetchBookings();
    }
  }, [token, apiKey, user]);

  const calculateNights = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate - startDate;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (!token) {
    return (
      <p className="p-4 text-center text-espressoy">
        Please log in to view your bookings.
      </p>
    );
  }

  if (loading) return <p className="p-4">Loading your bookings...</p>;

  if (!bookings.length)
    return <p className="p-4">You don't have any bookings yet.</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-espressoy">My Bookings</h2>
      <div className="space-y-6">
        {bookings.map((booking) => {
          const nights = calculateNights(booking.dateFrom, booking.dateTo);
          const total = nights * booking.venue.price;
          const image = booking.venue.media?.[0]?.url || PLACEHOLDER_VENUE;
          const alt = booking.venue.media?.[0]?.alt || booking.venue.name;

          return (
            <Link
              to={`/venue/${booking.venue.id}`}
              key={booking.id}
              className="flex gap-4 p-4 border border-espressoy rounded-lg shadow bg-white hover:bg-creamy transition"
            >
              <img
                src={image}
                alt={alt}
                className="w-40 h-32 object-cover rounded-lg"
              />
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-semibold text-espressoy">
                  {booking.venue.name}
                </h3>
                <p className="text-sm text-gray-600">
                  📅 {new Date(booking.dateFrom).toLocaleDateString()} →{" "}
                  {new Date(booking.dateTo).toLocaleDateString()} ({nights}{" "}
                  nights)
                </p>
                <p className="text-sm text-gray-600">
                  👥 {booking.guests} guests
                </p>
                <p className="font-bold text-base text-espressoy">
                  Total: NOK {total.toLocaleString()}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;
