// Enhanced, professional-looking CheckoutPage component with robust validation and improved payment form
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import confetti from "canvas-confetti";
import { PLACEHOLDER_VENUE } from "../../utilities/placeholders";
import { formatPrice } from "../../utilities/formatPrice";
import {
  validateFullName,
  validateNorwegianAddress,
} from "../../utilities/validators";

const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    vippsPhone: "",
    paypalEmail: "",
  });

  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

  if (!state) {
    return (
      <div className="p-6 text-center text-red-600">
        Missing booking information. Please go back and select your booking
        again.
      </div>
    );
  }

  const { venue, startDate, endDate, guests, totalPrice } = state;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep1 = () => {
    const step1Errors = {};

    const nameError = validateFullName(formData.fullName);
    if (nameError) step1Errors.fullName = nameError;

    const email = formData.email.trim();
    if (!email) {
      step1Errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      step1Errors.email = "Email format is invalid";
    }

    const phone = formData.phone.trim();
    if (!phone) {
      step1Errors.phone = "Phone number is required";
    } else if (!/^\d{7,15}$/.test(phone)) {
      step1Errors.phone = "Phone number must be between 7–15 digits";
    }

    const addressError = validateNorwegianAddress(formData.address);
    if (addressError) step1Errors.address = addressError;

    setErrors(step1Errors);
    return Object.keys(step1Errors).length === 0;
  };

  const validateCard = () => {
    const cardErrors = {};
    const cardNumberRegex = /^\d{13,19}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
    const cvvRegex = /^\d{3}$/;

    if (!cardNumberRegex.test(formData.cardNumber)) {
      cardErrors.cardNumber = "Enter a valid card number (13-19 digits)";
    }
    if (!expiryRegex.test(formData.expiryDate)) {
      cardErrors.expiryDate = "Use MM/YY format";
    }
    if (!cvvRegex.test(formData.cvv)) {
      cardErrors.cvv = "CVV must be 3 digits";
    }

    setErrors(cardErrors);
    return Object.keys(cardErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      const method = formData.paymentMethod;
      const newErrors = {};

      if (!method) {
        toast.error("Please select a payment method.");
        return;
      }

      if (method === "card" && !validateCard()) return;

      if (method === "vipps" && !/^\d{8}$/.test(formData.vippsPhone.trim())) {
        newErrors.vippsPhone = "Enter a valid 8-digit phone number";
      }

      if (
        method === "paypal" &&
        !/^\S+@\S+\.\S+$/.test(formData.paypalEmail.trim())
      ) {
        newErrors.paypalEmail = "Enter a valid email address";
      }

      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;

      setStep(3);
    }
  };

  const isStepValid = (index) => {
    if (index === 1) {
      return (
        !validateFullName(formData.fullName) &&
        /^\S+@\S+\.\S+$/.test(formData.email.trim()) &&
        /^\d{7,15}$/.test(formData.phone.trim()) &&
        !validateNorwegianAddress(formData.address)
      );
    }

    if (index === 2) {
      const method = formData.paymentMethod;
      if (!method) return false;
      if (method === "card") {
        return (
          /^\d{13,19}$/.test(formData.cardNumber.trim()) &&
          /^(0[1-9]|1[0-2])\/(\d{2})$/.test(formData.expiryDate.trim()) &&
          /^\d{3}$/.test(formData.cvv.trim())
        );
      }
      if (method === "vipps") return /^\d{8}$/.test(formData.vippsPhone.trim());
      if (method === "paypal")
        return /^\S+@\S+\.\S+$/.test(formData.paypalEmail.trim());
    }

    return true;
  };

  const isOverlappingBooking = () => {
    return venue.bookings?.some((booking) => {
      const bookingStart = new Date(booking.dateFrom);
      const bookingEnd = new Date(booking.dateTo);
      return startDate < bookingEnd && endDate > bookingStart;
    });
  };

  const handleConfirmBooking = async () => {
    if (isOverlappingBooking()) {
      toast.error(
        "Oops! Those dates are already booked. Please choose new ones."
      );
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
        state: { venueId: venue.id, venueName: venue.name },
      });
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage =
        error.response?.data?.message ||
        `Error: ${error.response?.status || "Unknown error"}`;
      toast.error(`Booking failed. ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-espressoy text-center">
        Checkout
      </h1>

      <div className="bg-creamy p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-espressoy mb-2">
          Booking Summary
        </h2>
        <div className="flex gap-4 items-center">
          <img
            src={venue.media?.[0]?.url || PLACEHOLDER_VENUE}
            alt={venue.media?.[0]?.alt || "Venue image"}
            className="w-24 h-24 object-cover rounded"
          />
          <div className="text-left">
            <p className="font-bold text-xl">{venue.name}</p>
            <p className="text-sm text-gray-600">
              {new Date(startDate).toLocaleDateString()} →{" "}
              {new Date(endDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              {guests} guest{guests > 1 && "s"}
            </p>
            <p className="text-md mt-2 text-espressoy font-semibold">
              Total: {formatPrice(totalPrice)} NOK
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 my-4">
        {["Info", "Payment", "Confirm"].map((label, i) => {
          const isDisabled = !isStepValid(i + 1);

          return (
            <button
              key={i}
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) setStep(i + 1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                step === i + 1
                  ? "bg-orangey text-white"
                  : isDisabled
                  ? "bg-lightyellow text-gray-400 cursor-not-allowed"
                  : "bg-espressoy text-white hover:bg-orangey"
              }`}
            >
              {i + 1}. {label}
            </button>
          );
        })}
      </div>

      <div className="bg-white p-6 w-[350px] mx-auto space-y-4 text-center rounded-xl">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-espressoy">
              Personal Information
            </h2>
            {["fullName", "email", "phone", "address"].map((field) => (
              <div key={field} className="text-left">
                <input
                  type={field === "email" ? "email" : "text"}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full border border-espressoy p-2 rounded"
                />
                {errors[field] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
            <button
              onClick={handleNextStep}
              className="w-full bg-sunny hover:bg-orangey cursor-pointer hover:text-white text-espressoy py-2 rounded-full font-semibold"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-espressoy">
              Payment Method
            </h2>
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

            {formData.paymentMethod === "card" && (
              <div className="space-y-2">
                {["cardNumber", "expiryDate", "cvv"].map((field) => (
                  <div key={field} className="text-left">
                    <input
                      type="text"
                      placeholder={
                        field === "cardNumber"
                          ? "Card Number"
                          : field === "expiryDate"
                          ? "MM/YY"
                          : "CVV"
                      }
                      value={formData[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="w-full border border-espressoy p-2 rounded"
                    />
                    {errors[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {formData.paymentMethod === "vipps" && (
              <div className="text-left">
                <input
                  type="text"
                  placeholder="VIPPS Phone Number"
                  value={formData.vippsPhone}
                  onChange={(e) => handleChange("vippsPhone", e.target.value)}
                  className="w-full border border-espressoy p-2 rounded"
                />
                {errors.vippsPhone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.vippsPhone}
                  </p>
                )}
              </div>
            )}

            {formData.paymentMethod === "paypal" && (
              <div className="text-left">
                <input
                  type="email"
                  placeholder="PayPal Email"
                  value={formData.paypalEmail}
                  onChange={(e) => handleChange("paypalEmail", e.target.value)}
                  className="w-full border border-espressoy p-2 rounded"
                />
                {errors.paypalEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.paypalEmail}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={handleNextStep}
              className="w-full bg-sunny hover:bg-orangey cursor-pointer hover:text-white text-espressoy py-2 rounded-full font-semibold"
            >
              Continue to Confirm
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-semibold text-espressoy">
              Confirm Your Booking
            </h2>
            <p>
              <span className="font-bold">Venue:</span> {venue.name}
            </p>
            <p>
              <span className="font-bold">Dates:</span>{" "}
              {new Date(startDate).toLocaleDateString()} →{" "}
              {new Date(endDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-bold">Guests:</span> {guests}
            </p>
            <p>
              <span className="font-bold">Total Price:</span>{" "}
              {formatPrice(totalPrice)} NOK
            </p>

            <button
              onClick={handleConfirmBooking}
              disabled={loading}
              className="w-full bg-orangey cursor-pointer hover:bg-sunny text-white hover:text-espressoy py-2 rounded-full font-semibold mt-4"
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
