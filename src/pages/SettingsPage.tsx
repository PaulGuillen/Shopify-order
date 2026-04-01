import { useState, useEffect } from "react";
import "../styles/pages/settingsPage.css";
import { useSettings } from "../hooks/useSettings";
import Loading from "../components/common/Loading";

export default function SettingsPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const shop = user.shop;

  const {
    statusConfig,
    setStatusConfig,
    couriers,
    setCouriers,
    saveAllSettings,
    loadSettings,
  } = useSettings(shop);

  const [newCourier, setNewCourier] = useState("");
  const [saving, setSaving] = useState(false);

  /* =========================
     🔥 EDIT LABEL
  ========================= */
  const handleChangeLabel = (key: string, value: string) => {
    setStatusConfig((prev: any) => ({
      ...prev,
      [key]: {
        ...prev[key],
        label: value,
      },
    }));
  };

  /* =========================
     🚚 COURIERS
  ========================= */
  const addCourier = () => {
    if (!newCourier.trim()) return;
    if (couriers.includes(newCourier)) return;

    setCouriers([...couriers, newCourier]);
    setNewCourier("");
  };

  const removeCourier = (name: string) => {
    setCouriers(couriers.filter((c) => c !== name));
  };

  /* =========================
     💾 SAVE
  ========================= */
  const handleSave = async () => {
    try {
      setSaving(true);

      await saveAllSettings();
      await loadSettings();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {saving && <Loading text="Guardando cambios..." fullscreen />}

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

            <button className="btn-primary" onClick={handleSave}>
              Guardar Cambios
            </button>
          </div>

          <div className="status-grid">
            {Object.entries(statusConfig || {}).map(([key, value]: any) => (
              <div key={key} className="status-card">
                <div
                  className="status-dot"
                  style={{ background: value.color || "#999" }}
                />

                <div className="status-info">
                  <span className="identifier">IDENTIFICADOR</span>

                  <input
                    className="status-input"
                    value={value.label}
                    onChange={(e) => handleChangeLabel(key, e.target.value)}
                  />
                </div>

                <span
                  className="status-tag"
                  style={{
                    background: `${value.color || "#999"}20`,
                    color: value.color || "#999",
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
      
    </>
  );
}

/* =========================
   TAGS
========================= */
const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    unassigned: "Sin asignar",
    to_contact: "Por contactar",
    contacted: "Contactado",
    confirmed: "Confirmado",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
    not_delivered: "No entregado",
  };

  return map[status] || status;
};
