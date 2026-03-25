import { useState } from "react";
import "./../../styles/components/orders/orderSidePanel.css";
import StatusDropdown from "./StatusDropdown";

export default function OrderSidePanel({ order, onClose }: any) {
  const [status, setStatus] = useState(order.status);
  const handleUpdate = () => {
    alert("✅ Estado actualizado correctamente");
  };

  return (
    <div className="sidepanel-overlay" onClick={onClose}>
      <div className="sidepanel" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="sidepanel-header">
          {/* CLOSE (ARRIBA SOLO) */}
          <div className="header-close">
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* ROW PRINCIPAL */}
          <div className="header-row">
            <h2 className="order-id"># {order.order_number}</h2>

            <StatusDropdown value={status} onChange={(val) => setStatus(val)} />
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

            <div className="row-between">
              <span>Courier</span>
              <span>{order.courier || "Shalom"}</span>
            </div>

            <div className="pill">Recojo en agencia</div>

            <span className="sub-text">Sin agencia seleccionada</span>

            <div className="row-between mt">
              <span>Programada / Reserva</span>
              <span>{order.created_day}</span>
            </div>
          </div>

          {/* PRODUCTOS */}
          <div className="card">
            <div className="card-header">
              <span>📦 Productos (1)</span>
            </div>

            <div className="row-between">
              <div>
                <p className="main-text">{order.product?.name || "Producto"}</p>
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

          {/* ESTADO SHALOM */}
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
  );
}
