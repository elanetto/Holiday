import { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../utilities/constants";

export const useFetchVenues = (tag) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchVenues = async () => {
      try {
        const res = await axios.get(
          `${ENDPOINTS.venues}/search?q=${encodeURIComponent(tag)}`,
          { signal: controller.signal }
        );

        const results = res.data.data || [];

        setVenues(results);
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
  }, [tag]);

  return { venues, loading, error };
};
