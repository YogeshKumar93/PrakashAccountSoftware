import { useState, useEffect } from "react";

export const useApi = (apiFunc, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiFunc()
      .then((res) => mounted && setData(res))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, deps);

  return { data, loading };
};
