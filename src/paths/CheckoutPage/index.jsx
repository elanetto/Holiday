import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import confetti from "canvas-confetti";

const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "",
  });

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

  if (!state) {
    return (
      <div className="p-6 text-center text-red-600">
        Missing booking information. Please go back and select your booking again.
      </div>
    );
  }

  const { venue, startDate, endDate, guests, totalPrice } = state;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmBooking = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.paymentMethod) {
      toast.error("Please complete all fields.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "https://v2.api.noroff.dev/holidaze/bookings",
        {
          dateFrom: new Date(startDate).toISOString(),
          dateTo: new Date(endDate).toISOString(),
          guests,
          venueId: venue.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Booking confirmed! 🎉");
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

      navigate("/success", {
        state: {
          venueId: venue.id,
          venueName: venue.name,
        },
      });
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage =
        error.response?.data?.message || `Error: ${error.response?.status || "Unknown error"}`;
      toast.error(`Booking failed. ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-espressoy mb-4 text-center">Checkout</h1>

      <div className="flex justify-center mb-4">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-full ${
              step === 1 ? "bg-orangey text-white" : "bg-gray-200"
            }`}
            onClick={() => setStep(1)}
          >
            1. Info
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              step === 2 ? "bg-orangey text-white" : "bg-gray-200"
            }`}
            onClick={() => setStep(2)}
          >
            2. Payment
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              step === 3 ? "bg-orangey text-white" : "bg-gray-200"
            }`}
            onClick={() => setStep(3)}
          >
            3. Confirm
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full border border-espressoy p-2 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full border border-espressoy p-2 rounded"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full border border-espressoy p-2 rounded"
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full border border-espressoy p-2 rounded"
            />
            <button
              onClick={() => setStep(2)}
              className="w-full bg-sunny hover:bg-orangey hover:text-white text-espressoy py-2 rounded-full font-semibold"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-2">Payment Method</h2>
            <select
              value={formData.paymentMethod}
              onChange={(e) => handleChange("paymentMethod", e.target.value)}
              className="w-full border border-espressoy p-2 rounded"
            >
              <option value="">Select Payment Method</option>
              <option value="card">Credit Card</option>
              <option value="vipps">VIPPS</option>
              <option value="paypal">PayPal</option>
            </select>
            <button
              onClick={() => setStep(3)}
              className="w-full bg-sunny hover:bg-orangey hover:text-white text-espressoy py-2 rounded-full font-semibold"
            >
              Continue to Confirm
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold mb-2">Confirm Your Booking</h2>
            <p><span className="font-semibold">Venue:</span> {venue.name}</p>
            <p><span className="font-semibold">Dates:</span> {new Date(startDate).toLocaleDateString()} → {new Date(endDate).toLocaleDateString()}</p>
            <p><span className="font-semibold">Guests:</span> {guests}</p>
            <p><span className="font-semibold">Total Price:</span> NOK {totalPrice.toLocaleString()}</p>

            <button
              onClick={handleConfirmBooking}
              disabled={loading}
              className="w-full bg-greeney hover:bg-orangey hover:text-white text-espressoy py-2 rounded-full font-semibold mt-4"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
