"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPropertyData,
  setPropertyData,
  setLoading,
} from "@/store/propertySlice";
import type { RootState } from "@/store/store";
import { monitorStorageUsage } from "@/store/store";
import type { GetAllPropertyRecordCards } from "@/api/types";
import {
  checkIndexedDBForPropertyData,
  updateLastFetchedTimestamp,
} from "@/store/storage/indexedDb";
import { logger } from "@/utils/logger";

interface PropertyContextValue {
  isLoading: boolean;
  error: Error | null;
  data: GetAllPropertyRecordCards | null;
}

const PropertyDataContext = createContext<PropertyContextValue>({
  isLoading: false,
  error: null,
  data: null,
});

export const PropertyDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { status, data } = useAppSelector((state: RootState) => state.property);
  const [error, setError] = useState<Error | null>(null);
  // use ref to ensure we only fetch data once from external api
  // and/or indexedDB
  const dataFetchedRef = useRef(false);
  // Monitor storage usage...
  monitorStorageUsage();

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent execution on SSR
    const loadData = async () => {
      // Prevent multiple fetches
      if (dataFetchedRef.current) {
        logger.debug(
          "PropertyDataProvider",
          "Skipping data fetch - already fetched"
        );
        return;
      }
      if (status === "loading" || (data && data.data.length > 0)) return;
      logger.debug("PropertyDataProvider", "Starting data load process", {
        status,
      });
      logger.info("PropertyDataProvider", "Hydrating from IndexedDB");
      dispatch(setLoading()); // set status to loading
      dataFetchedRef.current = true;

      try {
        // Check IndexedDB first
        const { shouldFetch, cachedData } =
          await checkIndexedDBForPropertyData();
        logger.debug("PropertyDataProvider", "IndexedDB check result", {
          shouldFetch,
          hasCachedData: !!cachedData,
        });
        // if we are not already loading, and somehow are running this fn again
        // due to a change somewhere in the redux store...
        if (!shouldFetch && cachedData) {
          logger.info("PropertyDataProvider", "Loading from cache");
          // then we load from cachedData into redux state
          // If we have valid cached data, use it
          dispatch(setPropertyData(cachedData));
          return;
        }

        // If we need to fetch, do it only if redux state is empty
        if (status === "idle" && (!data || data.data.length === 0)) {
          logger.info("PropertyDataProvider", "Fetching fresh data");
          await dispatch(fetchPropertyData()).unwrap();
          await updateLastFetchedTimestamp();
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch property data")
        );
        console.error("Failed to fetch property data:", err);
      }
    };

    loadData();

    // Cleanup function
    return () => {
      dataFetchedRef.current = false;
    };
  }, [dispatch, status, data]);

  const contextValue: PropertyContextValue = {
    isLoading: status === "loading",
    error,
    data,
  };

  return (
    <PropertyDataContext.Provider value={contextValue}>
      {children}
    </PropertyDataContext.Provider>
  );
};

export const usePropertyData = () => {
  const context = useContext(PropertyDataContext);
  if (context === undefined) {
    throw new Error(
      "usePropertyData must be used within a PropertyDataProvider"
    );
  }
  return context;
};
