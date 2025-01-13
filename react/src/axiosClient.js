import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 7000,
});

axiosClient.interceptors.request.use((config) => {
  const publicEndpoints = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];

  if (publicEndpoints.some((endpoint) => config.url.includes(endpoint))) {
    return config;
  }

  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      console.error("Network Error: Please check your internet connection");
      return Promise.reject(new Error("Network Error"));
    }

    if (error.response.status === 401 && !error.config._retry) {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          error.config._retry = true;
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const newToken = response.data.access_token;
          localStorage.setItem("access_token", newToken);
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(error.config);
        } catch (refreshError) {
          localStorage.removeItem("access_token");
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
