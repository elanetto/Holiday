import { useEffect, useState } from "react";
import { useUser } from "../../contexts/useUser";
import { toast } from "react-hot-toast";
import axios from "axios";
import { ENDPOINTS } from "../../utilities/constants";
import { PLACEHOLDER_AVATAR } from "../../utilities/placeholders";

const presetAvatars = [
  "https://raw.githubusercontent.com/elanetto/Holiday/c57b65c718a51299ee10cbd64c850fff83d4b318/src/assets/avatar/avatar_option_1.svg",
  "https://raw.githubusercontent.com/elanetto/Holiday/c57b65c718a51299ee10cbd64c850fff83d4b318/src/assets/avatar/avatar_option_2.svg",
  "https://raw.githubusercontent.com/elanetto/Holiday/c57b65c718a51299ee10cbd64c850fff83d4b318/src/assets/avatar/avatar_option_3.svg",
  "https://raw.githubusercontent.com/elanetto/Holiday/c57b65c718a51299ee10cbd64c850fff83d4b318/src/assets/avatar/avatar_option_4.svg",
];

export default function AvatarEditor() {
  const { name, avatar, loginUser } = useUser();
  const [customUrl, setCustomUrl] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const parsed = typeof avatar === "string" ? JSON.parse(avatar) : avatar;
      setSelectedAvatar(parsed?.url || parsed || PLACEHOLDER_AVATAR);
    } catch {
      setSelectedAvatar(avatar || PLACEHOLDER_AVATAR);
    }
  }, [avatar]);

  useEffect(() => {
    if (customUrl.trim()) {
      setSelectedAvatar(customUrl);
    }
  }, [customUrl]);

  const handleSave = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const apiKey = localStorage.getItem("apiKey");

      if (!token || !apiKey || !name) {
        toast.error("You are not properly logged in.");
        return;
      }

      const url = `${ENDPOINTS.profiles}/${name}`;
      console.log("🧪 PUT to:", url);

      const response = await axios.put(
        url,
        {
          avatar: {
            url: selectedAvatar,
            alt: `${name}'s avatar`,
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
        ...response.data.data,
        token,
        isAdmin: localStorage.getItem("isAdmin") === "true",
      });

      toast.success("Avatar updated!");
    } catch (err) {
      console.error("❌ Avatar update failed:", err);
      toast.error(
        "Could not update avatar. Please check the URL or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-4 text-left">
      <h3 className="text-lg font-semibold">Choose your avatar</h3>

      <div className="flex items-center gap-4">
        {selectedAvatar && (
          <img
            src={selectedAvatar}
            alt="Avatar preview"
            className="w-24 h-24 rounded-full border-2 border-espressoy object-cover"
          />
        )}

        <input
          type="text"
          placeholder="Paste custom avatar URL"
          className="w-full border p-2 rounded focus:outline-none border-espressoy"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
        />
      </div>

      <div className="flex gap-3 mt-2">
        {presetAvatars.map((url, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedAvatar(url);
              setCustomUrl("");
            }}
            className={`w-10 h-10 rounded-full border-2 overflow-hidden ${
              selectedAvatar === url ? "border-espressoy" : "border-gray-300"
            }`}
          >
            <img src={url} alt="This is an avatar" />
          </button>
        ))}
      </div>

      <button
        className="bg-sunny hover:bg-orangey hover:text-white text-espressoy px-4 py-2 rounded-full font-semibold mt-4"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Avatar"}
      </button>
    </div>
  );
}
