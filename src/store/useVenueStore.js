import { create } from "zustand";

export const useVenueStore = create((set) => ({
  venues: [],
  isLoading: true,
  setVenues: (venues) => set({ venues }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
