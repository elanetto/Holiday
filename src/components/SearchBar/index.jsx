import { useState } from "react";
import { useSearch } from "../../contexts/useSearch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const SearchBar = () => {
  const { setSearchFilters } = useSearch();
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState([null, null]);
  const [startDate, endDate] = dates;
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    setSearchFilters({
      location: location.toLowerCase(),
      checkIn: startDate ? startDate.toISOString() : "",
      checkOut: endDate ? endDate.toISOString() : "",
      guests,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 p-4 border rounded-2xl shadow bg-white items-center">
      {/* Location */}
      <input
        type="text"
        placeholder="Where to?"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="p-2 border rounded-xl w-full md:flex-1 text-center"
      />

      {/* Date Range */}
      <div className="w-full md:flex-1">
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDates(update);
          }}
          placeholderText="Select dates"
          className="p-2 border rounded-xl w-full cursor-pointer text-center"
          calendarClassName="bg-white rounded-lg shadow-lg p-4"
          minDate={new Date()}
          inline={false}
          dateFormat="d MMM" /* 👈 changed from "d MMMM" to "d MMM" */
        />
      </div>

      {/* Guests */}
      <div className="flex items-center gap-2 border p-2 rounded-xl">
        <button
          onClick={() => setGuests((g) => Math.max(g - 1, 1))}
          className="px-3 py-1 border rounded-full hover:bg-orangey hover:text-white"
        >
          -
        </button>
        <span>{guests}</span>
        <button
          onClick={() => setGuests((g) => g + 1)}
          className="px-3 py-1 border rounded-full hover:bg-orangey hover:text-white"
        >
          +
        </button>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-espressoy text-white px-4 py-2 rounded-xl hover:bg-orangey transition cursor-pointer"
      >
        Search
      </button>
    </div>
  );
};
