import { useState } from "react";
import { useSearch } from "../../contexts/useSearch";
import DatePicker from "react-datepicker";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

export const SearchBar = () => {
  const { searchFilters, setSearchFilters } = useSearch();
  const [location, setLocation] = useState(searchFilters?.location || "");
  const [guests, setGuests] = useState(searchFilters?.guests || 1);
  const [dates, setDates] = useState([
    searchFilters?.checkIn ? new Date(searchFilters.checkIn) : null,
    searchFilters?.checkOut ? new Date(searchFilters.checkOut) : null,
  ]);

  const [startDate, endDate] = dates;

  const handleSearch = () => {
    setSearchFilters({
      location: location.toLowerCase(),
      checkIn: startDate ? startDate.toISOString() : "",
      checkOut: endDate ? endDate.toISOString() : "",
      guests,
      _timestamp: Date.now(),
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="flex flex-col md:flex-row justify-center items-center gap-4 bg-sunny px-4 py-6 md:p-4 rounded-2xl shadow-md w-full max-w-2xl mx-auto"
    >
      {/* Location */}
      <div className="bg-white flex flex-col items-start px-4 py-2 rounded-2xl w-full md:w-auto">
        <label className="text-xs font-semibold text-espressoy flex items-center gap-1">
          <FaMapMarkerAlt />
          Location
        </label>
        <input
          type="text"
          placeholder="Where to?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-transparent text-sm font-medium focus:outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Date Range */}
      <div className="flex flex-col bg-white items-start px-4 py-2 rounded-2xl w-full md:w-auto">
        <label className="text-xs font-semibold text-espressoy flex items-center gap-1">
          <FaCalendarAlt />
          Dates
        </label>
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => setDates(update)}
          placeholderText="Add dates"
          className="bg-transparent text-sm font-medium focus:outline-none w-[130px]"
          minDate={new Date()}
          dateFormat="MMM d"
        />
      </div>

      {/* Guests */}
      <div className="flex flex-col bg-white items-start px-4 py-2 rounded-2xl w-full md:w-auto">
        <label className="text-xs font-semibold text-espressoy flex items-center gap-1">
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
            onClick={() => setGuests((g) => g + 1)}
            className="text-xl font-bold px-2 hover:text-orangey"
          >
            +
          </button>
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="bg-espressoy cursor-pointer text-white font-semibold px-8 py-4 rounded-full hover:bg-orangey transition"
      >
        Search
      </button>
    </form>
  );
};
