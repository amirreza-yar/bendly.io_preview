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

export const setupAxiosInterceptor = () => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Ignore requests that already retried
      if (!originalRequest || originalRequest._retry)
        return Promise.reject(error);

      if (
        error.response?.status === 401 &&
        !originalRequest.url.includes("/auth/token/refresh/")
      ) {
        if (isRefreshing) {
          // Queue the request until refresh finished
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest });
          });
        }

        isRefreshing = true;
        originalRequest._retry = true;

        try {
          // Call refresh endpoint (browser automatically sends cookies)
          await api.post("/auth/token/refresh/");

          isRefreshing = false;
          processQueue(null);

          // Retry original request
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError);

          // Logout & redirect
          try {
            await api.post("/auth/logout/");
          } catch {
            // ignore logout errors
          }

          if (typeof window !== "undefined") {
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
