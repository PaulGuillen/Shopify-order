import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/layout/layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} closeSidebar={closeSidebar} />

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      <div className="app-main">
        <Header toggleSidebar={toggleSidebar} />
        <div className="app-content">{children}</div>
      </div>
    </div>
  );
}
