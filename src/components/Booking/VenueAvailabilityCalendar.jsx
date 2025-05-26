import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const VenueAvailabilityCalendar = ({ bookedRanges }) => {

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-espressoy mb-2">
        Availability
      </h3>
      <DatePicker
        inline
        monthsShown={1}
        excludeDateIntervals={bookedRanges}
        minDate={new Date()}
        className="w-full"
        calendarClassName="custom-calendar"
      />
    </div>
  );
};

export default VenueAvailabilityCalendar;
