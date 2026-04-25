import { useState, useEffect, useCallback } from "react";

const cache = new Map<string, any>();
const listeners = new Map<string, Set<(data: any) => void>>();

const subscribe = (url: string, callback: (data: any) => void) => {
  if (!listeners.has(url)) {
    listeners.set(url, new Set());
  }
  listeners.get(url)!.add(callback);
  return () => {
    listeners.get(url)!.delete(callback);
  };
};

const notify = (url: string, data: any) => {
  if (listeners.has(url)) {
    listeners.get(url)!.forEach((callback) => callback(data));
  }
};

export const useQuery = <T>(url: string | null) => {
  const [data, setData] = useState<T | undefined>(
    url ? cache.get(url) : undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      cache.set(url, result);
      setData(result);
      notify(url, result);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!url) return;

    // Synchronize with cache if it exists
    if (cache.has(url)) {
      setData(cache.get(url));
    } else {
      fetchData();
    }

    // Subscribe to changes for this URL
    const unsubscribe = subscribe(url, (newData) => {
      setData(newData);
    });

    return unsubscribe;
  }, [url, fetchData]);

  return {
    data,
    error,
    isLoading,
    refetch: fetchData,
  };
};
