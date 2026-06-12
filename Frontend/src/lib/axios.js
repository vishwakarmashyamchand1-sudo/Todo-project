import axios from "axios";

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const API_URL = isLocalhost ? "http://localhost:5001" : import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use(request => {
  console.log("Frontend API Request URL:", request.baseURL + request.url);
  return request;
});

export default api;