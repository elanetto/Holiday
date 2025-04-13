export const API_BASE_URL = "https://v2.api.noroff.dev/holidaze";

export const ENDPOINTS = {
	venues: `${API_BASE_URL}/venues`,
	bookings: `${API_BASE_URL}/bookings`,
	profiles: `${API_BASE_URL}/profiles`,
};

export const FALLBACK = {
	// Noroff Oslo address
	lat: 59.9300048872585,
	lng: 10.755947969218308,
	name: 'Thor Hansen',
	email: 'thorhansen@madeupemail.com',
	bio: 'I cola light in the sun',
}