// client/src/apis/user/user.js
import axios from "../../axios";

// Hàm lấy token từ localStorage
const getAccessToken = () => {
    const authData = localStorage.getItem("authData");
    if (authData) {
        const parsedData = JSON.parse(authData);
        return parsedData.accessToken || null;
    }
    return null;
};

const refreshAccessToken = async () => {
    try {
        const response = await axios.post("/api/user/refreshtoken", {}, { withCredentials: true });
        const newAccessToken = response.data.accessToken;
        const authData = JSON.parse(localStorage.getItem("authData")) || {};
        authData.accessToken = newAccessToken;
        localStorage.setItem("authData", JSON.stringify(authData));
        return newAccessToken;
    } catch (error) {
        throw new Error("Failed to refresh token");
    }
};

const apiRequest = axios.create({
    baseURL: "http://localhost:9999",
    headers: {
        "Content-Type": "application/json",
    },
});

apiRequest.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        console.log("Token being sent:", token); // Debug token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiRequest.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiRequest(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const apiCreateUser = async (data) => {
    return await apiRequest.post(`/api/user/register`, data);
};

export const apiGetAllUsers = async () => {
    return await apiRequest.get(`/api/user`);
};

export const apiGetUserById = async (id) => {
    return await apiRequest.get(`/api/user/${id}`);
};

export const apiUpdateUser = async (id, data) => {
    return await apiRequest.put(`/api/user/${id}`, data);
};

export const apiDeleteUser = async (id) => {
    return await apiRequest.delete(`/api/user/${id}`);
};

export const apiAssignEventToStaff = async (staffId, eventId) => {
    return await axios.post(
        `/user/assign-event`,
        { staffId, eventId }
    );
};

export const apiRemoveAssignedEvent = async (staffId, eventId) => {
    return await apiRequest.post('/api/user/remove-assigned-event', { staffId, eventId });
};