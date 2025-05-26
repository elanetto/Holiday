import { Link } from "react-router-dom";
import { FaWifi, FaParking, FaDog, FaMoneyBillWave } from "react-icons/fa";
import { GiCroissant } from "react-icons/gi";
import { PLACEHOLDER_VENUE } from "../../utilities/placeholders";
import StarRating from "../StarRating";
import { formatPrice } from "../../utilities/formatPrice";

const stripHTML = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

const truncateText = (text, maxLength) =>
  text?.length > maxLength ? text.slice(0, maxLength) + "…" : text;

const VenueCard = ({
  venue,
  fullyBooked = false,
  tooSmallForGuests = false,
}) => {
  const {
    id,
    name,
    media,
    price,
    rating,
    maxGuests,
    location,
    meta,
    description,
    isBooked,
  } = venue;

  const image = media?.[0]?.url || PLACEHOLDER_VENUE;
  const imageAlt = media?.[0]?.alt || name || "Venue image";

  return (
    <Link
      to={`/venue/${id}`}
      aria-disabled={isBooked}
      className={`group block rounded-2xl overflow-hidden shadow-md bg-white transition-transform duration-300 transform hover:scale-[1.015] focus:outline-none relative ${
        isBooked ? "pointer-events-auto" : ""
      }`}
    >
      <div className="relative">
        <img
          src={image}
          alt={imageAlt}
          onError={(e) => (e.target.src = PLACEHOLDER_VENUE)}
          className={`w-full h-56 object-cover group-hover:brightness-95 transition rounded-b-none ${
            isBooked ? "opacity-60" : ""
          }`}
        />

        {fullyBooked && (
          <div className="absolute top-4 left-4 bg-orange-800 text-white text-xs font-semibold px-2 py-1 rounded shadow z-10">
            Fully Booked
          </div>
        )}

        {tooSmallForGuests && (
          <div className="absolute top-4 right-4 bg-sunny text-espressoy text-xs font-semibold px-2 py-1 rounded shadow z-10">
            Max guests: {venue.maxGuests}
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3
          className="text-lg font-semibold text-espressoy truncate"
          title={name}
        >
          {name}
        </h3>

        <p className="text-sm text-gray-500">
          {truncateText(location?.city, 8)},{" "}
          {truncateText(location?.country, 8)}
        </p>

        {/* ✅ Strip HTML tags before truncating */}
        <p className="text-sm text-gray-600">
          {truncateText(stripHTML(description), 45)}
        </p>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1 text-sm text-espressoy font-semibold">
            <FaMoneyBillWave className="w-4 h-4" />
            {formatPrice(price)} NOK
          </span>
          {rating ? (
            <StarRating rating={rating} />
          ) : (
            <span className="text-sm text-gray-400">No rating</span>
          )}
        </div>

        <p className="text-sm text-gray-600">
          <span className="font-medium">Max guests:</span> {maxGuests}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 text-xs mt-2">
          {meta?.wifi && (
            <span className="flex items-center gap-1 bg-lightyellow px-3 py-1 rounded-full text-espressoy">
              <FaWifi className="w-3 h-3" /> WiFi
            </span>
          )}
          {meta?.parking && (
            <span className="flex items-center gap-1 bg-lightyellow px-3 py-1 rounded-full text-espressoy">
              <FaParking className="w-3 h-3" /> Parking
            </span>
          )}
          {meta?.breakfast && (
            <span className="flex items-center gap-1 bg-lightyellow px-3 py-1 rounded-full text-espressoy">
              <GiCroissant className="w-3 h-3" /> Breakfast
            </span>
          )}
          {meta?.pets && (
            <span className="flex items-center gap-1 bg-lightyellow px-3 py-1 rounded-full text-espressoy">
              <FaDog className="w-3 h-3" /> Pets
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default VenueCard;
