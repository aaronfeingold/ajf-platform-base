export const storage = {
  getAccessToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("userAccessToken");
  },

  getRefreshToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("userRefreshToken");
  },

  setTokens: (access: string, refresh: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("userAccessToken", access);
    localStorage.setItem("userRefreshToken", refresh);
    document.cookie = `userToken=${access}; path=/; max-age=86400`;
  },

  clearTokens: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("userAccessToken");
    localStorage.removeItem("userRefreshToken");
    document.cookie = "userToken=; path=/; max-age=0";
  },
};
