// src/utilities/bookings.js
export const isVenueFullyBooked = (venue, selectedFrom, selectedTo) => {
  if (!venue.bookings?.length || !selectedFrom || !selectedTo) return false;

  return venue.bookings.some((booking) => {
    const bookingStart = new Date(booking.dateFrom);
    const bookingEnd = new Date(booking.dateTo);

    return selectedFrom < bookingEnd && selectedTo > bookingStart;
  });
};
