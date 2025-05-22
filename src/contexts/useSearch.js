// src/contexts/useSearch.js
import { useContext } from "react";
import { SearchContext } from "./SearchContext";

export const useSearch = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }

  const clearSearchFilters = () => {
    context.setSearchFilters({});
  };

  return {
    ...context,
    clearSearchFilters,
  };
};
