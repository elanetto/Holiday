// 🌐 Base URLs
export const BARE_BASE = "https://v2.api.noroff.dev";
export const API_BASE_URL = `${BARE_BASE}/holidaze`;

// 📦 Core API Endpoints
export const ENDPOINTS = {
	// Static endpoints
	auth: `${BARE_BASE}/auth`,
	login: `${BARE_BASE}/auth/login`,
	register: `${BARE_BASE}/auth/register`,
	api_key: `${BARE_BASE}/auth/create-api-key`,

	venues: `${API_BASE_URL}/venues`,
	bookings: `${API_BASE_URL}/bookings`,
	profiles: `${API_BASE_URL}/profiles`,

	// 🔧 Dynamic endpoint helpers
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

	venueById: (id, { includeOwner = true, includeBookings = true } = {}) => {
		let url = `${API_BASE_URL}/venues/${id}`;
		const query = [];
		if (includeOwner) query.push("_owner=true");
		if (includeBookings) query.push("_bookings=true");
		return query.length ? `${url}?${query.join("&")}` : url;
	},
};

// ✨ Venue utilities
export const VENUE_UTILS = {
	latest: ENDPOINTS.venuesWithQuery({ limit: 100 }),
};

// 📍 Fallback data (for placeholder maps or user info)
export const FALLBACK = {
	lat: 59.9300048872585,
	lng: 10.755947969218308,
	name: "Thor Hansen",
	email: "thorhansen@madeupemail.com",
	bio: "I cola light in the sun",
};
