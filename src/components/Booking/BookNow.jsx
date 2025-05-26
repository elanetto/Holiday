import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { useSearch } from "../../contexts/useSearch";
import { formatPrice } from "../../utilities/formatPrice";
import AlertModal from "../Modals/AlertModal";

const BookNow = ({ venue }) => {
  const navigate = useNavigate();
  const { searchFilters } = useSearch();

  const [dates, setDates] = useState([
    searchFilters?.checkIn ? new Date(searchFilters.checkIn) : null,
    searchFilters?.checkOut ? new Date(searchFilters.checkOut) : null,
  ]);
  const [guests, setGuests] = useState(searchFilters?.guests || 1);

  const [startDate, endDate] = dates;
  const [showAlert, setShowAlert] = useState(false);

  const token = localStorage.getItem("token");

  // 🟡 Extract booked date intervals
  const bookedRanges =
    venue.bookings?.map((booking) => ({
      start: new Date(booking.dateFrom),
      end: new Date(new Date(booking.dateTo).getTime() + 24 * 60 * 60 * 1000),
    })) || [];

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

  const isDateBooked = (date) =>
  bookedRanges.some(
    (range) => date >= range.start && date <= range.end
  );


  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleProceedToCheckout();
        }}
        className="mt-0 p-6 bg-sunny rounded-2xl space-y-6 max-w-2xl mx-auto flex flex-col items-center justify-center"
      >
        <h2 className="text-xl font-semibold text-espressoy">
          Book This Venue
        </h2>

        {/* Date Range */}
        <div className="flex flex-col items-center bg-white px-4 py-2 rounded-2xl w-full">
          <label className="text-xs font-semibold text-espressoy flex items-center gap-1 mb-1">
            <FaCalendarAlt />
            Booking Dates
          </label>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              if (!update[0] || !update[1]) {
                setDates(update);
                return;
              }

              const [newStart, newEnd] = update;

              const isOverlapping = bookedRanges.some((range) => {
                return newStart <= range.end && newEnd >= range.start;
              });

              if (isOverlapping) {
                setDates([null, null]);
                setShowAlert(true); // Show the modal instead of alert()
              } else {
                setDates(update);
              }
            }}
            placeholderText="Select dates"
            className="bg-transparent text-sm text-center font-medium focus:outline-none w-full cursor-pointer"
            minDate={new Date()}
            dateFormat="MMM d"
            popperClassName="z-[9999]"
            excludeDateIntervals={bookedRanges}
            showDisabledMonthNavigation
            preventOpenOnFocus
            dayClassName={(date) => (isDateBooked(date) ? "booked-date" : undefined)}

          />
        </div>

        {/* Guests */}
        <div className="flex flex-col bg-white items-center px-4 py-2 rounded-2xl w-full">
          <label className="text-xs font-semibold text-espressoy flex items-center gap-1 mb-1">
            <FaUser />
            Guests
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(g - 1, 1))}
              className="text-xl font-bold px-2 hover:text-orangey"
            >
              −
            </button>
            <span className="text-sm font-medium">{guests}</span>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(g + 1, venue.maxGuests))}
              className="text-xl font-bold px-2 hover:text-orangey"
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
          Total: {formatPrice(calculateTotal())} NOK
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!startDate || !endDate}
          className={`w-full py-3 rounded-full font-semibold transition ${
            !startDate || !endDate
              ? "bg-lightyellow text-gray-500 cursor-not-allowed"
              : "bg-espressoy text-white hover:bg-orangey cursor-pointer"
          }`}
        >
          Continue to Checkout
        </button>
      </form>
      {showAlert && (
        <AlertModal
          title="Invalid Date Range"
          message="Your selected dates overlap with an existing booking. Please choose a different range."
          onClose={() => setShowAlert(false)}
        />
      )}
    </>
  );
};

export default BookNow;
