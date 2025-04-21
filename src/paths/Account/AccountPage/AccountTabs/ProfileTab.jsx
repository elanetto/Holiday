import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ENDPOINTS } from "../../../../utilities/constants";
import {
  PLACEHOLDER_AVATAR,
  PLACEHOLDER_BANNER,
} from "../../../../utilities/placeholders";

const ProfileTab = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const apiKey = localStorage.getItem("apiKey");

      if (!token || !apiKey || !username) {
        setError("Missing authentication credentials.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await axios.get(`https://v2.api.noroff.dev/holidaze/profiles/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
          withCredentials: false,
        });

        setProfile(res.data.data);
      } catch {
        setError("Could not load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  const {
    name,
    bio,
    avatar = {},
    banner = {},
  } = profile || {};

  return (
    <div className="p-0 w-full text-center">
      {/* Banner section */}
      <div className="relative h-60 w-full">
        <img
          src={banner.url || PLACEHOLDER_BANNER}
          alt={banner.alt || "User banner"}
          className="w-full h-full object-cover rounded-b-3xl border-b-4 border-espressoy"
        />

        {/* Avatar */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white p-1 rounded-full border-2 border-espressoy">
          <img
            src={avatar.url || PLACEHOLDER_AVATAR}
            alt={avatar.alt || "User avatar"}
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
      </div>

      <div className="mt-16 p-4">
        <h1 className="text-2xl font-bold text-espressoy">{name}</h1>
        <h2 className="mt-4 text-lg font-semibold text-espressoy">About</h2>
        <p className="mt-2 text-gray-700">
          {bio?.trim() ? bio : "This user hasn’t added a bio yet. 🌱"}
        </p>
      </div>
    </div>
  );
};

export default ProfileTab;