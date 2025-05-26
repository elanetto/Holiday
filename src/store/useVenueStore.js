import { create } from "zustand";
import { ENDPOINTS } from "../utilities/constants";

export const useVenueStore = create((set) => ({
  venues: [],
  isLoading: false,

  setVenues: (venues) => set({ venues }),
  setLoading: (loading) => set({ isLoading: loading }),

  fetchVenues: async () => {
    set({ isLoading: true });

    try {
      const url = ENDPOINTS.venuesWithQuery({ includeBookings: true });
      const res = await fetch(url);
      const json = await res.json();

      if (json?.data && Array.isArray(json.data)) {
        console.log("✅ Fetched venues with bookings:", json.data);
        set({ venues: json.data });
      } else {
        console.warn("⚠️ Unexpected response structure:", json);
        set({ venues: [] });
      }
    } catch (error) {
      console.error("❌ Failed to fetch venues:", error);
      set({ venues: [] });
    } finally {
      set({ isLoading: false });
    }
  },
}));
