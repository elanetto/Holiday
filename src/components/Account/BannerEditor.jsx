import { useEffect, useState } from "react";
import { useUser } from "../../contexts/useUser";
import { toast } from "react-hot-toast";
import axios from "axios";
import { ENDPOINTS } from "../../utilities/constants";
import { PLACEHOLDER_BANNER } from "../../utilities/placeholders";

const presetBanners = [
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80", // city night
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80", // beach
  "https://images.unsplash.com/photo-1549887534-238fa218a0d5?auto=format&fit=crop&w=1400&q=80", // aurora
  "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?auto=format&fit=crop&w=1400&q=80"  // travel
];

export default function BannerEditor() {
  const { name, loginUser } = useUser();
  const [customUrl, setCustomUrl] = useState("");
  const [selectedBanner, setSelectedBanner] = useState(PLACEHOLDER_BANNER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("banner");
    try {
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed?.url) {
        setSelectedBanner(parsed.url);
      }
    } catch {
      setSelectedBanner(PLACEHOLDER_BANNER);
    }
  }, []);

  useEffect(() => {
    if (customUrl.trim()) {
      setSelectedBanner(customUrl);
    }
  }, [customUrl]);

  const handleSave = async () => {
    setLoading(true);
  
    try {
      const token = localStorage.getItem("token");
      const apiKey = localStorage.getItem("apiKey");
  
      if (!token || !apiKey) {
        toast.error("Missing token or API key. Please log in again.");
        return;
      }
  
      const url = `${ENDPOINTS.profiles}/${name}`;
  
      const res = await axios.put(
        url,
        {
          banner: {
            url: selectedBanner,
            alt: `${name}'s banner`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );
  
      loginUser({
        ...res.data.data,
        token,
        isAdmin: localStorage.getItem("isAdmin") === "true",
        apiKey,
      });
  
      localStorage.setItem("banner", JSON.stringify(res.data.data.banner));
      toast.success("Banner updated!");
    } catch (err) {
      console.error("❌ Banner update failed:", err);
      if (err?.response?.status === 403) {
        toast.error("Session expired or unauthorized. Please log in again.");
      } else {
        toast.error("Could not update banner. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="mt-6 space-y-4 text-left">
      <h3 className="text-lg font-semibold">Choose your banner</h3>

      <div className="w-full h-40 rounded-xl border border-espressoy overflow-hidden">
        {selectedBanner ? (
          <img
            src={selectedBanner}
            alt="Banner preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
            No banner selected
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Paste custom banner URL"
        className="w-full border p-2 rounded focus:outline-none border-espressoy"
        value={customUrl}
        onChange={(e) => setCustomUrl(e.target.value)}
      />

      <div className="flex flex-wrap gap-3 mt-2">
        {presetBanners.map((url, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedBanner(url);
              setCustomUrl("");
            }}
            className={`w-28 h-16 rounded-lg border-2 overflow-hidden transition-all duration-150 ${
              selectedBanner === url ? "border-espressoy" : "border-gray-300"
            }`}
          >
            <img src={url} alt="Banner" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <button
        className="bg-sunny hover:bg-orangey hover:text-white text-espressoy px-4 py-2 rounded-full font-semibold mt-4"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Banner"}
      </button>
    </div>
  );
}