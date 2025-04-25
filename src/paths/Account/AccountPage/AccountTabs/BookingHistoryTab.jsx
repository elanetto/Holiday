import BookingHistory from "../../../../components/Booking/BookingHistory";

const BookingHistoryTab = () => {
  return (
    <div className="p-8 text-center w-full">
      <h1>Booking History</h1>
      <p>This is your booking history</p>

      <BookingHistory />
    </div>
  );
};

export default BookingHistoryTab;
