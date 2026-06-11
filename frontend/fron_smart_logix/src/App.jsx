import React, { useState } from 'react';
import './App.css';

export default function App() {
  // Estado de Autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Control de pestañas de navegación
  const [currentTab, setCurrentTab] = useState('inventario');

  // Datos simulados del Backend (Basado en el estado de tus tablas)
  const [inventarioData, setInventarioData] = useState([
    { sku: 'SKU-1001', producto: 'Teclado Mecanico RGB', bodega: 'WH-SCL-01', cantidad: 120, estado: 'Disponible' },
    { sku: 'SKU-2001', producto: 'Mouse Inalambrico', bodega: 'WH-SCL-01', cantidad: 200, estado: 'Disponible' },
    { sku: 'SKU-3001', producto: 'Monitor 24 Pulgadas', bodega: 'WH-VAP-02', cantidad: 45, estado: 'Disponible' }
  ]);

  const [ordenesData, setOrdenesData] = useState([]); // Vacío como en Captura 150352
  const [enviosData, setEnviosData] = useState([]);   // Vacío como en Captura 150408
  const [rawJsonBackend, setRawJsonBackend] = useState('[]'); // Estado del JSON []

  // Manejo del Login Estricto
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Usuario o contraseña incorrectos.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // ================= VISTA 1: FORMULARIO DE LOGIN =================
  if (!isLoggedIn) {
    return (
      <div className="login-bg">
        <div className="login-card">
          <form onSubmit={handleLoginSubmit}>
            {loginError && <p className="error-msg">{loginError}</p>}
            <input 
              type="text" 
              className="login-input" 
              placeholder="Username" 
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
            <button type="submit" className="login-btn">Login</button>
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

      {/* SECCIÓN VARIABLE SEGÚN LA PESTAÑA SELECCIONADA */}
      
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
              <div className="metric-value">0</div>
            </div>
            <div className="metric-box">
              <div className="metric-title">Monto Total</div>
              <div className="metric-value neon">$0.00</div>
            </div>
          </section>

          <div className="content-card">
            <h2>Órdenes de Compra</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Órden</th>
                  <th>Cliente</th>
                  <th>Fecha Creación</th>
                  <th>Monto Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenesData.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#666', padding: '30px' }}>
                      No hay órdenes registradas actualmente.
                    </td>
                  </tr>
                ) : (
                  ordenesData.map((ord, idx) => <tr key={idx}><td>{ord.id}</td></tr>)
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
              <div className="metric-title">Despachos en Arreglo (Length)</div>
              <div className="metric-value neon">0</div>
            </div>
          </section>

          {/* Recuadro de Análisis Backend (De tu captura 150408) */}
          <div className="json-analizer-box">
            <h4>Análisis del JSON del Backend:</h4>
            <p>Si ves texto aquí abajo, cópialo y pégalo en el chat para decirte cómo solucionar la tabla vacía:</p>
            <div className="json-display">{rawJsonBackend}</div>
          </div>

          <div className="content-card">
            <h2>Seguimiento de Envíos</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código Tracking</th>
                  <th>Transportista</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {enviosData.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: '#666', padding: '30px' }}>
                      No se encontraron registros de envíos activos.
                    </td>
                  </tr>
                ) : (
                  enviosData.map((env, idx) => <tr key={idx}><td>{env.id}</td></tr>)
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
}