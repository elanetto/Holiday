import { useEffect, useState } from "react";
import VenueList from "./components/VenueList";
import { useSearch } from "./contexts/useSearch";

function App() {
	const [venues, setVenues] = useState([]);
	const [filteredVenues, setFilteredVenues] = useState([]);
	const [loading, setLoading] = useState(true);

	const { searchFilters } = useSearch(); // 👈 global search filters

	useEffect(() => {
		const fetchAll = async () => {
			try {
				const res = await fetch(
					"https://v2.api.noroff.dev/holidaze/venues?limit=100&_owner=true&_bookings=true"
				);
				if (!res.ok) {
					throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
				}
				const data = await res.json();
				setVenues(data.data);
				setFilteredVenues(data.data); // default = all
			} catch (err) {
				console.error("Error loading venues:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchAll();
	}, []);

	useEffect(() => {
		if (!searchFilters || !venues.length) {
			setFilteredVenues(venues);
			return;
		}

		const { location = "", guests = 1 } = searchFilters;
		const searchTerm = location.toLowerCase();

		const results = venues.filter((venue) => {
			const name = venue.name?.toLowerCase() || "";
			const description = venue.description?.toLowerCase() || "";
			const altTexts = (venue.media || [])
				.map((mediaItem) => mediaItem.alt?.toLowerCase() || "")
				.join(" ");
			const locationFields = [
				venue.location?.city,
				venue.location?.country,
				venue.location?.address,
				venue.location?.continent,
				venue.location?.zip,
			]
				.map((part) => part?.toLowerCase() || "")
				.join(" ");

			const fullText = `${name} ${description} ${altTexts} ${locationFields}`;
			const matchText = fullText.includes(searchTerm);
			const matchGuests = venue.maxGuests >= guests;

			return matchText && matchGuests;
		});

		setFilteredVenues(results);
	}, [searchFilters, venues]);

	return (
		<div className="min-h-screen bg-pink-100">
			<div className="max-w-7xl mx-auto px-4 py-6">
				<h1 className="text-4xl font-bold text-pink-600 text-center mb-6">
					Holidaze
				</h1>

        {/* TEST: Custom tailwind colourrs */}
        <div className="flex text-center min-w-screen justify-center">
          <div className="p-8 bg-goldy">Goldy</div>
          <div className="p-8 bg-pinky">Pinky</div>
          <div className="p-8 bg-orangey">Orangey</div>
          <div className="p-8 bg-greeney">Greeney</div>
          <div className="p-8 bg-lilacy">Lilacy</div>
          <div className="p-8 bg-sunny">Sunny</div>
          <div className="p-8 bg-creamy">Creamy</div>
          <div className="p-8 bg-espressoy text-white">Esspressoy</div>
        </div>

				{loading ? (
					<p className="text-center mt-10">Loading venues...</p>
				) : (
					<VenueList venues={filteredVenues} />
				)}
			</div>
		</div>
	);
}

export default App;
