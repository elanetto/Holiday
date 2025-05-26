import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import confetti from "canvas-confetti";

const SuccessPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Launch extra confetti when visiting success page! 🎉
    confetti({
      particleCount: 200,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, []);

  if (!state) {
    return (
      <div className="p-6 text-center text-red-600">
        Oops! No booking information found.
      </div>
    );
  }

  const { venueId, venueName } = state;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-creamy p-6 text-center space-y-6">
      <h1 className="text-4xl font-bold text-espressoy">🎉 Booking Successful! 🎉</h1>
      <p className="text-lg text-gray-700">
        Thank you for booking <span className="font-semibold">{venueName}</span>!
      </p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate(`/venue/${venueId}`)}
          className="px-6 py-3 rounded-full bg-sunny hover:bg-orangey hover:text-white text-espressoy font-semibold"
        >
          View Venue
        </button>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-full bg-creamy hover:bg-orangey hover:text-white text-espressoy border border-espressoy font-semibold"
        >
          Continue Browsing
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
