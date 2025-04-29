// src/contexts/SearchProvider.jsx
import { useState } from "react";
import { SearchContext } from "./SearchContext";

export function SearchProvider({ children }) {
	const [searchFilters, setSearchFilters] = useState(null);

	return (
		<SearchContext.Provider value={{ searchFilters, setSearchFilters }}>
			{children}
		</SearchContext.Provider>
	);
}
