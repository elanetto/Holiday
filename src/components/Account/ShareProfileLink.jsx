import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaCopy } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ShareProfileLink() {
  const location = useLocation();
  const inputRef = useRef(null);
  const [profileLink, setProfileLink] = useState("");

  useEffect(() => {
    const currentUrl = window.location.origin + location.pathname;
    const profileUrl = currentUrl.replace("/account", "/profile");
    setProfileLink(profileUrl);
  }, [location]);

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value).then(() => {
        toast.success("Profile link copied to clipboard!");
      });
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        readOnly
        value={profileLink}
        ref={inputRef}
        className="w-full border border-espressoy bg-white text-gray-800 p-2 pr-24 rounded"
      />
      <button
        onClick={handleCopy}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-sunny text-espressoy px-3 py-1.5 rounded hover:bg-orangey hover:text-white flex items-center gap-1 text-sm"
      >
        <FaCopy /> Share
      </button>
    </div>
  );
}
