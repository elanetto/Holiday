import { useState } from "react";

export const SearchBar = () => {
	const [location, setLocation] = useState("");
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [guests, setGuests] = useState(1);

	const handleSearch = () => {
		console.log({
			location,
			checkIn,
			checkOut,
			guests,
		});
		// Here you'll probably want to navigate or fetch search results
	};

	return (
		<div className="flex flex-col md:flex-row gap-2 md:gap-4 p-4 border rounded-2xl shadow">
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
				className="p-2 border rounded-xl w-full"
			/>

			<input
				type="date"
				value={checkOut}
				onChange={(e) => setCheckOut(e.target.value)}
				className="p-2 border rounded-xl w-full"
			/>

			<div className="flex items-center gap-2">
				<button
					onClick={() => setGuests(guests > 1 ? guests - 1 : 1)}
					className="p-2 border rounded-full"
				>
					-
				</button>
				<span>{guests}</span>
				<button
					onClick={() => setGuests(guests + 1)}
					className="p-2 border rounded-full"
				>
					+
				</button>
			</div>

			<button
				onClick={handleSearch}
				className="bg-black text-white px-4 py-2 rounded-xl"
			>
				Search
			</button>
		</div>
	);
};
