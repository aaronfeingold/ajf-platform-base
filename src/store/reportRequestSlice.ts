"use client";

import {
  Dispatch,
  createSlice,
  createAsyncThunk,
  AnyAction,
} from "@reduxjs/toolkit";
import type { AppDispatch } from "@/store/store";
import type { ReportRequest } from "@/types/reportRequest";
import type { ReportRequestState } from "@/types/store";
import {
  GetAllReportRequestRecordCards,
  GetReportRequestListResponse,
} from "@/types/api";

// Constants for polling configuration
const POLLING_INTERVAL = process.env.NODE_ENV === "development" ? 5000 : 30000; // 5s in dev, 30s in prod
const MAX_POLLING_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
const STALE_REPORT_THRESHOLD = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

type StateShape = {
  reports: ReportRequestState;
};

type MiddlewareStore = {
  getState: () => StateShape;
  dispatch: Dispatch;
};

const initialState: ReportRequestState = {
  data: {
    data: [],
    count: 0,
  },
  status: "idle",
  error: null,
  polling: {
    activePollingId: null,
    pollingStartTime: null,
    pollingIntervalId: null,
  },
};

export const getAllReportRequestRecordCards = async (
  pageSize = 500
): Promise<GetAllReportRequestRecordCards> => {
  const data: ReportRequest[] = [];
  let page = 1;
  let count = 0;

  while (true) {
    const response = await fetch(
      `/api/reportRequests?pageSize=${pageSize}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate analysis");
    }
    const chunk: GetReportRequestListResponse = await response.json();
    if (!count) count = chunk.count;
    data.push(...chunk.results);

    if (!chunk.next) break;
    page++;
  }

  return {
    count,
    data,
    lastFetched: Date.now(),
  };
};

export const fetchReportRequests = createAsyncThunk(
  "reportRequests/fetchReportRequests",
  async (): Promise<GetAllReportRequestRecordCards> => {
    return await getAllReportRequestRecordCards();
  }
);

// Thunk for fetching a single report by ID
// TODO MAKE THE API FN
// This should be run when user views a report request...
export const fetchReportRequestById = createAsyncThunk(
  "reports/fetchReportById",
  async (reportId: number) => {
    try {
      const response = await fetch(`/api/reportRequests/${reportId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // To include cookies in the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch report request");
      }

      return (await response.json()) as ReportRequest;
    } catch (error) {
      console.error("Error fetching report request:", error);
      throw error;
    }
  }
);

// Thunk for submitting a new report
// TODO MAKE THE API FN
// Thunk for submitting a new report request
export const submitNewReportRequest = createAsyncThunk(
  "reportRequest/submitNewReportRequest",
  async (
    reportRequest: Omit<ReportRequest, "id" | "status" | "created" | "updated">
  ) => {
    try {
      const response = await fetch("/api/reportRequests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportRequest),
        credentials: "include", // To include cookies in the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit report request");
      }

      return (await response.json()) as ReportRequest;
    } catch (error) {
      console.error("Error submitting report request:", error);
      throw error;
    }
  }
);

// Thunk for updating an existing report request
export const modifyReportRequest = createAsyncThunk(
  "reportRequest/modifyReportRequest",
  async (reportRequest: Partial<ReportRequest>) => {
    try {
      const response = await fetch(`/api/reportRequests`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportRequest),
        credentials: "include", // To include cookies in the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update report request");
      }

      return (await response.json()) as ReportRequest;
    } catch (error) {
      console.error("Error updating report request:", error);
      throw error;
    }
  }
);

// Thunk for starting report polling
export const startReportPolling = createAsyncThunk(
  "reports/startPolling",
  async (reportId: number, { dispatch }) => {
    const report = await dispatch(fetchReportRequestById(reportId)).unwrap();

    // Check if report is too old
    const reportDate = new Date(report.created).getTime();
    const now = Date.now();
    if (now - reportDate > STALE_REPORT_THRESHOLD) {
      throw new Error("Report is too old to poll");
    }

    return report;
  }
);

