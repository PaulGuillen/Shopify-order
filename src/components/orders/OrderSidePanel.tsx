import { useState, useEffect } from "react";
import "./../../styles/components/orders/orderSidePanel.css";
import StatusDropdown from "./StatusDropdown";
import AgencySelectorModal from "../common/AgencySelectorModal";
import CourierSelector from "../common/CourierSelector";

export default function OrderSidePanel({ order, onClose }: any) {
  const [status, setStatus] = useState(order.status);

  // 🔥 COURIER
  const [courier, setCourier] = useState(order.courier || "Shalom");
  const [customCourier, setCustomCourier] = useState("");

  // 🔥 AGENCIA
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<any>(null);

  // 🔥 AGENCIAS CACHE
  const [agencies] = useState<any[]>(() => {
    const cache = localStorage.getItem("agencies_cache");
    if (!cache) return [];
    try {
      return JSON.parse(cache);
    } catch {
      return [];
    }
  });

  const [deliveryDate, setDeliveryDate] = useState(
    order.delivery_date || order.created_day,
  );

  useEffect(() => {
    if (order?.agency) {
      setSelectedAgency(order.agency);
    }
  }, [order]);

  const handleOpenAgency = () => {
    if (courier === "Shalom") {
      setShowAgencyModal(true);
    }
  };

  const handleUpdate = () => {
    const finalCourier = courier === "Otros" ? customCourier : courier;

    const payload = {
      ...order,
      status,
      courier: finalCourier,
      agency: courier === "Shalom" ? selectedAgency : null,
    };

    console.log("🚀 UPDATE:", payload);

    alert("✅ Estado actualizado correctamente");
  };

  return (
    <>
      <div className="sidepanel-overlay" onClick={onClose}>
        <div className="sidepanel" onClick={(e) => e.stopPropagation()}>
          {/* HEADER */}
          <div className="sidepanel-header">
            <div className="header-close">
              <button className="close-btn" onClick={onClose}>
                ✕
              </button>
            </div>

            <div className="header-row">
              <h2 className="order-id"># {order.order_number}</h2>

              <StatusDropdown
                value={status}
                onChange={(val) => setStatus(val)}
              />
            </div>
          </div>

          {/* VENDEDOR */}
          <div className="seller-row">
            <span>Vendedor:</span>
            <div className="select-like">
              {order.advisorEmail || "Sin asignar"}
            </div>
          </div>

          {/* BODY */}
          <div className="sidepanel-body">
            {/* CLIENTE */}
            <div className="card">
              <div className="card-header">
                <span>👤 Cliente</span>
              </div>

              <p className="main-text">{order.customer?.name}</p>
              <span className="sub-text">{order.customer?.phone}</span>
            </div>

            {/* ENVÍO */}
            <div className="card">
              <div className="card-header">
                <span>📦 Envío</span>
              </div>

              {/* COURIER */}
              <div>
                <span>Courier</span>

                <CourierSelector
                  value={courier}
                  onChange={(val) => setCourier(val)}
                  onCustomChange={(val) => setCustomCourier(val)}
                />
              </div>

              {/* AGENCY BOX 🔥 */}
              <div
                className={`agency-box ${selectedAgency ? "selected" : ""}`}
                onClick={handleOpenAgency}
              >
                {courier === "Shalom" && selectedAgency && (
                  <>
                    <div className="agency-header-row">
                      <span>📍 Agencia destino</span>
                      <span className="agency-badge">✔ Seleccionado</span>
                    </div>

                    <p className="agency-name">{selectedAgency.name}</p>
                    <span className="agency-address">
                      {selectedAgency.address}
                    </span>
                  </>
                )}

                {courier === "Shalom" && !selectedAgency && (
                  <span className="agency-placeholder">
                    Seleccionar agencia destino
                  </span>
                )}

                {courier !== "Shalom" && courier !== "Otros" && (
                  <span className="agency-placeholder">
                    Envío por {courier}
                  </span>
                )}

                {courier === "Otros" && customCourier && (
                  <span className="agency-placeholder">{customCourier}</span>
                )}

                {courier === "Otros" && !customCourier && (
                  <span className="agency-placeholder">Escribe un courier</span>
                )}
              </div>

              {/* FECHA */}
              <div className="delivery-box mt">
                <div className="delivery-header">
                  <span>📅 Programada / Reserva</span>
                </div>

                <input
                  type="date"
                  className="delivery-input"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
            </div>

            {/* PRODUCTOS */}
            <div className="card">
              <div className="card-header">
                <span>📦 Productos (1)</span>
              </div>

              <div className="row-between">
                <div>
                  <p className="main-text">
                    {order.product?.name || "Producto"}
                  </p>
                  <span className="sub-text">1 x S/ {order.total_price}</span>
                </div>

                <span>S/ {order.total_price}</span>
              </div>

              <div className="divider" />

              <div className="row-between total">
                <span>Total a Cobrar</span>
                <span>S/ {order.total_price}</span>
              </div>

              <span className="hint">
                Click en el total para aplicar descuento manual
              </span>
            </div>

            {/* ESTADO */}
            <div className="status-box">
              <span>🚚 Estado Shalom</span>
              <span className="pill green">Terrestre</span>
            </div>

            {/* PAGO */}
            <div className="card">
              <div className="card-header row-between">
                <span>💳 Pago</span>
                <button className="btn-light">Registrar Pago</button>
              </div>

              <div className="row-between">
                <span>Total del pedido</span>
                <span>S/ {order.total_price}</span>
              </div>

              <div className="payment-warning">
                Pendiente (COD)
                <span>S/ {order.total_price}</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="sidepanel-footer">
            <button className="btn-primary full" onClick={handleUpdate}>
              🔗 Actualizar
            </button>

            <button className="btn-link">Ver historial de actividad</button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showAgencyModal && (
        <AgencySelectorModal
          agencies={agencies}
          onClose={() => setShowAgencyModal(false)}
          onSelect={(agency) => {
            setSelectedAgency(agency);
            setShowAgencyModal(false);
          }}
        />
      )}
    </>
  );
}
