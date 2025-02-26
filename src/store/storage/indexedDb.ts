"use client";

import { indexedDbStorage } from "@/store/storage/chunkedStorage";

const LAST_FETCHED_KEY = "propertyData_lastFetched";
const CACHE_DURATION = 31536000000; // 1 year in milliseconds

interface IndexedDBCheckResult {
  shouldFetch: boolean;
  cachedData: unknown | null;
}

export const checkIndexedDBForPropertyData =
  async (): Promise<IndexedDBCheckResult> => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return Promise.reject(new Error("IndexedDB is not available in SSR"));
    }
    try {
      // Check last fetched timestamp
      const lastFetchedStr = await indexedDbStorage.getItem(LAST_FETCHED_KEY);
      const lastFetched = lastFetchedStr ? parseInt(lastFetchedStr, 10) : 0;
      const age = Date.now() - lastFetched;

      // If data is too old, we should fetch again
      if (age >= CACHE_DURATION) {
        return { shouldFetch: true, cachedData: null };
      }

      // Try to get cached property data
      const cachedDataStr = await indexedDbStorage.getItem("persist:property");
      if (!cachedDataStr) {
        return { shouldFetch: true, cachedData: null };
      }

      const cachedData = JSON.parse(cachedDataStr);
      return {
        shouldFetch: false,
        cachedData: cachedData,
      };
    } catch (error) {
      console.error("Error checking IndexedDB:", error);
      return { shouldFetch: true, cachedData: null };
    }
  };

export const updateLastFetchedTimestamp = async (): Promise<void> => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return Promise.reject(new Error("IndexedDB is not available in SSR"));
    }
    try {
      await indexedDbStorage.setItem(LAST_FETCHED_KEY, Date.now().toString());
    } catch (error) {
      console.error("Error updating last fetched timestamp:", error);
    }
};
