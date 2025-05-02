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
        : [{ url: PLACEHOLDER_VENUE, alt: "Default venue preview" }],
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

    if (!formData.location.continent.trim()) {
      newErrors.continent = "Continent is required";
    }

    if (!formData.location.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.location.zip.trim()) {
      newErrors.zip = "Zip code is required";
    }

    if (!/^[\p{Lu}][\p{L}\s'-]{2,}$/u.test(formData.name.trim())) {
      newErrors.name =
        "Name must start with a capital letter, contain only letters, spaces, hyphens, or apostrophes, and be at least 3 characters long";
    }

    if (formData.description.trim().split(/\s+/).length < 2) {
      newErrors.description = "Description must be at least two words";
    }

    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.maxGuests <= 0)
      newErrors.maxGuests = "Max guests must be greater than 0";

    if (!formData.location.city.trim()) newErrors.city = "City is required";
    if (!formData.location.country.trim())
      newErrors.country = "Country is required";

    formData.media.forEach((media, index) => {
      if (!media.url || media.url === PLACEHOLDER_VENUE) {
        newErrors[`media-${index}-url`] =
          "Image URL is required and must not be a placeholder";
      } else if (!/^https?:\/\/.+\..+/.test(media.url)) {
        newErrors[`media-${index}-url`] = "Image URL must be a valid link";
      }

      if (!media.alt || media.alt.trim().length < 3) {
        newErrors[`media-${index}-alt`] =
          "Alt text must be at least 3 characters";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl max-w-3xl mx-auto shadow space-y-6"
    >
      <h2 className="text-xl font-bold text-espressoy">
        {mode === "edit" ? "Edit Venue" : "Create New Venue"}
      </h2>

      {/* Name */}
      <div>
        <label className="text-sm block">Venue Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          className={`w-full border p-2 rounded ${
            errors.name && touched.name ? "border-error" : "border-espressoy"
          }`}
        />
        {errors.name && touched.name && (
          <p className="text-error text-sm">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="text-sm block">Description *</label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          onBlur={() => handleBlur("description")}
          className={`w-full border p-2 rounded ${
            errors.description && touched.description
              ? "border-error"
              : "border-espressoy"
          }`}
        />
        {errors.description && touched.description && (
          <p className="text-error text-sm">{errors.description}</p>
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
            className={`w-full border p-2 rounded ${
              errors.price && touched.price
                ? "border-error"
                : "border-espressoy"
            }`}
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
            onChange={(e) => handleChange("maxGuests", Number(e.target.value))}
            onBlur={() => handleBlur("maxGuests")}
            className={`w-full border p-2 rounded ${
              errors.maxGuests && touched.maxGuests
                ? "border-error"
                : "border-espressoy"
            }`}
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
          <input
            type="text"
            placeholder="Address"
            value={formData.location.address}
            onChange={(e) => handleLocationChange("address", e.target.value)}
            onBlur={() => handleBlur("address")}
            className={`border p-2 rounded ${
              errors.address && touched.address
                ? "border-error"
                : "border-espressoy"
            }`}
          />
          {errors.address && touched.address && (
            <p className="text-error text-sm mt-1">{errors.address}</p>
          )}

          <input
            type="text"
            placeholder="Zip Code"
            value={formData.location.zip}
            onChange={(e) => handleLocationChange("zip", e.target.value)}
            onBlur={() => handleBlur("zip")}
            className={`border p-2 rounded ${
              errors.zip && touched.zip ? "border-error" : "border-espressoy"
            }`}
          />
          {errors.zip && touched.zip && (
            <p className="text-error text-sm mt-1">{errors.zip}</p>
          )}

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

          <input
            type="text"
            placeholder="Continent"
            value={formData.location.continent}
            onChange={(e) => handleLocationChange("continent", e.target.value)}
            onBlur={() => handleBlur("continent")}
            className={`border p-2 rounded col-span-2 ${
              errors.continent && touched.continent
                ? "border-error"
                : "border-espressoy"
            }`}
          />
          {errors.continent && touched.continent && (
            <p className="text-error text-sm mt-1">{errors.continent}</p>
          )}
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="text-sm block">Images *</label>
        {formData.media.map((media, index) => (
          <div key={index} className="mb-4 border p-2 rounded">
            <input
              type="text"
              placeholder="Image URL"
              value={media.url}
              onChange={(e) => handleImageChange(index, "url", e.target.value)}
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
              placeholder="Alt text"
              value={media.alt}
              onChange={(e) => handleImageChange(index, "alt", e.target.value)}
              className={`w-full border p-2 rounded ${
                errors[`media-${index}-alt`]
                  ? "border-error"
                  : "border-espressoy"
              }`}
            />
            {errors[`media-${index}-alt`] && (
              <p className="text-error text-sm mt-1">
                {errors[`media-${index}-alt`]}
              </p>
            )}
            <div className="mt-2">
              <img
                src={media.url || PLACEHOLDER_VENUE}
                alt={media.alt || "Venue preview image"}
                className="h-64 w-full object-cover rounded"
              />
              <p className="text-xs text-center mt-1 italic text-gray-600">
                {media.alt || "No alt text provided"}
              </p>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddImage}
          className="mt-2 px-4 py-2 bg-creamy border border-espressoy rounded hover:bg-orangey hover:text-white"
        >
          + Add another image
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sunny hover:bg-orangey hover:text-white text-espressoy py-2 rounded-full font-semibold"
      >
        {loading
          ? "Saving..."
          : mode === "edit"
          ? "Update Venue"
          : "Create Venue"}
      </button>
    </form>
  );
}
