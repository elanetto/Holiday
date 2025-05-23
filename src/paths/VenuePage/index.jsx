import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../../utilities/constants";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { PLACEHOLDER_VENUE } from "../../utilities/placeholders";
import { BsCaretLeftFill, BsCaretRightFill, BsX } from "react-icons/bs";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getCountryCoordinates } from "../../utilities/countryCoordinates";
import BookNow from "../../components/Booking/BookNow";

const VenuePage = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [validImages, setValidImages] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const navigate = useNavigate();

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
                resolve({ url: PLACEHOLDER_VENUE, alt: "Placeholder" });
            })
        )
      ).then((results) => setValidImages(results));
    }
  }, [venue]);

  if (!venue) return <p className="p-4">Loading venue...</p>;

  const markerPosition = getCountryCoordinates(venue.location.country);

  const getTrimmedDescriptionHTML = (html, limit = 200) => {
    if (!html) return "";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
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

          // Skip the first heading tag (h1–h6)
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
    if (charCount >= limit) result += "...";

    return result;
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1
        className="text-3xl font-bold text-espressoy mb-4 truncate"
        title={venue.name}
      >
        {venue.name}
      </h1>

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
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-sunny p-2 rounded-full z-10 shadow cursor-pointer"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-sunny p-2 rounded-full z-10 shadow cursor-pointer"
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
                  className="w-full max-h-[500px] object-cover"
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
        <div key={index} onClick={(e) => e.stopPropagation()} className="relative">
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


      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Description</h2>
        <div>
          {showFullDescription ? (
            <div
              className="description-styles"
              dangerouslySetInnerHTML={{ __html: venue.description }}
            />
          ) : (
            <div
              className="description-styles"
              dangerouslySetInnerHTML={{
                __html: getTrimmedDescriptionHTML(venue.description, 200),
              }}
            />
          )}

          {venue.description?.split(" ").length > 200 && (
            <button
              onClick={() => setShowFullDescription((prev) => !prev)}
              className="mt-2 text-sm text-orangey font-medium underline hover:text-espressoy transition"
            >
              {showFullDescription ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {venue.bookings?.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-espressoy mb-2">
              Booked Dates
            </h2>
            <ul className="text-sm text-gray-700 list-disc list-inside">
              {venue.bookings.map((booking) => {
                const from = new Date(booking.dateFrom).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  }
                );
                const to = new Date(booking.dateTo).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  }
                );
                return (
                  <li key={booking.id}>
                    📅 Booked: {from} – {to}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="flex gap-4 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-sunny text-white">
            💰 {venue.price} NOK/night
          </span>
          <span className="px-3 py-1 rounded-full bg-goldy text-white">
            👥 Max {venue.maxGuests} guests
          </span>
          <span className="px-3 py-1 rounded-full bg-greeney text-white">
            ⭐ {venue.rating || 0}/5
          </span>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-espressoy mb-2">
            Amenities
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            {venue.meta?.wifi && <li>📶 WiFi</li>}
            {venue.meta?.parking && <li>🄹️ Parking</li>}
            {venue.meta?.breakfast && <li>🥐 Breakfast</li>}
            {venue.meta?.pets && <li>🐶 Pets allowed</li>}
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-espressoy mb-2">
            Location
          </h2>
          <p>
            {venue.location.address}, {venue.location.city},{" "}
            {venue.location.country}
          </p>
          <div className="h-64 w-full mt-4 rounded overflow-hidden">
            <MapContainer
              center={markerPosition || [20, 0]}
              zoom={markerPosition ? 4 : 2}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
              />
              {markerPosition && (
                <Marker position={markerPosition}>
                  <Popup>{venue.location.country}</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

        {venue && <BookNow venue={venue} />}

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-espressoy mb-2">Host</h2>
          <div className="rounded-xl overflow-hidden shadow">
            {venue.owner?.banner?.url && (
              <img
                src={venue.owner.banner.url}
                alt={venue.owner.banner.alt || `${venue.owner.name}'s banner`}
                className="w-full h-40 object-cover"
              />
            )}
            <Link
              to={`/profile/${venue.owner?.name}`}
              className="p-4 flex gap-4 items-center hover:bg-creamy cursor-pointer"
            >
              <img
                src={venue.owner?.avatar?.url || PLACEHOLDER_VENUE}
                alt={venue.owner?.avatar?.alt || venue.owner?.name}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => (e.target.src = PLACEHOLDER_VENUE)}
              />
              <div>
                <p className="font-bold text-lg">{venue.owner?.name}</p>
                <p className="text-sm text-gray-500">{venue.owner?.email}</p>
                {venue.owner?.bio && (
                  <p className="text-sm mt-1">{venue.owner.bio}</p>
                )}
              </div>
            </Link>
            <div className="bg-creamy px-4 py-2 text-sm text-gray-600 border-t border-espressoy">
              <p>Created: {new Date(venue.created).toLocaleDateString()}</p>
              <p>
                Last updated: {new Date(venue.updated).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenuePage;
