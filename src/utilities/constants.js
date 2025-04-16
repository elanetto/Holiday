export const API_BASE_URL = "https://v2.api.noroff.dev/holidaze";

export const ENDPOINTS = {
	// Basic endpoints
	venues: `${API_BASE_URL}/venues`,
	bookings: `${API_BASE_URL}/bookings`,
	profiles: `${API_BASE_URL}/profiles`,

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
};

export const FALLBACK = {
	// Noroff Oslo address
	lat: 59.9300048872585,
	lng: 10.755947969218308,
	name: "Thor Hansen",
	email: "thorhansen@madeupemail.com",
	bio: "I cola light in the sun",
};
