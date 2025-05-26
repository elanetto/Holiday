import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../../utilities/constants";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  PLACEHOLDER_VENUE,
  PLACEHOLDER_AVATAR,
} from "../../utilities/placeholders";
import { BsCaretLeftFill, BsCaretRightFill, BsX } from "react-icons/bs";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getCountryCoordinates } from "../../utilities/countryCoordinates";
import BookNow from "../../components/Booking/BookNow";
import {
  FaMoneyBillWave,
  FaWifi,
  FaParking,
  FaDog,
  FaCalendarAlt,
} from "react-icons/fa";
import { GiCroissant } from "react-icons/gi";
import StarRating from "../../components/StarRating";
import { formatPrice } from "../../utilities/formatPrice";
import VenueAvailabilityCalendar from "../../components/Booking/VenueAvailabilityCalendar";

const getTextContentLength = (html) => {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent.trim().length;
};

const VenuePage = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [validImages, setValidImages] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const navigate = useNavigate();

  const DESCRIPTION_MAX_CHARS = 200;

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await fetch(
          `${ENDPOINTS.venues}/${id}?_bookings=true&_owner=true`
        );
        const data = await res.json();
        setVenue(data.data);
      } catch (err) {
        console.error(err);
        navigate("/404", {
          state: { message: "This venue could not be found." },
        });
      }
    };
    fetchVenue();
  }, [id, navigate]);

  useEffect(() => {
    if (venue?.media?.length) {
      Promise.all(
        venue.media.map(
          (img) =>
            new Promise((resolve) => {
              const testImg = new Image();
              testImg.src = img.url;
              testImg.onload = () => resolve(img);
              testImg.onerror = () =>
                resolve({ url: PLACEHOLDER_VENUE, alt: "Placeholder image" });
            })
        )
      ).then((results) => setValidImages(results));
    } else {
      // Fallback if no images provided
      setValidImages([{ url: PLACEHOLDER_VENUE, alt: "Placeholder image" }]);
    }
  }, [venue]);

  if (!venue) return <p className="p-4">Loading venue...</p>;

  const markerPosition = getCountryCoordinates(venue.location.country);

  const truncateTitle = (title, maxLength = 40) => {
    return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
  };

  const getTrimmedDescriptionHTML = (html, limit = DESCRIPTION_MAX_CHARS) => {
    if (!html) return "";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const rawText = tempDiv.textContent.trim(); // ✅ Move this here
    let charCount = 0;
    let result = "";
    const tagsStack = [];
    let firstHeadingSkipped = false;

    const walkNodes = (nodes) => {
      let localResult = "";

      for (const node of nodes) {
        if (charCount >= limit) break;

        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || "";
          const remaining = limit - charCount;
          const toAdd = text.slice(0, remaining);
          localResult += toAdd;
          charCount += toAdd.length;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = node.tagName.toLowerCase();

          if (!firstHeadingSkipped && /^h[1-6]$/.test(tag)) {
            firstHeadingSkipped = true;
            continue;
          }

          localResult += `<${tag}>`;
          tagsStack.push(tag);
          localResult += walkNodes(node.childNodes);
          const lastTag = tagsStack.pop();
          localResult += `</${lastTag}>`;
        }

        if (charCount >= limit) break;
      }

      return localResult;
    };

    result = walkNodes(tempDiv.childNodes);

    // Add ellipsis only if the full raw text exceeds the visible character limit
    if (charCount < rawText.length) {
      result += "...";
    }

    return result;
  };

  const bookedRanges =
    venue.bookings?.map((booking) => ({
      start: new Date(booking.dateFrom),
      end: new Date(booking.dateTo),
    })) || [];

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
        <h1
          className="text-3xl font-bold text-espressoy truncate break-words max-w-full"
          title={venue?.name || "Unnamed Venue"}
        >
          {truncateTitle(venue.name || "Unnamed Venue")}
        </h1>

        {venue.rating ? (
          <div className="mt-1">
            <StarRating rating={venue.rating} />
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-1">No rating yet</p>
        )}
      </div>

      {validImages.length > 0 && (
        <div className="relative">
          <Carousel
            showThumbs={true}
            showStatus={false}
            infiniteLoop
            autoPlay
            swipeable
            emulateTouch
            className="rounded-xl overflow-hidden mb-6"
            selectedItem={
              fullscreenIndex !== null ? fullscreenIndex : undefined
            }
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-sunny hover:bg-orangey p-2 rounded-full z-10 shadow cursor-pointer"
                >
                  <BsCaretLeftFill className="text-espressoy w-6 h-6" />
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-sunny hover:bg-orangey p-2 rounded-full z-10 shadow cursor-pointer"
                >
                  <BsCaretRightFill className="text-espressoy w-6 h-6" />
                </button>
              )
            }
            renderIndicator={(onClickHandler, isSelected, index, label) => {
              const baseClasses =
                "inline-block w-3 h-3 mx-1 rounded-full cursor-pointer border border-white";
              const classes = isSelected
                ? `${baseClasses} bg-sunny`
                : `${baseClasses} bg-white`;
              return (
                <li
                  className={classes}
                  style={{ position: "relative", top: "-40px", zIndex: 50 }}
                  onClick={onClickHandler}
                  onKeyDown={onClickHandler}
                  value={index}
                  key={index}
                  role="button"
                  tabIndex={0}
                  aria-label={`${label} ${index + 1}`}
                />
              );
            }}
          >
            {validImages.map((image, index) => (
              <div
                key={index}
                className="relative cursor-pointer"
                onClick={() => setFullscreenIndex(index)}
              >
                <img
                  src={image.url}
                  alt={image.alt || `Image ${index + 1}`}
                  className="w-full max-h-[500px] object-cover rounded-xl"
                  onError={(e) => (e.target.src = PLACEHOLDER_VENUE)}
                />
                <div className="bg-white p-3 text-center text-black text-sm">
                  {image.alt || `Image ${index + 1}`}
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      )}

      {fullscreenIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setFullscreenIndex(null);
            }
          }}
        >
          <button
            onClick={() => setFullscreenIndex(null)}
            className="absolute top-4 right-4 text-white text-3xl z-50"
            aria-label="Close fullscreen"
          >
            <BsX />
          </button>

          <div className="relative w-full max-w-4xl">
            <Carousel
              selectedItem={fullscreenIndex}
              showThumbs={false}
              showStatus={false}
              infiniteLoop
              showArrows={true}
              useKeyboardArrows
              emulateTouch
              swipeable
              className="w-full"
              onChange={(index) => setFullscreenIndex(index)}
              renderIndicator={() => null} // hide default indicators
            >
              {validImages.map((image, index) => (
                <div
                  key={index}
                  onClick={(e) => e.stopPropagation()}
                  className="relative"
                >
                  <img
                    src={image.url}
                    alt={image.alt || `Image ${index + 1}`}
                    className="max-h-[80vh] w-full object-contain mx-auto"
                  />
                  <ul className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex z-50">
                    {validImages.map((_, dotIndex) => (
                      <li
                        key={dotIndex}
                        onClick={() => setFullscreenIndex(dotIndex)}
                        className={`w-3 h-3 mx-1 rounded-full border border-white cursor-pointer ${
                          fullscreenIndex === dotIndex ? "bg-sunny" : "bg-white"
                        }`}
                      />
                    ))}
                  </ul>
                  <div className="text-white text-center text-sm mt-6">
                    {image.alt || `Image ${index + 1}`}
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 mt-8 items-start">
        {/* LEFT SIDE – Description, Map, etc. */}
        <div className="lg:w-2/3 space-y-6">
          <div className="flex flex-wrap gap-2 items-center text-sm mb-4">
            <span className="flex items-center gap-1 px-4 py-2 rounded-full bg-lightyellow text-espressoy">
              <FaMoneyBillWave className="w-4 h-4" />
              {formatPrice(venue.price)}
            </span>

            {venue.meta?.wifi && (
              <span className="flex items-center gap-1 px-4 py-2 rounded-full bg-lightyellow text-espressoy">
                <FaWifi className="w-4 h-4" />
                WiFi
              </span>
            )}
            {venue.meta?.parking && (
              <span className="flex items-center gap-1 px-4 py-2 rounded-full bg-lightyellow text-espressoy">
                <FaParking className="w-4 h-4" />
                Parking
              </span>
            )}
            {venue.meta?.breakfast && (
              <span className="flex items-center gap-1 px-4 py-2 rounded-full bg-lightyellow text-espressoy">
                <GiCroissant className="w-4 h-4" />
                Breakfast
              </span>
            )}
            {venue.meta?.pets && (
              <span className="flex items-center gap-1 px-4 py-2 rounded-full bg-lightyellow text-espressoy">
                <FaDog className="w-4 h-4" />
                Pets allowed
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold">Description</h2>
          <div className="break-words whitespace-pre-wrap">
            {showFullDescription ? (
              <div
                className="description-styles"
                dangerouslySetInnerHTML={{ __html: venue.description }}
              />
            ) : (
              <div
                className="description-styles"
                dangerouslySetInnerHTML={{
                  __html: getTrimmedDescriptionHTML(
                    venue.description,
                    DESCRIPTION_MAX_CHARS
                  ),
                }}
              />
            )}

            {getTextContentLength(venue.description) >
              DESCRIPTION_MAX_CHARS && (
              <button
                onClick={() => setShowFullDescription((prev) => !prev)}
                className="mt-2 text-sm text-orangey font-medium underline hover:text-espressoy transition"
              >
                {showFullDescription ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-espressoy mb-2">
              Location
            </h2>
            <p className="break-words overflow-hidden">
              {venue.location.address}, {venue.location.city},{" "}
              {venue.location.country}
            </p>

            <div className="h-64 w-full mt-4 rounded overflow-hidden mb-16">
              <MapContainer
                center={markerPosition || [20, 0]}
                zoom={markerPosition ? 4 : 2}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {markerPosition && (
                  <Marker position={markerPosition}>
                    <Popup>{venue.location.country}</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
            {venue.owner && (
              <Link
                to={`/profile/${encodeURIComponent(venue.owner.name)}`}
                className="flex items-center gap-2 mt-4 group"
              >
                <img
                  src={venue.owner.avatar?.url?.trim() || PLACEHOLDER_AVATAR}
                  alt={
                    venue.owner.avatar?.alt?.trim() ||
                    `${venue.owner.name}'s avatar`
                  }
                  className="w-14 h-14 rounded-full object-cover group-hover:brightness-90 transition"
                />

                <span className="text-espressoy font-medium hover:underline break-words">
                  Hosted by {venue.owner.name}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT SIDE – Booking Summary + BookNow */}
        {/* Negative margin used to visually align this section with the left-side content */}
        <div className="lg:w-1/3 space-y-4 self-start mt-[-6px]">
          <BookNow venue={venue} />
          {venue.bookings?.length > 0 && (
            <VenueAvailabilityCalendar bookedRanges={bookedRanges} />
          )}
          <div className="bg-lightyellow rounded-xl shadow p-4">
            <h2 className="text-xl text-gray-900 pb-2 font-bold">
              Amenities and price
            </h2>
            <img
              src={validImages[0]?.url}
              alt={validImages[0]?.alt || "Venue image"}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            {venue.rating ? (
              <div className="mt-1">
                <StarRating rating={venue.rating} />
              </div>
            ) : (
              <p className="text-sm text-gray-400 mt-1">No rating yet</p>
            )}
            <h3 className="font-semibold text-lg text-espressoy break-words">
              {truncateTitle(venue?.name || "Unnamed Venue")}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              <FaMoneyBillWave className="inline mr-1" />
              {formatPrice(venue.price)} per person per night
            </p>
            <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
              {venue.meta?.wifi && (
                <li>
                  <FaWifi className="inline mr-1" />
                  WiFi
                </li>
              )}
              {venue.meta?.parking && (
                <li>
                  <FaParking className="inline mr-1" />
                  Parking
                </li>
              )}
              {venue.meta?.breakfast && (
                <li>
                  <GiCroissant className="inline mr-1" />
                  Breakfast
                </li>
              )}
              {venue.meta?.pets && (
                <li>
                  <FaDog className="inline mr-1" />
                  Pets allowed
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenuePage;
