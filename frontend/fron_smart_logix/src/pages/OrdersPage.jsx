import { useEffect, useState } from "react";
// IMPORTANTE: Asegúrate de tener deleteOrder exportado en tu ordersService.js
import { getOrders, deleteOrder } from "../services/ordersService";
import Navbar from "../components/Navbar";
import "../App.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        // Fuerza una espera mínima usando Promise.all
        const [data] = await Promise.all([
          getOrders(),
          new Promise((resolve) => setTimeout(resolve, 1000))
        ]);
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  // NUEVA FUNCIÓN: Maneja la eliminación de la orden
  const handleDelete = async (orderNumber) => {
    if (window.confirm(`¿Estás seguro de eliminar la orden ${orderNumber}?`)) {
      try {
        await deleteOrder(orderNumber);
        // Actualiza el estado local para quitar la orden de la tabla sin recargar la página
        setOrders(orders.filter((order) => order.orderNumber !== orderNumber));
      } catch (error) {
        console.error("Error al eliminar la orden:", error);
        alert("Hubo un problema al intentar eliminar la orden.");
      }
    }
  };

  if (loading) {
    return (
      <div className="inventory-loading">
        <div className="spinner"></div>
        <h2>Cargando órdenes de compra...</h2>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      <Navbar />

      <section className="inventory-stats" style={{ marginTop: "30px" }}>
        <div className="stat-card">
          <h3>Total Órdenes</h3>
          <p>{orders.length}</p>
        </div>
        <div className="stat-card">
          <h3>Monto Total</h3>
          <p>${orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0).toFixed(2)}</p>
        </div>
      </section>

      <section className="inventory-table-section">
        <div className="table-header">
          <h2>Órdenes de Compra</h2>
        </div>

        <table className="inventory-table">
          <thead>
            <tr>
              <th>ID Órden</th>
              <th>Cliente</th>
              <th>Fecha Creación</th>
              <th>Monto Total</th>
              {/* NUEVA COLUMNA */}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id || index}>
                <td className="sku">{order.orderNumber || order.id}</td>
                <td>{order.customerName || "Cliente General"}</td>
                {/* Formateo de fecha limpia localizado en español dd/mm/aaaa */}
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("es-ES") : "Reciente"}</td>
                <td>${order.totalAmount || 0}</td>
                {/* NUEVO BOTÓN DE ELIMINAR */}
                <td>
                  <button
                    style={{ backgroundColor: "#ff4d4f", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                    onClick={() => handleDelete(order.orderNumber)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default OrdersPage;