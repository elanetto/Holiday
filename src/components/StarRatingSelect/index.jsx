import Select from "react-select";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

/**
 * @param {number} value - Current selected rating
 * @param {function} onChange - Callback with selected value
 */
export default function StarRatingSelect({ value, onChange }) {
  const max = 5;

  const getStarIcons = (rating) => {
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
    const empty = max - full - (hasHalf ? 1 : 0);
    const stars = [];

    for (let i = 0; i < full; i++) stars.push(<FaStar key={`full-${i}`} className="text-sunny" />);
    if (hasHalf) stars.push(<FaStarHalfAlt key="half" className="text-sunny" />);
    for (let i = 0; i < empty; i++) stars.push(<FaRegStar key={`empty-${i}`} className="text-sunny" />);

    return <div className="flex items-center gap-[2px]">{stars}</div>;
  };

  const ratingOptions = [
    { value: 0, label: <span className="text-sm text-gray-500">Unrated</span> },
    ...Array.from({ length: 10 }, (_, i) => {
      const rating = (i + 1) * 0.5;
      return {
        value: rating,
        label: getStarIcons(rating),
      };
    }),
  ];

  return (
    <Select
      options={ratingOptions}
      value={ratingOptions.find((opt) => opt.value === value)}
      onChange={(option) => onChange(option.value)}
      className="text-left"
      styles={{
        control: (base) => ({ ...base, backgroundColor: "white" }),
        menu: (base) => ({ ...base, backgroundColor: "white", zIndex: 20 }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? "#f0f0f0" : "white",
          color: "black",
        }),
        singleValue: (base) => ({ ...base, display: "flex", alignItems: "center" }),
      }}
    />
  );
}
