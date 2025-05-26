/**
 * Validates an image alt text string.
 * @param {string} altText - The alt text to validate.
 * @returns {string|null} - Returns an error message or null if valid.
 */
export function validateAltText(altText) {
  const trimmed = altText?.trim() || "";
  if (trimmed.length < 3) {
    return "Descriptive text about the image must be at least 3 characters";
  }

  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount > 20 || trimmed.length > 80) {
    return "Descriptive text about the image must be at most 20 words and 80 characters";
  }

  return null;
}

/**
 * Validates maxGuests field.
 */
export function validateMaxGuests(value) {
  if (value <= 0) return "Max guests must be greater than 0";
  if (value > 100) return "Max guests cannot be more than 100";
  return null;
}

/**
 * Validates a basic text field for word and length limits.
 */
export function validateShortText(value, label, maxWords = 3, maxLength = 30) {
  const trimmed = value.trim();
  const words = trimmed.split(/\s+/);
  if (!trimmed) return `${label} is required`;
  if (words.length > maxWords || trimmed.length > maxLength)
    return `${label} must be max ${maxWords} words and ${maxLength} characters`;
  return null;
}

/**
 * Validates zip code format.
 */
export function validateZip(zip) {
  const trimmed = zip.trim();
  if (!trimmed) return "Zip code is required";
  if (!/^\d{1,8}$/.test(trimmed)) return "Zip code must be up to 8 digits only";
  return null;
}

/**
 * Validates venue name.
 */
export function validateVenueName(name) {
  const pattern = /^[A-Z][a-zA-Z0-9\s,'\-:.\u2013\u2014]{2,}$/;
  if (!pattern.test(name.trim())) {
    return "Name must start with a capital letter and can include letters, numbers, spaces, commas, colons, hyphens, apostrophes, and periods.";
  }
  return null;
}

/**
 * Validates description word count.
 */
export function validateDescription(description) {
  if (description.trim().split(/\s+/).length < 2) {
    return "Description must be at least two words";
  }
  return null;
}

/**
 * Validates price.
 */
export function validatePrice(price) {
  return price <= 0 ? "Price must be greater than 0" : null;
}

/**
 * Validates media URL.
 */
export function validateImageUrl(url, placeholder) {
  if (!url || url === placeholder) {
    return "Image URL is required and must not be a placeholder";
  } else if (!/^https?:\/\/.+\..+/.test(url)) {
    return "Image URL must be a valid link";
  }
  return null;
}

/**
 * Validates host name.
 */
export function validateHostName(name) {
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return "Host name is invalid or too short";
  }
  return null;
}

export function validateFullName(name) {
  const trimmed = name.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length < 2 || parts.some((part) => part.length < 2)) {
    return "Please enter your full name";
  }

  return null;
}

export function validateNorwegianAddress(address) {
  const trimmed = address.trim();

  // Match at least one letter word, followed by space, then at least one number
  const pattern = /^[A-Za-zæøåÆØÅ\s]{2,}\s\d+[A-Za-z]?$/;

  if (!pattern.test(trimmed)) {
    return "Please enter your street name and number";
  }

  return null;
}
