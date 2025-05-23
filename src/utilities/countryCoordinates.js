// src/utilities/countryCoordinates.js

const COUNTRY_COORDINATES = {
  norway: [60.472, 8.4689],
  sweden: [60.1282, 18.6435],
  denmark: [56.2639, 9.5018],
  finland: [61.9241, 25.7482],
  iceland: [64.9631, -19.0208],
  germany: [51.1657, 10.4515],
  "united kingdom": [55.3781, -3.436],
  france: [46.6034, 1.8883],
  italy: [41.8719, 12.5674],
  spain: [40.4637, -3.7492],
  greece: [39.0742, 21.8243],
  netherlands: [52.1326, 5.2913],
  belgium: [50.5039, 4.4699],
  austria: [47.5162, 14.5501],
  cuba: [21.5218, -77.7812],
};

const COUNTRY_ALIASES = {
  norge: "norway",
  sverige: "sweden",
  danmark: "denmark",
  finnland: "finland",
  island: "iceland",
  tyskland: "germany",
  storbritannia: "united kingdom",
  frankrike: "france",
  italia: "italy",
  spania: "spain",
};

/**
 * Returns [lat, lng] coordinates for a given country name.
 * Supports both English and common localized (e.g. Norwegian) names.
 */
export const getCountryCoordinates = (rawName = "") => {
  if (typeof rawName !== "string") return null;

  const key = rawName.trim().toLowerCase();
  const normalized = COUNTRY_ALIASES[key] || key;
  return COUNTRY_COORDINATES[normalized] || null;
};
