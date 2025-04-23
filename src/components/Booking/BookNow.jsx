import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookNow = ({ venue }) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

  // 🛡️ Check for venue object
  if (!venue || !venue.id || typeof venue.maxGuests === "undefined") {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        Booking not available. Venue data is missing.
      </div>
    );
  }

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select a valid date range.");
      return;
    }

    const bookingData = {
      dateFrom: startDate.toISOString(),
      dateTo: endDate.toISOString(),
      guests,
      venueId: venue.id,
    };

    try {
      setLoading(true);
      await axios.post(
        "https://v2.api.noroff.dev/holidaze/bookings",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Booking successful! 🎉");
      navigate(`/account/${localStorage.getItem("name")}`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        `Error: ${err.response?.status || "Unknown error"}`;
      toast.error(`Booking failed. ${errorMessage}`);
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <p className="text-center mt-6 text-sm text-espressoy">
        Please{" "}
        <a href="/login" className="text-orangey font-semibold underline">
          log in
        </a>{" "}
        to book this venue.
      </p>
    );
  }

  return (
    <div className="mt-8 p-4 border border-espressoy rounded-xl bg-white space-y-4 shadow">
      <h2 className="text-xl font-semibold text-espressoy">Book This Venue</h2>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <label className="text-sm block mb-1">From</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="w-full border border-espressoy p-2 rounded"
            placeholderText="Select start date"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm block mb-1">To</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="w-full border border-espressoy p-2 rounded"
            placeholderText="Select end date"
          />
        </div>
      </div>

      <div>
        <label className="text-sm block mb-1">Guests</label>
        <input
          type="number"
          min={1}
          max={venue.maxGuests}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full border border-espressoy p-2 rounded"
        />
        <p className="text-xs mt-1 text-gray-500">
          Max guests: {venue.maxGuests}
        </p>
      </div>

      <button
        onClick={handleBooking}
        disabled={loading}
        className="w-full bg-sunny hover:bg-orangey hover:text-white text-espressoy py-2 rounded-full font-semibold"
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
    </div>
  );
};

export default BookNow;
