import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { format, differenceInDays, isBefore } from "date-fns";
import { toast } from "react-hot-toast";
import { PLACEHOLDER_VENUE } from "../../utilities/placeholders";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");
  const username = localStorage.getItem("name");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `https://v2.api.noroff.dev/holidaze/profiles/${username}/bookings?_venue=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );

        // Filter to only include bookings that ended yesterday or earlier
        const today = new Date();
        const pastBookings = response.data.data.filter((booking) => {
          return isBefore(new Date(booking.dateTo), today);
        });

        setBookings(pastBookings);
      } catch (error) {
        console.error("Failed to fetch booking history", error);
        toast.error("Could not load booking history.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, apiKey, username]);

  if (loading) return <p className="p-4">Loading booking history...</p>;

  if (!bookings.length)
    return (
      <p className="p-4 text-gray-600">
        You have no past bookings yet. Once you've completed bookings, they’ll show up here.
      </p>
    );

  return (
    <div className="space-y-6">
      {bookings.map((booking) => {
        const venue = booking.venue;
        const nights = differenceInDays(
          new Date(booking.dateTo),
          new Date(booking.dateFrom)
        );

        return (
          <Link
            to={`/venue/${venue.id}`}
            key={booking.id}
            className="block border rounded-xl shadow hover:shadow-md transition bg-white overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-4">
              <img
                src={venue.media?.[0]?.url || PLACEHOLDER_VENUE}
                alt={venue.media?.[0]?.alt || venue.name}
                className="w-full h-48 object-cover sm:col-span-1"
              />
              <div className="p-4 sm:col-span-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-espressoy">{venue.name}</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(booking.dateFrom), "dd MMM yyyy")} →{" "}
                    {format(new Date(booking.dateTo), "dd MMM yyyy")} ({nights}{" "}
                    night{nights > 1 ? "s" : ""})
                  </p>
                  <p className="text-sm text-gray-600">Guests: {booking.guests}</p>
                </div>
                <p className="text-right font-bold text-espressoy mt-2">
                  Total: {venue.price * nights} NOK
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default BookingHistory;
