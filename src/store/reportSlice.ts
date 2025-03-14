"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ReportState } from "@/types/store";
import type {
  Report,
  GetAllReportRecordCards,
  GetReportRecordsListResponse,
} from "@/types";

const initialState: ReportState = {
  data: {
    count: 0,
    data: [],
  },
  status: "idle",
  error: null,
};

const getAllReportRecordCards = async (
  pageSize = 500
): Promise<GetAllReportRecordCards> => {
  const data: Report[] = [];
  let page = 1;
  let count = 0;

  while (true) {
    const response = await fetch(
      `/api/reports?pageSize=${pageSize}&page=${page}`,
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
    const chunk: GetReportRecordsListResponse = await response.json();
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

export const fetchReports = createAsyncThunk(
  "report/fetchReport",
  async (): Promise<GetAllReportRecordCards> => {
    return await getAllReportRecordCards();
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error as Error;
      });
  },
});

export default reportSlice.reducer;

export const selectReportStatus = (state: { report: ReportState }) =>
  state.report.status;
export const selectReportError = (state: { report: ReportState }) =>
  state.report.error;
export const selectAllReports = (state: { report: ReportState }) =>
  state.report.data;
