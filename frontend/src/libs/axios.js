import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "https://leet-space-backend.onrender.com/api/v1" ;
export const axiosInstance = axios.create({
    baseURL,
    withCredentials:true,
});
