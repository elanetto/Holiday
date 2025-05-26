import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ENDPOINTS } from "../../../../utilities/constants";
import {
  PLACEHOLDER_AVATAR,
  PLACEHOLDER_BANNER,
} from "../../../../utilities/placeholders";
import VenueCard from "../../../../components/VenueCard";
import { useUser } from "../../../../contexts/useUser";

const ProfileTab = () => {
  const params = useParams();
  const { name: loggedInName } = useUser();

  const username = useMemo(() => {
    return params.username || loggedInName;
  }, [params.username, loggedInName]);

  const [profile, setProfile] = useState(null);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileAndVenues = async () => {
      const token = localStorage.getItem("token");
      const apiKey = localStorage.getItem("apiKey");

      if (!token || !apiKey || !username) {
        setError("Missing authentication credentials.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [profileRes, userVenuesRes] = await Promise.all([
          axios.get(`${ENDPOINTS.profiles}/${username}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey,
            },
          }),
          axios.get(`${ENDPOINTS.profiles}/${username}/venues`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey,
            },
          }),
        ]);

        setProfile(profileRes.data.data);
        setVenues(userVenuesRes.data.data || []);
      } catch (error) {
        console.error(error);
        setError("Could not load profile or venues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndVenues();
  }, [username]);

  if (loading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  const { name, bio, avatar = {}, banner = {} } = profile || {};

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

      {/* Venues List */}
      {venues.length > 0 ? (
        <>
          {profile?.venueManager && (
            <div className="text-center mb-8 mt-12">
              <h2 className="text-2xl font-bold text-espressoy">
                Venues by {profile.name}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Explore venues created by this host
              </p>
            </div>
          )}

          <div className="p-4 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-600 mt-8">
          This venue manager has not created any venues yet.
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
