import { useEffect, useState } from "react";
import { getInventory } from "../services/inventoryService";
import Navbar from "../components/Navbar"; 
import "../App.css";

function InventoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    async function loadInventory() {
      try {
        // Fuerza una espera mínima de 1 segundo usando Promise.all
        const [data] = await Promise.all([
          getInventory(),
          new Promise((resolve) => setTimeout(resolve, 1000))
        ]);
        setItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadInventory();
  }, []);

  const filteredItems = items.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.productName?.toLowerCase().includes(term) ||
      item.sku?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="inventory-loading">
        <div className="spinner"></div>
        <h2>Sincronizando con Inventory Service...</h2>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      <Navbar />

      {/* SECCIÓN DE TARJETAS DE ESTADÍSTICAS REFACTORIZADA (PREMIUM) */}
      <section className="inventory-stats" style={{ marginTop: "30px" }}>
        <div className="stat-card">
          <h3>📊 Total Productos</h3>
          <p>{items.length}</p>
          <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '4px' }}>
            Modelos registrados en catálogo
          </span>
        </div>

        <div className="stat-card">
          <h3>📦 Stock Disponible</h3>
          <p>
            {items.reduce((acc, item) => acc + (item.availableQuantity || 0), 0)}
          </p>
          <span style={{ fontSize: '12px', color: '#4ade80', display: 'block', marginTop: '4px' }}>
            ✔ Unidades físicas en estanterías
          </span>
        </div>

        <div className="stat-card">
          <h3>🏢 Bodegas Activas</h3>
          <p>{new Set(items.map((item) => item.warehouseCode)).size}</p>
          <span style={{ fontSize: '12px', color: '#38bdf8', display: 'block', marginTop: '4px' }}>
            Sincronizadas mediante Eureka
          </span>
        </div>
      </section>

      <section className="inventory-table-section">
        <div className="table-header">
          <h2>Inventario Tecnológico</h2>
          <input
            type="text"
            placeholder="Buscar por producto o SKU..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="inventory-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Producto</th>
              <th>Bodega</th>
              <th>Cantidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => (
              <tr key={item.id || index}>
                <td className="sku">{item.sku}</td>
                <td style={{ fontWeight: "500" }}>{item.productName}</td>
                <td>{item.warehouseCode}</td>
                <td style={{ fontWeight: "600" }}>{item.availableQuantity}</td>
                <td>
                  <span className={item.availableQuantity > 0 ? "status available" : "status unavailable"}>
                    {item.availableQuantity > 0 ? "● Disponible" : "X Sin Stock"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default InventoryPage;