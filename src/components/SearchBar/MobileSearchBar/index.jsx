import { useState } from "react";
import { useSearch } from "../../../contexts/useSearch";

export default function MobileSearchBar() {
  const { setSearchFilters } = useSearch();
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    setSearchFilters({
      location: location.toLowerCase(),
      checkIn,
      checkOut,
      guests,
    });
  };

  return (
    <div className="p-4 bg-white border-t border-b border-gray-300 flex flex-col gap-3 md:hidden">
      <input
        type="text"
        placeholder="Where to?"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="p-2 border rounded-md w-full"
      />

      <input
        type="date"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
        className="p-2 border rounded-md w-full"
      />

      <input
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
        className="p-2 border rounded-md w-full"
      />

      <div className="flex items-center justify-between">
        <label className="mr-4">Guests:</label>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            className="p-2 border rounded-full"
          >
            -
          </button>
          <span>{guests}</span>
          <button
            onClick={() => setGuests((g) => g + 1)}
            className="p-2 border rounded-full"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="bg-espressoy text-white rounded-md py-2 mt-2 hover:bg-orangey"
      >
        Search
      </button>
    </div>
  );
}
