// src/services/ordersService.js (O orderService.js)
import { fetchWithAuth } from "../api/apiClient";

// 1. Obtener todas las órdenes
export async function getOrders() {
  // Al pasar solo "/orders", se unirá correctamente como "http://localhost:8080/api/orders"
  return await fetchWithAuth("/orders", { method: "GET" });
}

// 2. Crear una nueva orden
export async function createOrder(orderData) {
  return await fetchWithAuth("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

// 3. Eliminar una orden por su número
export async function deleteOrder(orderNumber) {
  return await fetchWithAuth(`/orders/${orderNumber}`, {
    method: "DELETE",
  });
}