import { create } from "zustand";

export const useVenueStore = create((set) => ({
  venues: [],
  setVenues: (venues) => set({ venues }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
