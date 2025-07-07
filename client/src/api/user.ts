import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const USER_API = `${BASE_URL}/api/user`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const getCurrentUser = () =>
  axios.get(`${USER_API}/me`, { headers: getAuthHeader() }).then((res) => res.data);
