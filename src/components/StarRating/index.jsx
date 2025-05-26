import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

/**
 * @param {Object} props
 * @param {number} props.rating - The rating between 0 and 5 (e.g., 4.3)
 * @param {number} [props.max=5] - Max stars
 * @param {string} [props.className] - Optional Tailwind class
 */
const StarRating = ({ rating, max = 5, className = "" }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = max - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className={`flex items-center gap-[2px] text-sunny ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="w-4 h-4" />
      ))}
      {hasHalf && <FaStarHalfAlt className="w-4 h-4" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="w-4 h-4" />
      ))}
    </div>
  );
};

export default StarRating;
