import { useState } from "react";
import { useSearch } from "../../contexts/useSearch";
import DatePicker from "react-datepicker";
import { FaMapMarkedAlt, FaCalendarAlt, FaUser } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

export const SearchBar = () => {
  const { searchFilters, setSearchFilters } = useSearch();
  const [location, setLocation] = useState(searchFilters?.location || "");
  const [guests, setGuests] = useState(searchFilters?.guests || 2);
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
      className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4 p-18 md:p-4 w-full max-w-6xl mx-auto bg-transparent"
    >
      {/* DESTINATION */}
      <div className="flex items-center bg-white rounded-2xl px-5 py-3 w-full md:w-auto md:min-w-[220px] shadow-sm">
        <FaMapMarkedAlt className="w-6 h-6 text-espressoy mr-3" />
        <div className="flex flex-col w-full">
          <label className="text-[10px] font-bold uppercase text-black mb-1">
            Destination
          </label>
          <input
            type="text"
            placeholder="Where to...?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-base font-medium text-black placeholder:text-gray-500 bg-transparent focus:outline-none w-full"
          />
        </div>
      </div>

      {/* DATES */}
      <div className="flex items-center bg-white rounded-2xl px-5 py-3 w-full md:w-auto md:min-w-[220px] shadow-sm">
        <FaCalendarAlt className="w-6 h-6 text-espressoy mr-3" />
        <div className="flex flex-col w-full">
          <label className="text-[10px] font-bold uppercase text-black mb-1">
            Dates
          </label>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDates(update)}
            placeholderText="Choose dates..."
            className="text-base font-medium text-black placeholder:text-gray-500 bg-transparent focus:outline-none w-full"
            minDate={new Date()}
            dateFormat="MMM d"
          />
        </div>
      </div>

      {/* TRAVELLERS */}
      <div className="flex items-center bg-white rounded-2xl px-5 py-3 w-full md:w-auto md:min-w-[220px] shadow-sm">
        <FaUser className="w-6 h-6 text-espressoy mr-3" />
        <div className="flex flex-col w-full">
          <label className="text-[10px] font-bold uppercase text-black mb-1">
            Travellers
          </label>
          <div className="flex items-center justify-between w-full">
            <span className="text-base font-medium">
              {guests} {guests === 1 ? "person" : "people"}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="bg-orangey text-white w-6 h-6 rounded-full flex items-center justify-center text-lg font-bold hover:scale-110 transition"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setGuests((g) => g + 1)}
                className="bg-orangey text-white w-6 h-6 rounded-full flex items-center justify-center text-lg font-bold hover:scale-110 transition"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BUTTON */}
      <button
        type="submit"
        className="w-full md:w-auto bg-sunny text-black font-semibold text-base px-8 py-4 rounded-full hover:bg-orangey transition cursor-pointer"
      >
        Search
      </button>
    </form>
  );
};
