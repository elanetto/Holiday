import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ENDPOINTS } from "../../utilities/constants";
import { PLACEHOLDER_VENUE } from "../../utilities/placeholders";
import Select from "react-select";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import regionData from "country-region-data/data.json";
import confetti from "canvas-confetti";
import RichTextEditor from "./../Forms/RichTextEditor";
import { BiWindowOpen, BiWindowClose } from "react-icons/bi";
import ConfirmModal from "./../Modals/ConfirmModal";

countries.registerLocale(enLocale);

const launchConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

const getCountryOptions = () => {
  const countryObj = countries.getNames("en", { select: "official" });
  return Object.entries(countryObj).map(([code, name]) => ({
    value: name,
    label: `${getEmojiFlag(code)} ${name}`,
    code,
  }));
};

const getEmojiFlag = (code) => {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));
};

function FlaggedCountryDropdown({ value, onChange }) {
  const options = getCountryOptions();
  return (
    <Select
      options={options}
      onChange={(option) => onChange(option.value)}
      className="text-left"
      classNamePrefix="react-select"
      placeholder="Select country..."
      value={options.find((opt) => opt.value === value)}
      styles={customStyles}
    />
  );
}

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "white",
    color: "black",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "white",
    color: "black",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#f0f0f0" : "white",
    color: "black",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "black",
  }),
};

