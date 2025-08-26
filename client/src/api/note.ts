import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const NOTE_API = `${BASE_URL}/api/notes`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const fetchNotes = () =>
  axios.get(NOTE_API, { headers: getAuthHeader() }).then((res) => res.data);

export const createNote = (data: { content: string, title: string }) =>
  axios.post(NOTE_API, data, { headers: getAuthHeader() }).then((res) => res.data);

export const updateNote = (id: string, data: { content: string }) =>
  axios.put(`${NOTE_API}/${id}`, data, { headers: getAuthHeader() }).then((res) => res.data);

export const deleteNote = (id: string) =>
  axios.delete(`${NOTE_API}/${id}`, { headers: getAuthHeader() }).then((res) => res.data);
