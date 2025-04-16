import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../../utilities/constants";

const VenuePage = () => {
	const { id } = useParams();
	const [venue, setVenue] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchVenue = async () => {
			try {
				const res = await fetch(`${ENDPOINTS.venues}/${id}?_bookings=true&_owner=true`);
				const data = await res.json();
				setVenue(data.data);
			} catch (err) {
				console.error(err);
				navigate("/404", {
                    state: { message: "This venue could not be found." },
                });                
			}
		};

		fetchVenue();
	}, [id, navigate]);

	if (!venue) return <p className="p-4">Loading venue...</p>;

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-2">{venue.name}</h1>
			<img
				src={venue.media?.[0]?.url || "https://placehold.co/600x400"}
				alt={venue.media?.[0]?.alt || venue.name}
				className="w-full max-w-2xl rounded-xl mb-4"
			/>
			<p>{venue.description}</p>
			{/* Add more details here like meta, owner, etc. */}
		</div>
	);
};

export default VenuePage;