const reportRequestSlice = createSlice({
  name: "reportRequest",
  initialState,
  reducers: {
    stopPolling: (state) => {
      if (state.polling.pollingIntervalId) {
        window.clearInterval(state.polling.pollingIntervalId);
      }
      state.polling = {
        activePollingId: null,
        pollingStartTime: null,
        pollingIntervalId: null,
      };
    },
    updateReportRequest: (state, action) => {
      const index = state.data.data.findIndex(
        (report) => report.id === action.payload.id
      );
      if (index !== -1) {
        state.data.data[index] = action.payload;
      }
    },
    setPollingInterval: (state, action) => {
      state.polling.pollingIntervalId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReportRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchReportRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error as Error;
      })
      .addCase(fetchReportRequestById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReportRequestById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.data.findIndex(
          (report) => report.id === action.payload.id
        );
        if (index !== -1) {
          state.data.data[index] = action.payload;
        } else {
          state.data.data.push(action.payload);
        }
      })
      .addCase(fetchReportRequestById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error as Error;
      })
      .addCase(submitNewReportRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitNewReportRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.data.unshift(action.payload);
        state.data.count += 1; // Increment count since we added a new report
      })
      .addCase(submitNewReportRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error as Error;
      })
      .addCase(modifyReportRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(modifyReportRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.data.findIndex(
          (report) => report.id === action.payload.id
        );
        if (index !== -1) {
          state.data.data[index] = action.payload;
        }
      })
      .addCase(modifyReportRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error as Error;
      })
      .addCase(startReportPolling.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.polling.activePollingId = action.payload.id;
        state.polling.pollingStartTime = Date.now();

        // Also update the report in the data array if needed
        const index = state.data.data.findIndex(
          (report) => report.id === action.payload.id
        );
        if (index !== -1) {
          state.data.data[index] = action.payload;
        }
      })
      .addCase(startReportPolling.rejected, (state) => {
        state.polling = {
          activePollingId: null,
          pollingStartTime: null,
          pollingIntervalId: null,
        };
      });
  },
});

export const { stopPolling, updateReportRequest, setPollingInterval } =
  reportRequestSlice.actions;

// Polling middleware
// TODO: IMPLEMENT NOTIFICATION SYSTEM
export const createReportRequestPollingMiddleware =
  (store: MiddlewareStore) => (next: Dispatch) => (action: AnyAction) => {
    const result = next(action);

    if (startReportPolling.fulfilled.match(action)) {
      const state = store.getState().reports;

      // Clear any existing interval
      if (state.polling.pollingIntervalId) {
        window.clearInterval(state.polling.pollingIntervalId);
      }

      // Start new polling interval
      const intervalId = window.setInterval(async () => {
        const currentState = store.getState().reports;
        const { activePollingId, pollingStartTime } = currentState.polling;

        // Check if we should stop polling
        if (!activePollingId || !pollingStartTime) {
          store.dispatch(stopPolling());
          return;
        }

        // Check if we've exceeded max polling duration
        if (Date.now() - pollingStartTime > MAX_POLLING_DURATION) {
          store.dispatch(stopPolling());
          return;
        }

        try {
          const updatedReport = await (store.dispatch as AppDispatch)(
            fetchReportRequestById(activePollingId)
          ).unwrap();

          // Update the report in the store
          if (updatedReport && updatedReport.id) {
            store.dispatch(updateReportRequest(updatedReport));
          }

          if (updatedReport.status !== "pending") {
            store.dispatch(stopPolling());

            if (process.env.NODE_ENV === "development") {
              // Notification dispatch would go here
              console.log("Report completed:", updatedReport.id);
            }
          }
        } catch (error) {
          console.error("Error polling report:", error);
          store.dispatch(stopPolling());
        }
      }, POLLING_INTERVAL);

      store.dispatch(setPollingInterval(intervalId));
    }

    return result;
  };

export default reportRequestSlice.reducer;

export const selectReportRequestStatus = (state: {
  reportRequest: ReportRequestState;
}) => state.reportRequest.status;
export const selectReportRequestError = (state: {
  reportRequest: ReportRequestState;
}) => state.reportRequest.error;
export const selectAllReportRequests = (state: {
  reportRequest: ReportRequestState;
}) => state.reportRequest.data;
