import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthState, PropertyState } from "@/store/types";
import { getAllPropertyRecordCards } from "@/api/property";

export const fetchPropertyData = createAsyncThunk(
  "property/fetchData",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as {
      property: PropertyState;
      auth: AuthState;
    };

    // If we already have data, don't fetch again, since data rarely changes
    if (state.property.dataFetched) {
      return state.property.data;
    }

    try {
      return getAllPropertyRecordCards();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error : "Failed to fetch property data"
      );
    }
  },
  {
    // This condition prevents the thunk from running if we're not authenticated
    condition: (_, { getState }) => {
      const state = getState() as { auth: AuthState };
      return !!state.auth.user.access;
    },
  }
);

const initialState: PropertyState = {
  data: {
    count: 0,
    data: [],
  },
  status: "idle",
  error: null,
  dataFetched: false,
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.status = "loading";
    },
    setPropertyData: (state, action) => {
      state.data = action.payload;
      state.status = "succeeded";
    },
    resetPropertyState: (state) => {
      state.data = initialState.data;
      state.status = "idle";
      state.error = null;
      state.dataFetched = false;
    },
    // Add a reducer to manually invalidate the cache if needed
    invalidateData: (state) => {
      state.dataFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPropertyData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.dataFetched = true;
        state.error = null;
      })
      .addCase(fetchPropertyData.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as Error) || "Failed to fetch data";
      });
  },
});

export const {
  setLoading,
  setPropertyData,
  resetPropertyState,
  invalidateData,
} = propertySlice.actions;
export default propertySlice.reducer;

// Selectors
export const selectAllProperties = (state: { property: PropertyState }) =>
  state.property.data;
export const selectPropertyStatus = (state: { property: PropertyState }) =>
  state.property.status;
export const selectPropertyError = (state: { property: PropertyState }) =>
  state.property.error;
