import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 5000, // 5 seconds timeout
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error("Network Error: Please check your internet connection");
      return Promise.reject(error);
    }

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      const token = localStorage.getItem("access_token");

      // Check if this is truly a token expiration or first-time authentication issue
      if (token) {
        try {
          originalRequest._retry = true;
          const response = await axios.post(
            "http://localhost:8000/api/auth/refresh",
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              timeout: 5000,
            }
          );

          const newToken = response.data.access_token;
          localStorage.setItem("access_token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        } catch (refreshError) {
          // Only redirect to login if refresh token is invalid
          if (refreshError.response?.status === 401) {
            localStorage.removeItem("access_token");
            window.location.href = "/";
          }
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
