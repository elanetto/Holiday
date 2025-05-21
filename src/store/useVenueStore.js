import { create } from "zustand";

export const useVenueStore = create((set) => ({
  venues: [],
  setVenues: (venues) => set({ venues }),
  loading: true,
  setLoading: (loading) => set({ loading }),
}));