export default function VenueForm({ mode = "create", venue = {} }) {
  const navigate = useNavigate();
  const [country, setCountry] = useState(venue?.location?.country || "");
  const [city, setCity] = useState(venue?.location?.city || "");
  const [cityOptions, setCityOptions] = useState([]);

  const [fullscreen, setFullscreen] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [imageToDeleteIndex, setImageToDeleteIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: venue.name || "",
    description: venue.description || "",
    price: venue.price || 0,
    maxGuests: venue.maxGuests || 1,
    rating: venue.rating || 0,
    meta: venue.meta || {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: venue.location || {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
    },
    media:
      venue.media && venue.media.length > 0
        ? venue.media
        : [{ url: PLACEHOLDER_VENUE, alt: "Describe the image" }],
  });

  useEffect(() => {
    const countryEntry = regionData.find(
      (entry) => entry.countryName === country
    );
    if (countryEntry && countryEntry.regions.length > 0) {
      const options = countryEntry.regions.map((region) => ({
        value: region.name,
        label: region.name,
      }));
      setCityOptions(options);
    } else {
      setCityOptions([]);
    }
  }, [country]);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const validate = () => {
    const newErrors = {};

    if (formData.maxGuests <= 0) {
      newErrors.maxGuests = "Max guests must be greater than 0";
    } else if (formData.maxGuests > 100) {
      newErrors.maxGuests = "Max guests cannot be more than 100";
    }

    // Continent: required, max 3 words and 30 chars
    const continentWords = formData.location.continent.trim().split(/\s+/);
    if (!formData.location.continent.trim()) {
      newErrors.continent = "Continent is required";
    } else if (
      continentWords.length > 3 ||
      formData.location.continent.trim().length > 30
    ) {
      newErrors.continent = "Continent must be max 3 words and 30 characters";
    }

    // Address: required, max 3 words and 30 chars
    const addressWords = formData.location.address.trim().split(/\s+/);
    if (!formData.location.address.trim()) {
      newErrors.address = "Address is required";
    } else if (
      addressWords.length > 3 ||
      formData.location.address.trim().length > 30
    ) {
      newErrors.address = "Address must be max 3 words and 30 characters";
    }

    // Zip: required, digits only, max 8
    if (!formData.location.zip.trim()) {
      newErrors.zip = "Zip code is required";
    } else if (!/^\d{1,8}$/.test(formData.location.zip.trim())) {
      newErrors.zip = "Zip code must be up to 8 digits only";
    }

    // Name
    if (
      !/^[A-Z][a-zA-Z0-9\s,'\-:.\u2013\u2014]{2,}$/.test(formData.name.trim())
    ) {
      newErrors.name =
        "Name must start with a capital letter and can include letters, numbers, spaces, commas, colons, hyphens, apostrophes, and periods.";
    }

    // Description
    if (formData.description.trim().split(/\s+/).length < 2) {
      newErrors.description = "Description must be at least two words";
    }

    // Price
    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    // City
    if (!formData.location.city.trim()) {
      newErrors.city = "City is required";
    }

    // Country
    if (!formData.location.country.trim()) {
      newErrors.country = "Country is required";
    }

    // Media
    formData.media.forEach((media, index) => {
      if (!media.url || media.url === PLACEHOLDER_VENUE) {
        newErrors[`media-${index}-url`] =
          "Image URL is required and must not be a placeholder";
      } else if (!/^https?:\/\/.+\..+/.test(media.url)) {
        newErrors[`media-${index}-url`] = "Image URL must be a valid link";
      }

      if (!media.alt || media.alt.trim().length < 3) {
        newErrors[`media-${index}-alt`] =
          "Descriptive text about the image must be at least 3 characters";
      } else {
        const wordCount = media.alt.trim().split(/\s+/).length;
        if (wordCount > 20 || media.alt.trim().length > 80) {
          newErrors[`media-${index}-alt`] =
            "Descriptive text about the image must be max 20 words and 80 characters";
        }
      }
    });

    setErrors(newErrors);
    return newErrors;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [key]: value },
    }));
  };

  const handleAddImage = () => {
    setFormData((prev) => ({
      ...prev,
      media: [
        ...prev.media,
        { url: PLACEHOLDER_VENUE, alt: "New venue image" },
      ],
    }));
  };

  const handleImageChange = (index, key, value) => {
    const updatedMedia = [...formData.media];
    updatedMedia[index][key] = value;
    setFormData((prev) => ({ ...prev, media: updatedMedia }));
  };

  const handleDeleteImage = (index) => {
    setImageToDeleteIndex(index);
    setShowConfirmModal(true);
  };

  const confirmDeleteImage = () => {
    setFormData((prev) => {
      const updatedMedia = [...prev.media];
      updatedMedia.splice(imageToDeleteIndex, 1);
      return { ...prev, media: updatedMedia };
    });
    setShowConfirmModal(false);
    setImageToDeleteIndex(null);
  };

  const cancelDeleteImage = () => {
    setShowConfirmModal(false);
    setImageToDeleteIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to show validation messages
    setTouched({
      name: true,
      description: true,
      price: true,
      maxGuests: true,
      address: true,
      zip: true,
      city: true,
      country: true,
      continent: true,
      ...Object.fromEntries(
        formData.media.flatMap((_, index) => [
          [`media-${index}-url`, true],
          [`media-${index}-alt`, true],
        ])
      ),
    });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiKey = localStorage.getItem("apiKey");
      const url =
        mode === "edit" ? `${ENDPOINTS.venues}/${venue.id}` : ENDPOINTS.venues;
      const method = mode === "edit" ? "put" : "post";

      // Clean up form data before sending
      const payload = { ...formData };
      payload.rating = Math.round(payload.rating);

      // Remove optional fields if they are empty
      if (!payload.location.address.trim()) delete payload.location.address;
      if (!payload.location.zip.trim()) delete payload.location.zip;
      if (!payload.location.continent.trim()) delete payload.location.continent;

      payload.media = payload.media.filter(
        (m) =>
          m.url &&
          m.url !== PLACEHOLDER_VENUE &&
          /^https?:\/\/.+\..+/.test(m.url) &&
          m.alt &&
          m.alt.trim().length >= 3
      );

      const response = await axios[method](url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
          "Content-Type": "application/json",
        },
      });

      const newVenueId = response?.data?.data?.id;
      toast.success(
        `Venue ${mode === "edit" ? "updated" : "created"} successfully!`
      );
      launchConfetti();

      const venueIdToNavigate = mode === "edit" ? venue.id : newVenueId;
      if (venueIdToNavigate) {
        navigate(`/venue/${venueIdToNavigate}`);
      }
    } catch (err) {
      const apiError =
        err?.response?.data?.errors ||
        err?.response?.data?.message ||
        err.message;
      toast.error(
        "An error occurred while saving the venue. Please try again."
      );

      console.error("Venue error:", apiError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Determines the CSS class for an input field based on its error and touched states.
   *
   * @param {boolean} error - Indicates whether the input field has an error.
   * @param {boolean} touched - Indicates whether the input field has been interacted with.
   * @returns {string} The CSS class name for the input field.
   */
  const getInputClassName = (error, touched) => {
    return `w-full border p-2 rounded ${
      error && touched ? "border-error" : "border-espressoy"
    }`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl max-w-7xl mx-auto shadow"
    >
      <h2 className="text-xl font-bold text-espressoy mb-6">
        {mode === "edit" ? "Edit Venue" : "Create New Venue"}
      </h2>

      <div className="flex flex-col md:flex-row md:gap-12">
        {/* LEFT SIDE: FORM FIELDS */}
        <div className="md:w-3/5 space-y-6">
          {/* Name */}
          <div>
            <label className="text-sm block">Venue Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              className={getInputClassName(errors.name, touched.name)}
            />
            {errors.name && touched.name && (
              <p className="text-error text-sm">{errors.name}</p>
            )}
          </div>

          {/* Description - NOW A RICH TEXT EDITOR */}
          <div className="relative">
            <label className="text-sm block mb-1">Description *</label>
            <button
              type="button"
              onClick={() => setFullscreen((prev) => !prev)}
              className="absolute right-0 top-0 text-sm text-espressoy underline flex items-center gap-1"
            >
              {fullscreen ? (
                <>
                  <span>Exit</span>
                  <BiWindowClose className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>Fullscreen</span>
                  <BiWindowOpen className="h-4 w-4" />
                </>
              )}
            </button>
            {fullscreen && (
              <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm" />
            )}
            <div
              className={`mt-6 ${
                fullscreen
                  ? "fixed inset-0 z-[9999] overflow-auto w-screen h-screen m-0 p-16"
                  : ""
              }`}
            >
              <RichTextEditor
                value={formData.description}
                onChange={(val) => handleChange("description", val)}
                fullscreen={fullscreen}
                heightClass={fullscreen ? "h-[70vh]" : "h-64"}
              />
              {fullscreen && (
                <div className="mt-4 text-right">
                  <button
                    type="button"
                    onClick={() => setFullscreen(false)}
                    className="bg-sunny hover:bg-orangey text-white font-semibold px-4 py-2 rounded cursor-pointer"
                  >
                    Done Writing
                  </button>
                </div>
              )}
            </div>
            {!fullscreen && errors.description && touched.description && (
              <p className="text-error text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Price and Guests */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm block">Price per night *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", Number(e.target.value))}
                onBlur={() => handleBlur("price")}
                className={getInputClassName(errors.price, touched.price)}
              />
              {errors.price && touched.price && (
                <p className="text-error text-sm">{errors.price}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="text-sm block">Max Guests *</label>
              <input
                type="number"
                min={1}
                max={100}
                value={formData.maxGuests}
                onChange={(e) =>
                  handleChange("maxGuests", Number(e.target.value))
                }
                onBlur={() => handleBlur("maxGuests")}
                className={getInputClassName(
                  errors.maxGuests,
                  touched.maxGuests
                )}
              />
              {errors.maxGuests && touched.maxGuests && (
                <p className="text-error text-sm">{errors.maxGuests}</p>
              )}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="text-sm block">Initial Rating (optional)</label>
            <Select
              options={[
                { value: 0, label: "Unrated" },
                { value: 1, label: "★☆☆☆☆" },
                { value: 2, label: "★★☆☆☆" },
                { value: 3, label: "★★★☆☆" },
                { value: 4, label: "★★★★☆" },
                { value: 5, label: "★★★★★" },
              ]}
              value={{
                value: formData.rating,
                label:
                  "★".repeat(formData.rating) + "☆".repeat(5 - formData.rating),
              }}
              onChange={(option) => handleChange("rating", option.value)}
              className="text-left"
              styles={customStyles}
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="text-sm block mb-2">Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["wifi", "parking", "breakfast", "pets"].map((feature) => (
                <label key={feature} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.meta[feature]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        meta: { ...prev.meta, [feature]: e.target.checked },
                      }))
                    }
                  />
                  {feature.charAt(0).toUpperCase() + feature.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm block mb-2">Location</label>
            <div className="grid grid-cols-2 gap-4">
              {/* Address */}
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Address"
                  value={formData.location.address}
                  onChange={(e) =>
                    handleLocationChange("address", e.target.value)
                  }
                  onBlur={() => handleBlur("address")}
                  className={getInputClassName(errors.address, touched.address)}
                />
                {errors.address && touched.address && (
                  <p className="text-error text-sm mt-1">{errors.address}</p>
                )}
              </div>

              {/* Zip Code */}
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={formData.location.zip}
                  onChange={(e) => handleLocationChange("zip", e.target.value)}
                  onBlur={() => handleBlur("zip")}
                  className={getInputClassName(errors.zip, touched.zip)}
                />
                {errors.zip && touched.zip && (
                  <p className="text-error text-sm mt-1">{errors.zip}</p>
                )}
              </div>

              {/* Country */}
              <div className="col-span-1">
                <FlaggedCountryDropdown
                  value={country}
                  onChange={(val) => {
                    setCountry(val);
                    handleLocationChange("country", val);
                  }}
                />
                {touched.country && errors.country && (
                  <p className="text-error text-sm mt-1">{errors.country}</p>
                )}
              </div>

              {/* City */}
              <div className="col-span-1">
                <Select
                  options={cityOptions}
                  value={cityOptions.find((opt) => opt.value === city) || null}
                  onChange={(option) => {
                    setCity(option.value);
                    handleLocationChange("city", option.value);
                  }}
                  className="text-left"
                  placeholder="Select city..."
                  styles={customStyles}
                />
                {touched.city && errors.city && (
                  <p className="text-error text-sm mt-1">{errors.city}</p>
                )}
              </div>

              {/* Continent */}
              <input
                type="text"
                placeholder="Continent"
                value={formData.location.continent}
                onChange={(e) =>
                  handleLocationChange("continent", e.target.value)
                }
                onBlur={() => handleBlur("continent")}
                className={`border p-2 rounded col-span-2 ${
                  errors.continent && touched.continent
                    ? "border-error"
                    : "border-espressoy"
                }`}
              />
              {errors.continent && touched.continent && (
                <p className="text-error text-sm mt-1 col-span-2">
                  {errors.continent}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: IMAGES */}
        <div className="md:w-2/5 space-y-4">
          <label className="text-sm">Images *</label>
          {formData.media.map((media, index) => (
            <div key={index} className="border p-2 rounded relative">
              <input
                type="text"
                placeholder="Image URL"
                value={media.url}
                onChange={(e) =>
                  handleImageChange(index, "url", e.target.value)
                }
                className={`w-full mb-2 border p-2 rounded ${
                  errors[`media-${index}-url`]
                    ? "border-error"
                    : "border-espressoy"
                }`}
              />
              {errors[`media-${index}-url`] && (
                <p className="text-error text-sm mt-1">
                  {errors[`media-${index}-url`]}
                </p>
              )}
              <input
                type="text"
                placeholder="Descriptive text: what is in the image?"
                value={media.alt}
                onChange={(e) =>
                  handleImageChange(index, "alt", e.target.value)
                }
                onBlur={() =>
                  setTouched((prev) => ({
                    ...prev,
                    [`media-${index}-alt`]: true,
                  }))
                }
                className={getInputClassName(
                  errors[`media-${index}-alt`],
                  touched[`media-${index}-alt`]
                )}
              />
              {errors[`media-${index}-alt`] &&
                touched[`media-${index}-alt`] && (
                  <p className="text-error text-sm mt-1">
                    {errors[`media-${index}-alt`]}
                  </p>
                )}

              <div className="mt-2 relative">
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-2 right-2 bg-red-800 text-white text-xs px-2 py-1 rounded hover:bg-red-500 z-10"
                  aria-label="Delete image"
                >
                  X
                </button>
                <img
                  src={media.url || PLACEHOLDER_VENUE}
                  alt={media.alt || "Venue preview image"}
                  className="h-48 w-full object-cover rounded"
                />
                <p className="text-xs text-center mt-1 italic text-gray-600">
                  {media.alt || "No descriptive text provided"}
                </p>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddImage}
            className="w-full mt-2 px-4 py-2 bg-creamy border border-espressoy rounded hover:bg-orangey hover:text-white"
          >
            + Add another image
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full md:w-auto px-8 bg-sunny hover:bg-orangey hover:text-white text-espressoy py-2 rounded-full font-semibold mx-auto block"
      >
        {loading
          ? "Saving..."
          : mode === "edit"
          ? "Update Venue"
          : "Create Venue"}
      </button>
      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete this image?"
          onConfirm={confirmDeleteImage}
          onCancel={cancelDeleteImage}
        />
      )}
    </form>
  );
}
