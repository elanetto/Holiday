import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookNow = ({ venue }) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);

  const token = localStorage.getItem("token");

  if (!venue || !venue.id || typeof venue.maxGuests === "undefined") {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        Booking not available. Venue data is missing.
      </div>
    );
  }

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

  const calculateTotal = () => {
    if (!startDate || !endDate || !guests) return 0;
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return days * guests * venue.price;
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout", {
      state: {
        venue,
        startDate,
        endDate,
        guests,
        totalPrice: calculateTotal(),
      },
    });
  };

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

      <div className="text-sm font-semibold text-espressoy">
        Total: NOK {calculateTotal().toLocaleString()}
      </div>

      <button
        onClick={handleProceedToCheckout}
        disabled={!startDate || !endDate}
        className="w-full bg-sunny hover:bg-orangey hover:text-white text-espressoy py-2 rounded-full font-semibold"
      >
        Continue to Checkout
      </button>
    </div>
  );
};

export default BookNow;
