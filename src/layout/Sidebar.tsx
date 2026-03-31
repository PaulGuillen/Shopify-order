import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "../styles/layout/sidebar.css";

interface SidebarProps {
  open: boolean;
  closeSidebar: () => void;
}

export default function Sidebar({ open, closeSidebar }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
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

  /* 🔥 LOGOUT */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

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

            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={closeSidebar}
            >
              <span>📈</span> Dashboard
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={closeSidebar}
            >
              <span>📦</span> Almacén
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
              to="/agency"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={closeSidebar}
            >
              <span>📣</span> Mis envíos
            </NavLink>

            <NavLink
              to="/customers"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={closeSidebar}
            >
              <span>👥</span> Mis Usuarios
            </NavLink>

            <NavLink
              to="/catalog"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={closeSidebar}
            >
              <span>📚</span> Catálogo
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={closeSidebar}
            >
              <span>⚙️</span> Configuración
            </NavLink>

            <NavLink
              to="/integrations"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={closeSidebar}
            >
              <span>🔌</span> Integraciones
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
              to="/agency"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={closeSidebar}
            >
              <span>📣</span> Mis envíos
            </NavLink>
          </>
        )}
      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          ⏻ Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
