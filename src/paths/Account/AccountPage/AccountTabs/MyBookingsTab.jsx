import MyBookings from "../../../../components/Booking/MyBookings";

const MyBookingsTab = () => {

    return (
        <div className="p-8 text-center w-full">
            <h1>My Bookings</h1>
            <p>This is where you can see your bookings.</p>
            <MyBookings />
        </div>
    );
};

export default MyBookingsTab;