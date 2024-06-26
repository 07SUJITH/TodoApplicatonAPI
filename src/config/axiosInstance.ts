import axios from "axios";

const BASE_URL = "https://jelan.pythonanywhere.com";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

export default axiosInstance;

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});