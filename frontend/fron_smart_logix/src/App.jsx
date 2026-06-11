import React, { useState, useEffect } from 'react';
import { getOrders, deleteOrder } from "./services/ordersService"; 
import { login, saveLoginSession } from "./services/authService";  
import { getShipments } from "./services/shipmentsService"; 
import './App.css';

export default function App() {
  // Estado de Autenticación Real
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingEnvios, setLoadingEnvios] = useState(false); 
  const [enviosError, setEnviosError] = useState(''); // Estado para capturar errores de envíos

  // Control de pestañas de navegación
  const [currentTab, setCurrentTab] = useState('inventario');

  // Datos del Backend Estáticos para Inventario
  const [inventarioData, setInventarioData] = useState([
    { sku: 'SKU-1001', producto: 'Teclado Mecanico RGB', bodega: 'WH-SCL-01', cantidad: 120, estado: 'Disponible' },
    { sku: 'SKU-2001', producto: 'Mouse Inalambrico', bodega: 'WH-SCL-01', cantidad: 200, estado: 'Disponible' },
    { sku: 'SKU-3001', producto: 'Monitor 24 Pulgadas', bodega: 'WH-VAP-02', cantidad: 45, estado: 'Disponible' }
  ]);

  const [ordenesData, setOrdenesData] = useState([]); 
  const [enviosData, setEnviosData] = useState([]);   
  const [rawJsonBackend, setRawJsonBackend] = useState('[]'); 

  // Función para cargar órdenes reales desde Java
  const loadRealOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await getOrders();
      setOrdenesData(data || []);
      setRawJsonBackend(JSON.stringify(data, null, 2)); 
    } catch (error) {
      console.error("Error cargando órdenes reales del backend:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Función para cargar envíos reales desde el microservicio de Java
  const loadRealShipments = async () => {
    setLoadingEnvios(true);
    setEnviosError(''); // Limpiamos errores previos
    try {
      const data = await getShipments();
      
      console.log("Datos crudos recibidos en App.jsx:", data);

      // Forzar procesamiento si viene dentro de una estructura común de Spring Boot
      let listaProcesada = [];
      if (Array.isArray(data)) {
        listaProcesada = data;
      } else if (data && Array.isArray(data.content)) {
        listaProcesada = data.content;
      } else if (data && Array.isArray(data.data)) {
        listaProcesada = data.data;
      } else if (data && typeof data === 'object') {
        // Si es un solo objeto, lo metemos en un array para que no falle el .map
        listaProcesada = [data];
      }

      setEnviosData(listaProcesada);
      
      if (listaProcesada.length === 0) {
        setEnviosError('El backend respondió con éxito, pero la lista de envíos está vacía en la Base de Datos.');
      }

    } catch (error) {
      console.error("Error cargando envíos reales del backend:", error);
      setEnviosError(`Error de conexión: ${error.message || 'No se pudo conectar al endpoint /api/shipments'}`);
      setEnviosData([]);
    } finally {
      setLoadingEnvios(false);
    }
  };

  // Controlador de efectos para pestañas
  useEffect(() => {
    if (isLoggedIn) {
      if (currentTab === 'ordenes') {
        loadRealOrders();
      } else if (currentTab === 'envios') {
        loadRealShipments(); 
      }
    }
  }, [currentTab, isLoggedIn]);

  // Manejo del Login conectándose al auth-service real
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ credential: username, password });
      saveLoginSession(response); 
      setIsLoggedIn(true);
      setLoginError('');
    } catch (error) {
      console.error(error);
      setLoginError('Credenciales incorrectas en el servicio de autenticación.');
    }
  };

  // Manejo de la eliminación real de la orden
  const handleDeleteOrder = async (orderNumber) => {
    if (window.confirm(`¿Estás seguro de eliminar la orden ${orderNumber}?`)) {
      try {
        await deleteOrder(orderNumber);
        setOrdenesData(ordenesData.filter((ord) => ord.orderNumber !== orderNumber));
      } catch (error) {
        console.error("Error al eliminar la orden:", error);
        alert("Hubo un problema al intentar eliminar la orden en Java.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // ================= VISTA 1: FORMULARIO DE LOGIN =================
  if (!isLoggedIn) {
    return (
      <div className="login-bg">
        <div className="login-card">
          <h2 style={{color: '#fff', marginBottom: '20px', textAlign: 'center'}}>SmartLogix</h2>
          <form onSubmit={handleLoginSubmit}>
            {loginError && <p className="error-msg" style={{color: '#ff4d4f'}}>{loginError}</p>}
            <input 
              type="text" 
              className="login-input" 
              placeholder="Username o Email" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
            <input 
              type="password" 
              className="login-input" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button type="submit" className="login-btn">ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  // ================= VISTA 2: DASHBOARD COMPLETO =================
  return (
    <div className="dashboard-layout">
      
      {/* HEADER & MENU SUPERIOR */}
      <header className="header-panel">
        <div className="platform-title">
          <h1>SmartLogix <span>Platform</span></h1>
          <p>Sistema Central Integrado de Operaciones</p>
        </div>

        <nav className="navbar-tabs">
          <button 
            className={`tab-btn ${currentTab === 'inventario' ? 'active' : ''}`}
            onClick={() => setCurrentTab('inventario')}
          >
            Inventario
          </button>
          <button 
            className={`tab-btn ${currentTab === 'ordenes' ? 'active' : ''}`}
            onClick={() => setCurrentTab('ordenes')}
          >
            Órdenes
          </button>
          <button 
            className={`tab-btn ${currentTab === 'envios' ? 'active' : ''}`}
            onClick={() => setCurrentTab('envios')}
          >
            Envíos
          </button>
        </nav>

        <button onClick={handleLogout} className="btn-logout">Cerrar sesión</button>
      </header>

      {/* PESTAÑA: INVENTARIO */}
      {currentTab === 'inventario' && (
        <>
          <section className="metrics-row">
            <div className="metric-box">
              <div className="metric-title">Total Productos</div>
              <div className="metric-value">{inventarioData.length}</div>
              <div className="metric-sub">Modelos registrados en catálogo</div>
            </div>
            <div className="metric-box">
              <div className="metric-title">Stock Disponible</div>
              <div className="metric-value neon">
                {inventarioData.reduce((acc, item) => acc + item.cantidad, 0)}
              </div>
              <div className="metric-sub">✓ Unidades físicas en estanterías</div>
            </div>
            <div className="metric-box">
              <div className="metric-title">Bodegas Activas</div>
              <div className="metric-value">2</div>
              <div className="metric-sub">Sincronizadas mediante Eureka</div>
            </div>
          </section>

          <div className="content-card">
            <h2>Inventario Tecnológico</h2>
            <table className="data-table">
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
                {inventarioData.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontFamily: 'monospace', color: '#00f2fe' }}>{item.sku}</td>
                    <td>{item.producto}</td>
                    <td>{item.bodega}</td>
                    <td><strong>{item.cantidad}</strong></td>
                    <td><span className="badge-disponible">• {item.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* PESTAÑA: ÓRDENES */}
      {currentTab === 'ordenes' && (
        <>
          <section className="metrics-row">
            <div className="metric-box">
              <div className="metric-title">Total Órdenes</div>
              <div className="metric-value">{ordenesData.length}</div>
            </div>
            <div className="metric-box">
              <div className="metric-title">Monto Total Real</div>
              <div className="metric-value neon">
                ${ordenesData.reduce((acc, o) => acc + (o.totalAmount || 0), 0).toLocaleString("es-CL")}
              </div>
            </div>
          </section>

          <div className="content-card">
            <h2>Órdenes de Compra en Base de Datos (Java)</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>N° Órden</th>
                  <th>Estado</th>
                  <th>Tracking (Despacho)</th>
                  <th>Productos (SKU - Cant)</th>
                  <th>Fecha Creación</th>
                  <th>Monto Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenesData.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', color: '#666', padding: '30px' }}>
                      No se encontraron registros de órdenes en el backend de Java.
                    </td>
                  </tr>
                ) : (
                  ordenesData.map((order, idx) => (
                    <tr key={order.orderNumber || idx}>
                      <td style={{ fontFamily: 'monospace', color: '#00f2fe' }}>{order.orderNumber}</td>
                      <td><span style={{fontWeight: 'bold'}}>{order.status}</span></td>
                      <td>{order.trackingCode || "Pendiente Asignación"}</td>
                      <td>
                        {order.lines && order.lines.map((line, lIdx) => (
                          <div key={lIdx}>
                            {line.sku} <span style={{color: '#00c2ff'}}>(x{line.quantity})</span>
                          </div>
                        ))}
                      </td>
                      <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("es-ES") : "Reciente"}</td>
                      <td><strong>${order.totalAmount ? order.totalAmount.toLocaleString() : '0'}</strong></td>
                      <td>
                        <button
                          style={{ backgroundColor: "#ff4d4f", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                          onClick={() => handleDeleteOrder(order.orderNumber)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* PESTAÑA: ENVÍOS */}
      {currentTab === 'envios' && (
        <>
          <section className="metrics-row">
            <div className="metric-box">
              <div className="metric-title">Total Envíos Activos</div>
              <div className="metric-value neon">{enviosData ? enviosData.length : 0}</div>
            </div>
          </section>

          {/* MENSAJE DE ALERTA DE DIAGNÓSTICO EN TIEMPO REAL */}
          {enviosError && (
            <div style={{ backgroundColor: '#1e293b', borderLeft: '4px solid #f59e0b', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
              <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '5px' }}>⚠️ Alerta del Microservicio de Envíos:</strong>
              <p style={{ color: '#cbd5e1', margin: 0, fontSize: '13px' }}>{enviosError}</p>
            </div>
          )}

          <div className="content-card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
              <h2>Seguimiento de Envíos Real (Microservicio)</h2>
              <button onClick={loadRealShipments} style={{padding: '5px 10px', cursor: 'pointer', backgroundColor: '#00f2fe', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold'}}>
                {loadingEnvios ? "Sincronizando..." : "🔄 Actualizar Envíos"}
              </button>
            </div>
            
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código Tracking</th>
                  <th>N° Orden Relacionada</th>
                  <th>Transportista (Carrier)</th>
                  <th>Código de Ruta</th>
                  <th>Estado Logístico</th>
                </tr>
              </thead>
              <tbody>
                {!enviosData || enviosData.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8', padding: '30px' }}>
                      No hay datos que mostrar en este momento. Llena registros en Java o verifica el error de arriba.
                    </td>
                  </tr>
                ) : (
                  enviosData.map((shipment, idx) => (
                    <tr key={`shipment-row-${idx}`} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ fontFamily: 'monospace', color: '#00f2fe', padding: '12px', fontSize: '14px' }}>
                        {shipment.trackingCode || "N/A"}
                      </td>
                      <td style={{ padding: '12px', color: '#ffffff', fontSize: '14px' }}>
                        {shipment.orderNumber || "N/A"}
                      </td>
                      <td style={{ padding: '12px', color: '#ffffff', fontSize: '14px' }}>
                        {shipment.carrier || "No asignado"}
                      </td>
                      <td style={{ fontFamily: 'monospace', padding: '12px', color: '#ffffff', fontSize: '14px' }}>
                        {shipment.routeCode || "N/A"}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          backgroundColor: '#00f2fe22', 
                          color: '#00f2fe', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '12px',
                          fontWeight: 'bold',
                          display: 'inline-block'
                        }}>
                          • {shipment.status || "PENDIENTE"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
}