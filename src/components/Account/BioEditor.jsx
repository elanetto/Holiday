import { useState, useEffect } from "react";
import { useUser } from "../../contexts/useUser";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ENDPOINTS } from "../../utilities/constants";

export default function BioEditor() {
  const { name, loginUser } = useUser();
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentBio, setCurrentBio] = useState("");

  useEffect(() => {
    const fetchBio = async () => {
      const token = localStorage.getItem("token");
      const apiKey = localStorage.getItem("apiKey");

      if (!token || !apiKey) return;

      try {
        const res = await axios.get(`${ENDPOINTS.profiles}/${name}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        });

        const userBio = res.data.data.bio || "";
        setCurrentBio(userBio);
        setBio(userBio);
      } catch (err) {
        console.error("Failed to load current bio:", err);
        toast.error("Could not load current bio.");
      }
    };

    fetchBio();
  }, [name]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const apiKey = localStorage.getItem("apiKey");

      if (!token || !apiKey) {
        throw new Error("Missing token or API key");
      }

      const res = await axios.put(
        `${ENDPOINTS.profiles}/${name}`,
        { bio },
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
      });

      setCurrentBio(res.data.data.bio);
      toast.success("Bio updated!");
    } catch (err) {
      console.error("❌ Bio update failed:", err);
      toast.error("Could not update bio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-4 text-left">
      <h3 className="text-lg font-semibold text-espressoy">Edit your bio</h3>

      {/* Current Bio Preview */}
      <div className="text-gray-800 italic bg-creamy p-2">
        <p className="text-sm font-semibold mb-1">My bio:</p>
        <p className="text-sm">
          {currentBio.trim() ? currentBio : "You haven't added a bio yet."}
        </p>
      </div>

      {/* Bio Textarea */}
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={4}
        placeholder="Write something cool about yourself..."
        className="w-full border border-espressoy rounded p-3 resize-none focus:outline-none bg-white"
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-sunny hover:bg-orangey hover:text-white text-espressoy px-4 py-2 rounded-full font-semibold"
      >
        {loading ? "Saving..." : "Save Bio"}
      </button>
    </div>
  );
}
