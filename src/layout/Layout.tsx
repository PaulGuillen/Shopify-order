import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/layout/layout.css";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-shell">
      {/* SIDEBAR (PERSISTENTE 🔥) */}
      <Sidebar open={sidebarOpen} closeSidebar={closeSidebar} />

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* MAIN */}
      <div className="app-main">
        {/* CONTENIDO DINÁMICO */}
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}