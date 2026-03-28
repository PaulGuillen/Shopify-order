import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "../styles/layout/sidebar.css";

interface SidebarProps {
  open: boolean;
  closeSidebar: () => void;
}

export default function Sidebar({ open, closeSidebar }: SidebarProps) {
  const location = useLocation();

  /* ================================
     🔐 AUTH LOCAL (AUTÓNOMO)
  ================================= */
  const auth = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const role = user?.role?.trim().toLowerCase() || "";

      return {
        user,
        role,
        isAdmin: role === "admin",
        isAsesora: role === "asesora",
        isAuthenticated: !!user?.email,
      };
    } catch {
      return {
        user: null,
        role: "",
        isAdmin: false,
        isAsesora: false,
        isAuthenticated: false,
      };
    }
  }, []);

  /* ================================
     📂 DROPDOWN PEDIDOS
  ================================= */
  const [ordersOpen, setOrdersOpen] = useState(false);

  /* 🔥 AUTO OPEN SEGÚN RUTA */
  useEffect(() => {
    if (
      location.pathname.startsWith("/orders") ||
      location.pathname.startsWith("/draft-orders")
    ) {
      setOrdersOpen(true);
    }
  }, [location.pathname]);

  const toggleOrders = () => {
    setOrdersOpen((prev) => !prev);
  };

  /* ================================
     🎯 ACTIVE PARENT
  ================================= */
  const isOrdersActive =
    location.pathname.startsWith("/orders") ||
    location.pathname.startsWith("/draft-orders");

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      {/* ================================
         🏷️ BRAND
      ================================= */}
      <div className="sidebar-brand">
        <div className="brand-icon">🛍️</div>
        <div>
          <div className="brand-title">Storefront Pro</div>
          <div className="brand-subtitle">Panel de Administración</div>
        </div>
      </div>

      {/* ================================
         📌 NAV
      ================================= */}
      <nav className="sidebar-nav">
        {/* ================= ADMIN ================= */}
        {auth.isAdmin && (
          <>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={closeSidebar}
            >
              <span>🏠</span> Inicio
            </NavLink>

            {/* 🔥 DROPDOWN PEDIDOS */}
            <div
              className={`nav-item dropdown ${isOrdersActive ? "active" : ""}`}
              onClick={toggleOrders}
            >
              <div className="nav-left">
                <span>🧾</span>
                <span>Pedidos</span>
              </div>

              <span className={`arrow ${ordersOpen ? "open" : ""}`}>▾</span>
            </div>

            {ordersOpen && (
              <div className="submenu">
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    isActive ? "nav-subitem active" : "nav-subitem"
                  }
                  onClick={closeSidebar}
                >
                  Todas las órdenes
                </NavLink>

                <NavLink
                  to="/draft-orders"
                  className={({ isActive }) =>
                    isActive ? "nav-subitem active" : "nav-subitem"
                  }
                  onClick={closeSidebar}
                >
                  Borradores
                </NavLink>
              </div>
            )}

            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={closeSidebar}
            >
              <span>📦</span> Productos
            </NavLink>

            <NavLink
              to="/customers"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={closeSidebar}
            >
              <span>👥</span> Usuarios
            </NavLink>

            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={closeSidebar}
            >
              <span>📈</span> Analítica
            </NavLink>

            <NavLink
              to="/agency"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={closeSidebar}
            >
              <span>📣</span> Agencias
            </NavLink>
          </>
        )}

        {/* ================= ASESORA ================= */}
        {auth.isAsesora && (
          <>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={closeSidebar}
            >
              <span>🏠</span> Inicio
            </NavLink>

            {/* 🔥 DROPDOWN */}
            <div
              className={`nav-item dropdown ${isOrdersActive ? "active" : ""}`}
              onClick={toggleOrders}
            >
              <div className="nav-left">
                <span>🧾</span>
                <span>Pedidos</span>
              </div>

              <span className={`arrow ${ordersOpen ? "open" : ""}`}>▾</span>
            </div>

            {ordersOpen && (
              <div className="submenu">
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    isActive ? "nav-subitem active" : "nav-subitem"
                  }
                  onClick={closeSidebar}
                >
                  Órdenes
                </NavLink>

                <NavLink
                  to="/draft-orders"
                  className={({ isActive }) =>
                    isActive ? "nav-subitem active" : "nav-subitem"
                  }
                  onClick={closeSidebar}
                >
                  Borradores
                </NavLink>
              </div>
            )}

            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={closeSidebar}
            >
              <span>📦</span> Productos
            </NavLink>

            <NavLink
              to="/agency"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={closeSidebar}
            >
              <span>📣</span> Agencia
            </NavLink>
          </>
        )}
      </nav>

      {/* ================= FOOTER ================= */}
      {auth.isAdmin && (
        <div className="sidebar-footer">
          <NavLink to="/settings" className="nav-item" onClick={closeSidebar}>
            <span>⚙️</span> Configuración
          </NavLink>
        </div>
      )}
    </aside>
  );
}
