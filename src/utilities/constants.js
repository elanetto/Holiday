export const API_BASE_URL = "https://v2.api.noroff.dev/holidaze";
export const BARE_BASE = "https://v2.api.noroff.dev";

export const ENDPOINTS = {
	// Basic endpoints for Holidaze
	venues: `${API_BASE_URL}/venues`,
	bookings: `${API_BASE_URL}/bookings`,
	profiles: `${API_BASE_URL}/profiles`,

    // User endpoints
    auth: `${BARE_BASE}/auth`,
    login: `${BARE_BASE}/auth/login`,
    register: `${BARE_BASE}/auth/register`,
    api_key: `${BARE_BASE}/auth/create-api-key`,

	// 🧠 Extended helper for venues with query support
	venuesWithQuery: ({
		page = 1,
		limit = 10,
		sort = "created",
		sortOrder = "desc",
		includeOwner = true,
		includeBookings = false,
	} = {}) => {
		let url = `${API_BASE_URL}/venues?limit=${limit}&page=${page}&sort=${sort}&sortOrder=${sortOrder}`;
		if (includeOwner) url += "&_owner=true";
		if (includeBookings) url += "&_bookings=true";
		return url;
	},

	// 🧠 Fetch a single venue by ID (with optional _bookings/_owner)
	venueById: (id, { includeOwner = true, includeBookings = true } = {}) => {
		let url = `${API_BASE_URL}/venues/${id}`;
		const query = [];
		if (includeOwner) query.push("_owner=true");
		if (includeBookings) query.push("_bookings=true");
		if (query.length) url += `?${query.join("&")}`;
		return url;
	},

	// ✨ Latest venues helper
	latestVenues: `${API_BASE_URL}/venues?limit=100&sort=created&sortOrder=desc&_owner=true&_bookings=true`,
};
