import { useState, useEffect, useCallback } from "react";

const cache = new Map<string, unknown>();
const listeners = new Map<string, Set<(data: unknown) => void>>();

const subscribe = (url: string, callback: (data: unknown) => void) => {
  if (!listeners.has(url)) {
    listeners.set(url, new Set());
  }

  listeners.get(url)!.add(callback);

  return () => {
    const subscribers = listeners.get(url);
    subscribers?.delete(callback);

    if (subscribers?.size === 0) {
      listeners.delete(url);
    }
  };
};

const notify = (url: string, data: unknown) => {
  listeners.get(url)?.forEach((callback) => callback(data));
};

export const useQuery = <T>(url: string | null) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      if (!url) return;

      setIsLoading(true);
      setError(undefined);

      try {
        const response = await fetch(url, { signal });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result: T = await response.json();

        if (signal?.aborted) return;

        cache.set(url, result);
        setData(result);
        notify(url, result);
      } catch (err) {
        if (signal?.aborted) return;

        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [url]
  );

  const invalidate = useCallback(async () => {
    if (!url) return;

    cache.delete(url);
    await fetchData();
  }, [url, fetchData]);

  useEffect(() => {
    if (!url) {
      setData(undefined);
      setError(undefined);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    if (cache.has(url)) {
      setData(cache.get(url) as T);
      setIsLoading(false);
    } else {
      setData(undefined);
      fetchData(controller.signal);
    }

    setError(undefined);

    const unsubscribe = subscribe(url, (newData) => {
      setData(newData as T);
    });

    return () => {
      controller.abort();
      unsubscribe();
    };
  }, [url, fetchData]);

  return {
    data,
    error,
    isLoading,
    refetch: () => fetchData(),
    invalidate,
  };
};
