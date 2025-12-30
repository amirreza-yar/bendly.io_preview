import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const fetcher = (url: string) => api.get(url).then((res) => res.data);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (err: any) => void;
  config: any;
}> = [];

const processQueue = (error: any) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      resolve(api(config));
    }
  });
  failedQueue = [];
};

const clearAuthCookies = () => {
  document.cookie = "auth-jwt=; Max-Age=0; path=/";
  document.cookie = "auth-refresh-jwt=; Max-Age=0; path=/";
};

export const setupAxiosInterceptor = () => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (!originalRequest || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (
        (error.response?.status === 401 || error.response?.status === 401) &&
        !originalRequest.url.includes("/auth/token/refresh/")
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest });
          });
        }

        isRefreshing = true;
        originalRequest._retry = true;

        try {
          await api.post("/auth/token/refresh/");

          isRefreshing = false;
          processQueue(null);

          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError);

          try {
            await api.post("/auth/logout/");
          } catch {
            // logout failed, fine, we go nuclear
            if (typeof window !== "undefined") {
              clearAuthCookies();
            }
          }

          if (typeof window !== "undefined") {
            clearAuthCookies();
            window.location.href = "/auth";
          }

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default api;
