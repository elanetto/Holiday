import { create } from "zustand";

export const useVenueStore = create((set) => ({
  venues: [],
  setVenues: (venues) => set({ venues }),
  isLoading: true,
  setLoading: (isLoading) => set({ isLoading }),
}));
