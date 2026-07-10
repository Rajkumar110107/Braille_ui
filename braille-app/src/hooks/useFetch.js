import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to poll data from the backend.
 * @param {string} url - The endpoint to fetch from.
 * @param {number} interval - Polling interval in ms.
 * @returns {object} - { data, loading, error, manualSetData }
 */
export const useFetch = (url, interval = 500) => {
  const [data, setData] = useState({
    sentence: "",
    ai_response: "",
    pattern: "000000",
    last_letter: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Backend not reachable');
      const result = await response.json();
      
      // Only update if data has changed to prevent over-rendering
      setData(prev => {
        if (JSON.stringify(prev) === JSON.stringify(result)) return prev;
        return result;
      });
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    timerRef.current = setInterval(fetchData, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [url, interval]);

  const manualSetData = (newData) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  return { data, loading, error, manualSetData };
};
