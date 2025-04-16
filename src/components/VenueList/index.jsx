import { useEffect, useState } from "react";
import VenueCard from "../VenueCard";

const VenueList = ({ venues = [] }) => {
	const [sortedVenues, setSortedVenues] = useState([]);
	const [sortBy, setSortBy] = useState("created");
	const [sortOrder, setSortOrder] = useState("desc");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const limit = 21;

	// Sort venues and calculate pages
	useEffect(() => {
		if (!venues.length) {
			setSortedVenues([]);
			setTotalPages(1);
			return;
		}

		const sorted = [...venues].sort((a, b) => {
			const aVal = a[sortBy] ?? 0;
			const bVal = b[sortBy] ?? 0;
			return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
		});

		setSortedVenues(sorted);
		setTotalPages(Math.max(1, Math.ceil(sorted.length / limit)));
	}, [venues, sortBy, sortOrder]);

	// Keep page in bounds
	useEffect(() => {
		if (page > totalPages) {
			setPage(totalPages);
		}
	}, [page, totalPages]);

	// Pagination logic
	const start = (page - 1) * limit;
	const end = start + limit;
	const paginatedVenues = sortedVenues.slice(start, end);

	const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
	const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

	return (
		<div className="p-4">
			{/* Sorting Controls */}
			<div className="flex flex-wrap justify-end mb-4 gap-2">
				<div className="flex items-center gap-2">
					<label className="text-sm">Sort by:</label>
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
						className="border rounded px-2 py-1"
					>
						<option value="created">Newest</option>
						<option value="price">Price</option>
						<option value="rating">Rating</option>
					</select>

					<select
						value={sortOrder}
						onChange={(e) => setSortOrder(e.target.value)}
						className="border rounded px-2 py-1"
					>
						<option value="desc">Descending</option>
						<option value="asc">Ascending</option>
					</select>
				</div>
			</div>

			{/* Venue Cards */}
			{paginatedVenues.length === 0 ? (
				<p className="text-center text-gray-500 mt-8">
					No venues found. Try adjusting your search.
				</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{paginatedVenues.map((venue) => (
						<VenueCard key={venue.id} venue={venue} />
					))}
				</div>
			)}

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<div className="flex flex-col items-center justify-center gap-2">
					<p className="text-sm text-gray-600">
						Page {page} of {totalPages}
					</p>
					<div className="flex gap-4">
						<button
							onClick={handlePrev}
							disabled={page === 1}
							className="px-4 py-2 border rounded disabled:opacity-50"
						>
							← Prev
						</button>
						<button
							onClick={handleNext}
							disabled={page === totalPages}
							className="px-4 py-2 border rounded disabled:opacity-50"
						>
							Next →
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default VenueList;
