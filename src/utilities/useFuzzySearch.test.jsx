import { render, screen } from "@testing-library/react";
import { useFuzzySearch } from "./useFuzzySearch";
import React from "react";

const mockVenues = [
  {
    id: 1,
    name: "Cozy Cabin",
    location: { city: "Oslo", country: "Norway" },
    maxGuests: 4,
  },
  {
    id: 2,
    name: "Beach House",
    location: { city: "Bergen", country: "Norway" },
    maxGuests: 6,
  },
  {
    id: 3,
    name: "Mountain Retreat",
    location: { city: "Trondheim", country: "Norway" },
    maxGuests: 2,
  },
];

// Dummy test component
function HookTester({ venues, filters }) {
  const { results, error } = useFuzzySearch(venues, filters);

  if (error) return <div>Error: {error}</div>;

  return (
    <ul data-testid="results">
      {results.map((v) => (
        <li key={v.id}>{v.name}</li>
      ))}
    </ul>
  );
}

describe("useFuzzySearch", () => {
  it("returns all venues if no search is active", () => {
    render(
      <HookTester venues={mockVenues} filters={{ location: "", guests: 1 }} />
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(mockVenues.length);
  });

  it("returns matching venues by location", () => {
    render(
      <HookTester
        venues={mockVenues}
        filters={{ location: "Bergen", guests: 1 }}
      />
    );
    const items = screen.getAllByRole("listitem");
    expect(items[0].textContent).toBe("Beach House");
    expect(items).toHaveLength(1);
  });

  it("filters out venues with too few guests", () => {
    render(
      <HookTester
        venues={mockVenues}
        filters={{ location: "Trondheim", guests: 5 }}
      />
    );
    expect(screen.queryByRole("listitem")).toBeNull();
  });

  it("handles bad input gracefully", () => {
    render(
      <HookTester
        venues={undefined}
        filters={{ location: "Oslo", guests: 1 }}
      />
    );
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
