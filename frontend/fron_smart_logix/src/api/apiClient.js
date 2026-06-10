// src/api/apiClient.js
const API_URL = "http://localhost:8080/api";

export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.statusText}`);
  }

  // Si el backend devuelve 204 No Content (como en el deleteOrder), no hay JSON que parsear
  if (response.status === 204) return null;

  return await response.json();
}