const cache = new Map();

export const fetchWithCache = async (key, fetcher, ttl = 60000) => {
  if (cache.has(key)) {
    const { data, expiry } = cache.get(key);
    if (Date.now() < expiry) {
      return data;
    }
    cache.delete(key);
  }
  const data = await fetcher();
  cache.set(key, { data, expiry: Date.now() + ttl });
  return data;
};
