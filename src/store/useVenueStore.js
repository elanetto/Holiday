import { create } from "zustand";

export const useVenueStore = create((set) => ({
  venues: [],
  loading: true,
  setVenues: (venues) => set({ venues }),
  setLoading: (loading) => set({ loading }),
}));
