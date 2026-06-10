// src/service/orderService.js
import { fetchWithAuth } from "../api/apiClient";

export async function getOrders() {
  return await fetchWithAuth("/orders", { method: "GET" });
}

export async function createOrder(orderData) {
  return await fetchWithAuth("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

// ¡El método que agregamos en el backend de Java!
export async function deleteOrder(orderNumber) {
  return await fetchWithAuth(`/orders/${orderNumber}`, {
    method: "DELETE",
  });
}