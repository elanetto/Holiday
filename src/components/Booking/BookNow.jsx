import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookNow = ({ venue }) => {
  const navigate = useNavigate();
  const [dates, setDates] = useState([null, null]);
  const [guests, setGuests] = useState(1);
  const [startDate, endDate] = dates;

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
    const days = Math.max(
      1,
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
    );
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

      {/* Date Range Picker */}
      <div className="w-full">
        <label className="text-sm block mb-1">Booking Dates</label>
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => setDates(update)}
          placeholderText="Select dates"
          className="p-2 rounded-xl w-full cursor-pointer text-center bg-white border border-espressoy"
          calendarClassName="bg-white rounded-lg shadow-lg p-4"
          minDate={new Date()}
          dateFormat="d MMM"
          popperClassName="z-[9999]"
        />
      </div>

      {/* Guests */}
      <div>
        <label className="text-sm block mb-1">Guests</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGuests((g) => Math.max(g - 1, 1))}
            className="px-3 py-1 rounded-full hover:bg-orangey hover:text-white bg-white border border-espressoy"
          >
            -
          </button>
          <span>{guests}</span>
          <button
            type="button"
            onClick={() =>
              setGuests((g) => Math.min(g + 1, venue.maxGuests))
            }
            className="px-3 py-1 rounded-full hover:bg-orangey hover:text-white bg-white border border-espressoy"
          >
            +
          </button>
        </div>
        <p className="text-xs mt-1 text-gray-500">
          Max guests: {venue.maxGuests}
        </p>
      </div>

      {/* Total Price */}
      <div className="text-sm font-semibold text-espressoy">
        Total: NOK {calculateTotal().toLocaleString()}
      </div>

      {/* Button */}
      <button
        onClick={handleProceedToCheckout}
        disabled={!startDate || !endDate}
        className={`w-full py-2 rounded-full font-semibold transition cursor-pointer ${
          !startDate || !endDate
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-sunny hover:bg-orangey hover:text-white text-espressoy"
        }`}
      >
        Continue to Checkout
      </button>
    </div>
  );
};

export default BookNow;
