import { NavLink } from "react-router-dom";
import "../styles/pages/dashboardPage.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">🛍️</div>
        <div>
          <div className="brand-title">Storefront Pro</div>
          <div className="brand-subtitle">Panel de Administración</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>🏠</span> Inicio
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>🧾</span> Pedidos
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>📦</span> Productos
        </NavLink>

        <NavLink
          to="/customers"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>👥</span> Clientes
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>📈</span> Analítica
        </NavLink>

        <NavLink
          to="/marketing"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>📣</span> Marketing
        </NavLink>

        <NavLink
          to="/discounts"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>🏷️</span> Descuentos
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-item">
          <span>⚙️</span> Configuración
        </NavLink>
      </div>
    </aside>
  );
}
