import Select from "react-select";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import "country-flag-icons/react/3x2";

countries.registerLocale(enLocale);

const getCountryOptions = () => {
  const countryObj = countries.getNames("en", { select: "official" });

  return Object.entries(countryObj).map(([code, name]) => ({
    value: name,
    label: (
      <div className="flex items-center gap-2">
        <span className={`fi fi-${code.toLowerCase()}`} />
        {name}
      </div>
    ),
    code,
  }));
};

export default function FlaggedCountryDropdown({ value, onChange }) {
  const options = getCountryOptions();

  return (
    <Select
      options={options}
      onChange={(option) => onChange(option.value)}
      className="text-left"
      placeholder="Select country..."
      value={options.find((opt) => opt.value === value)}
    />
  );
}
