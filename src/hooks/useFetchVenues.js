import { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../utilities/constants";

const useFetchVenues = (username) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const fetchVenues = async () => {
      const token = localStorage.getItem("token");
      const apiKey = localStorage.getItem("apiKey");

      if (!token || !apiKey) {
        setError("Missing authentication credentials.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${ENDPOINTS.profiles}/${username}/venues`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey,
            },
            signal: controller.signal,
          }
        );
        setVenues(res.data.data || []);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          console.error(err);
          setError("Could not load venues. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();

    return () => {
      controller.abort();
    };
  }, [username]);

  return { venues, loading, error };
};

export default useFetchVenues;
