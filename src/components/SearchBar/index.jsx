import { useState } from "react";
import { useSearch } from "../../contexts/useSearch";
import DatePicker from "react-datepicker";
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
      _timestamp: Date.now(), // 🧠 force useEffect to run on every search
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="flex flex-col md:flex-row gap-2 md:gap-4 p-4 rounded-2xl shadow bg-sunny items-center"
    >
      {/* Location */}
      <input
        type="text"
        placeholder="Where to?"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="p-2 rounded-xl w-full md:flex-1 text-center bg-white cursor-pointer"
      />

      {/* Date Range */}
      <div className="w-full md:flex-1">
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => setDates(update)}
          placeholderText="Select dates"
          className="p-2 rounded-xl w-full cursor-pointer text-center bg-white"
          calendarClassName="bg-white rounded-lg shadow-lg p-4"
          minDate={new Date()}
          inline={false}
          dateFormat="d MMM"
          popperClassName="z-[9999]"
        />
      </div>

      {/* Guests */}
      <div className="flex items-center gap-2 p-2 rounded-xl">
        <button
          type="button"
          onClick={() => setGuests((g) => Math.max(g - 1, 1))}
          className="px-3 py-1 rounded-full hover:bg-orangey hover:text-white bg-white cursor-pointer"
        >
          -
        </button>
        <span>{guests}</span>
        <button
          type="button"
          onClick={() => setGuests((g) => g + 1)}
          className="px-3 py-1 rounded-full hover:bg-orangey hover:text-white bg-white cursor-pointer"
        >
          +
        </button>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="bg-espressoy text-white px-4 py-2 rounded-xl hover:bg-orangey transition cursor-pointer"
      >
        Search
      </button>
    </form>
  );
};
