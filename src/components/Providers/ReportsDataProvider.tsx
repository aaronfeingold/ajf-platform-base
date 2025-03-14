"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchReportRequests,
  selectReportRequestStatus,
} from "@/store/reportRequestSlice";
import { fetchReports, selectReportStatus } from "@/store/reportSlice";
import { logger } from "@/utils/logger";

interface ReportsContextValue {
  isLoading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}

const ReportsDataContext = createContext<ReportsContextValue>({
  isLoading: false,
  error: null,
  refreshData: async () => {},
});

export const ReportsDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const reportRequestStatus = useAppSelector(selectReportRequestStatus);
  const reportStatus = useAppSelector(selectReportStatus);
  const [error, setError] = useState<Error | null>(null);
  const fetchCounter = useRef(0);
  const isInitialized = useRef(false);
  const [initializationComplete, setInitializationComplete] = useState(false);
  const [transitionComplete, setTransitionComplete] = useState(false);

  // For a better UX with min/max transition times
  useEffect(() => {
    // Minimum transition time of 1 second
    const minTransitionTime = setTimeout(() => {
      logger.debug("ReportsDataProvider", "Minimum transition time reached");
    }, 1000);

    // Maximum transition time of 3 seconds
    const maxTransitionTime = setTimeout(() => {
      logger.debug(
        "ReportsDataProvider",
        "Maximum transition time reached, forcing completion"
      );
      setTransitionComplete(true);
      setInitializationComplete(true);
    }, 3000);

    return () => {
      clearTimeout(minTransitionTime);
      clearTimeout(maxTransitionTime);
    };
  }, []);

  // Function to refresh all reports data
  const refreshData = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(fetchReportRequests()).unwrap(),
        dispatch(fetchReports()).unwrap(),
      ]);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch reports data")
      );
      console.error("Failed to fetch reports data:", err);
    }
  }, [dispatch]);

  // Initial data loading
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    if (reportRequestStatus === "succeeded" && reportStatus === "succeeded") {
      logger.debug(
        "ReportsDataProvider",
        "Reports data already loaded, skipping fetch"
      );
      setInitializationComplete(true);
      return;
    }

    if (fetchCounter.current > 0) {
      logger.debug(
        "ReportsDataProvider",
        "Skipping data fetch - already fetched"
      );
      return;
    }

    fetchCounter.current++;
    logger.debug("ReportsDataProvider", "Starting data load process", {
      reportRequestStatus,
      reportStatus,
    });

    const loadData = async () => {
      logger.debug("ReportsDataProvider", "Initializing data");
      try {
        await refreshData();
        // Mark initialization as complete
        setInitializationComplete(true);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch reports data")
        );
        console.error("Failed to fetch reports data:", err);
        // Still mark initialization as complete even with an error
        setInitializationComplete(true);
      }
    };

    loadData();

    // Don't reset fetchCounter on unmount to prevent refetching
  }, [dispatch, reportRequestStatus, reportStatus, refreshData]);

  // Monitor status changes to ensure we transition out of loading
  useEffect(() => {
    if (reportRequestStatus === "succeeded" && reportStatus === "succeeded") {
      setInitializationComplete(true);
    }
  }, [reportRequestStatus, reportStatus]);

  // Keep track of how long we've been loading
  useEffect(() => {
    if (!transitionComplete) {
      const timeoutId = setTimeout(() => {
        setTransitionComplete(true);
      }, 1500); // Minimum 1.5s transition time

      return () => clearTimeout(timeoutId);
    }
  }, [transitionComplete]);

  // Calculate isLoading based on all data sources
  const isLoading =
    !transitionComplete ||
    reportRequestStatus === "loading" ||
    reportStatus === "loading";

  const contextValue: ReportsContextValue = {
    isLoading,
    error,
    refreshData,
  };

  logger.debug("ReportsDataProvider", "Render state", {
    isLoading,
    reportRequestStatus,
    reportStatus,
    initComplete: initializationComplete,
    transitionComplete,
  });

  return (
    <ReportsDataContext.Provider value={contextValue}>
      {children}
    </ReportsDataContext.Provider>
  );
};

export const useReportsData = () => {
  const context = useContext(ReportsDataContext);
  if (context === undefined) {
    throw new Error("useReportsData must be used within a ReportsDataProvider");
  }
  return context;
};
