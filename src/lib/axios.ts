import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import humps from "humps";
import { storage } from "@/store/storage/localStorage";

/*
 * TOKEN MANAGEMENT
 */

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

/*
 * BASE AXIOS WITH INTERCEPTORS FOR TOKEN MGMT AND HUMP CONVERSIONS
 */

interface ApiError {
  detail: string;
  // other error fields the API might return
}

function isApiError(error: unknown): error is AxiosError<ApiError> {
  return axios.isAxiosError(error);
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const access = storage.getAccessToken();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  // Only transform data if it's a plain object
  if (config.data) {
    config.data = humps.decamelizeKeys(config.data);
  }
  return config;
});

// Automatically convert response data to camelCase, and retry request if token expiration was the error
api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = humps.camelizeKeys(response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle token refresh logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = storage.getRefreshToken();
        if (!refresh) throw new Error("No refresh token available");

        const response = await api.post("/token/refresh/", { refresh });
        const { access } = response.data;

        storage.setTokens(access, refresh);

        isRefreshing = false;
        refreshSubscribers.forEach((callback) => callback(access));
        refreshSubscribers = [];

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        storage.clearTokens();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


// Helper function to handle API responses
export async function handleApiResponse<T>(
  apiCall: Promise<AxiosResponse<T>>
): Promise<T> {
  try {
    const { data } = await apiCall;
    return data;
  } catch (error) {
    if (isApiError(error)) {
      throw new Error(error.message || "API request failed");
    }
    throw error;
  }
}

export default api;
