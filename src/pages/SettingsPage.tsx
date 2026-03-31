import { useState } from "react";
import "../styles/pages/settingsPage.css";
import { statusConfig } from "../utils/statusUtil";

export default function SettingsPage() {
  /* =========================
     🔥 COURIERS STATE
  ========================= */
  const [couriers, setCouriers] = useState<string[]>([
    "Shalom",
    "Olva",
    "Zeus",
  ]);

  const [newCourier, setNewCourier] = useState("");

  const addCourier = () => {
    if (!newCourier.trim()) return;

    if (couriers.includes(newCourier)) return;

    setCouriers([...couriers, newCourier]);
    setNewCourier("");
  };

  const removeCourier = (name: string) => {
    setCouriers(couriers.filter((c) => c !== name));
  };

  return (
    <div className="settings-page">
      {/* =========================
         🔥 ESTADOS
      ========================= */}
      <div className="status-section">
        <div className="status-header">
          <div>
            <h2>Personalizar Estados de Pedidos</h2>
            <p>
              Configura los nombres y colores de identificación para tu flujo
              logístico.
            </p>
          </div>

          <button className="btn-primary">Guardar Cambios</button>
        </div>

        <div className="status-grid">
          {Object.entries(statusConfig).map(([key, value]) => (
            <div key={key} className="status-card">
              <div className="status-dot" style={{ background: value.color }} />

              <div className="status-info">
                <span className="identifier">IDENTIFICADOR</span>
                <h4>{value.label}</h4>
              </div>

              <span
                className="status-tag"
                style={{
                  background: `${value.color}20`,
                  color: value.color,
                }}
              >
                {getStatusTag(key)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================
         🚚 COURIERS
      ========================= */}
      <div className="courier-section">
        <div className="status-header">
          <div>
            <h2>Personalizar Couriers</h2>
            <p>Agrega y gestiona los couriers disponibles para envíos.</p>
          </div>
        </div>

        {/* LISTA */}
        <div className="courier-list">
          {couriers.map((c, i) => (
            <div key={i} className="courier-chip">
              {c}
              <button onClick={() => removeCourier(c)}>✕</button>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="courier-add">
          <input
            placeholder="Nuevo courier..."
            value={newCourier}
            onChange={(e) => setNewCourier(e.target.value)}
          />
          <button className="btn-primary" onClick={addCourier}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

/* TAGS */
const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    unassigned: "Borrador",
    to_contact: "Pendiente",
    contacted: "En proceso",
    confirmed: "Confirmado",
    shipped: "En tránsito",
    delivered: "Exitoso",
    cancelled: "Fallido",
    not_delivered: "Alerta",
  };

  return map[status] || status;
};
