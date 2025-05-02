import { Link } from "react-router-dom";
import { PLACEHOLDER_VENUE } from "../../utilities/placeholders";

const VenueCard = ({ venue }) => {
  const { id, name, media, price, rating, maxGuests, location, meta } = venue;

  // Safe image handling with fallback
  const image = media?.[0]?.url || PLACEHOLDER_VENUE;
  const imageAlt = media?.[0]?.alt || name || "Venue image";

  // Feature tags helper
  const hasFeature = (feature, label) =>
    feature ? (
      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
        {label}
      </span>
    ) : null;

  return (
    <div className="rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition bg-white flex flex-col">
      <img
        src={image}
        alt={imageAlt}
        onError={(e) => (e.target.src = PLACEHOLDER_VENUE)}
        className="w-full h-60 object-cover"
      />

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-lg font-semibold truncate" title={name}>
          {name}
        </h3>

        <p className="text-sm text-gray-500">
          {location?.city}, {location?.country}
        </p>

        <p className="text-sm">
          <span className="font-medium">Max guests:</span> {maxGuests}
        </p>

        <p className="text-sm text-yellow-600 font-medium">
          ⭐ {rating?.toFixed(1) || "No rating"}
        </p>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-2">
          {hasFeature(meta?.wifi, "WiFi")}
          {hasFeature(meta?.parking, "Parking")}
          {hasFeature(meta?.breakfast, "Breakfast")}
          {hasFeature(meta?.pets, "Pets allowed")}
        </div>

        <p className="text-base font-bold mt-2">NOK {price} / night</p>

        <Link
          to={`/venue/${id}`}
          className="mt-auto bg-black text-white px-4 py-2 rounded-md hover:bg-orangey hover:text-creamy text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default VenueCard;
