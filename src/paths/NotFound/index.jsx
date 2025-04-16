import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
	const location = useLocation();
	const message = location.state?.message || "Oops! This page doesn’t exist.";

	return (
		<div className="p-8 text-center">
			<h1 className="text-4xl font-bold mb-4">404</h1>
			<p className="text-lg mb-4">{message}</p>
			<Link
				to="/"
				className="inline-block mt-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
			>
			Go Home
			</Link>
		</div>
	);
};

export default NotFound;
