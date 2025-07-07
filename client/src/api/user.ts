import axios from "axios";

const USER_API = "http://localhost:5000/api/user";

const getAuthHeader = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const getCurrentUser = () =>
  axios.get(`${USER_API}/me`, { headers: getAuthHeader() }).then((res) => res.data);
