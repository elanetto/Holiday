import { useState } from "react";
import { useSearch } from "../../contexts/useSearch";

export const SearchBar = () => {
	const { setSearchFilters } = useSearch();
	const [location, setLocation] = useState("");
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [guests, setGuests] = useState(1);

	const handleSearch = () => {
		console.log("Clicked search with:", {
			location,
			checkIn,
			checkOut,
			guests,
		});

		setSearchFilters({
			location: location.toLowerCase(),
			checkIn,
			checkOut,
			guests,
		});
	};
       

	return (
		<div className="flex flex-col md:flex-row gap-2 md:gap-4 p-4 border rounded-2xl shadow bg-white">
			<input
				type="text"
				placeholder="Where to?"
				value={location}
				onChange={(e) => setLocation(e.target.value)}
				className="p-2 border rounded-xl w-full"
			/>

			<input
				type="date"
				value={checkIn}
				onChange={(e) => setCheckIn(e.target.value)}
				className="p-2 border rounded-xl w-full cursor-pointer"
			/>

			<input
				type="date"
				value={checkOut}
				onChange={(e) => setCheckOut(e.target.value)}
				className="p-2 border rounded-xl w-full cursor-pointer"
			/>

			<div className="flex items-center gap-2">
				<button
					onClick={() => setGuests((g) => Math.max(g - 1, 1))}
					className="p-2 border rounded-full cursor-pointer hover:bg-orangey hover:text-creamy"
				>
					-
				</button>
				<span>{guests}</span>
				<button
					onClick={() => setGuests((g) => g + 1)}
					className="p-2 border rounded-full cursor-pointer hover:bg-orangey hover:text-creamy"
				>
					+
				</button>
			</div>

			<button
				onClick={handleSearch}
				className="bg-espressoy text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-orangey"
			>
				Search
			</button>
		</div>
	);
};
