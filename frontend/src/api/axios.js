import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

console.log(apiUrl)

const API = axios.create({
  baseURL: `${apiUrl}/api`
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  console.log("INTERCEPTOR TOKEN:", token);

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;