import "../styles/pages/dashboardPage.css";

export default function Header() {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <span className="search-icon">🔎</span>
        <input placeholder="Buscar pedidos, productos o clientes..." />
      </div>

      <div className="topbar-right">
        <button className="icon-btn" title="Notificaciones">
          🔔
          <span className="dot" />
        </button>

        <div className="divider" />

        <div className="user-chip">
          <div className="avatar">A</div>
          <span className="user-name">Alex Rivers</span>
        </div>
      </div>
    </header>
  );
}
