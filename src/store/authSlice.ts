import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { storage } from "@/store/storage/localStorage";
import { login } from "@/api/auth";
import type { AuthState } from "@/store/types";

// DEPRECATE THIS there is a betterway
export const hydrateAuthFromStorage = createAsyncThunk(
  "auth/hydrateFromStorage",
  async (_, { rejectWithValue }) => {
    try {
      // Only run in browser
      if (typeof window === "undefined") {
        return rejectWithValue("Not in browser environment");
      }

      const access = localStorage.getItem("userAccessToken");
      const refresh = localStorage.getItem("userRefreshToken");

      if (!access || !refresh) {
        return rejectWithValue("No tokens found");
      }

      return { access, refresh };
    } catch (error) {
      console.error("Error hydrating auth:", error);
      return rejectWithValue(
        error instanceof Error
          ? error
          : { message: "Failed to hydrate auth state" }
      );
    }
  }
);
// Similarly enhanced login thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await login(credentials.username, credentials.password);

      storage.setTokens(response.access, response.refresh);

      return {
        username: credentials.username,
        access: response.access,
        refresh: response.refresh,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error : "Login failed");
    }
  }
);

// Logout action remains the same
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  storage.clearTokens();
  return null;
});

// Initial state
const initialState: AuthState = {
  user: {
    access: null,
    refresh: null,
  },
  status: "idle",
  error: null,
  isAuthenticated: false,
};

// Create slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ access: string; refresh: string }>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = { access: null, refresh: null };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login reducers
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as Error;
      })
      // Logout reducers
      .addCase(logoutUser.fulfilled, (state) => {
        state.user.access = null;
        state.user.refresh = null;
        state.status = "idle";
      })
      .addCase(hydrateAuthFromStorage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(hydrateAuthFromStorage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = {
          ...state.user,
          access: action.payload.access,
          refresh: action.payload.refresh,
        };
        state.error = null;
      })
      .addCase(hydrateAuthFromStorage.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.user = {
          access: null,
          refresh: null,
        };
        state.error = action.payload as Error;
      });
  },
});

export const selectIsAuthenticated = (state: RootState) =>
  !!state.auth.user.access;

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
