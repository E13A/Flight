import axios from "axios";

// Create an axios instance with default config
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const apiBaseURL = baseURL.endsWith("/api") ? baseURL : `${baseURL}/api`;

export const api = axios.create({
    baseURL: apiBaseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to attach the auth token if available
api.interceptors.request.use(
    (config) => {
        // TODO: Integrate with your auth store (e.g., Zustand or localStorage)
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized or other common errors
        if (error.response?.status === 401) {
            // Redirect to login or clear auth
            if (typeof window !== "undefined") {
                // window.location.href = "/login"; // Uncomment when login route exists
            }
        }
        return Promise.reject(error);
    }
);
