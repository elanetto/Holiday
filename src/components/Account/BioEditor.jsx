import { useState, useEffect } from "react";
import { useUser } from "../../contexts/useUser";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ENDPOINTS } from "../../utilities/constants";

export default function BioEditor() {
  const { name, loginUser } = useUser();
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedBio = localStorage.getItem("bio");
    if (savedBio) {
      setBio(savedBio);
    }
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const apiKey = localStorage.getItem("apiKey");

      if (!token || !apiKey) {
        throw new Error("Missing token or API key");
      }

      console.log("🧪 PUT to:", `${ENDPOINTS.profiles}/${name}`);

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

      localStorage.setItem("bio", res.data.data.bio);
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
      <h3 className="text-lg font-semibold">Edit your bio</h3>

      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={4}
        placeholder="Write something cool about yourself..."
        className="w-full border border-espressoy rounded p-3 resize-none focus:outline-none"
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
