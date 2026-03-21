import { useState } from "react";
import "./../../styles/components/orders/contactOrderModal.css";

import {
  formatShopifyDate,
  paymentLabel,
  fulfillmentLabel,
} from "../../utils/ordersUtil";

import { useUpdateOrderStatus } from "../../hooks/useOrders";
import StatusSelectorModal from "../common/StatusSelectorModal";

type Props = {
  order: any;
  onClose: () => void;
};

export default function ContactOrderModal({ order, onClose }: Readonly<Props>) {
  const { handleUpdateStatus, loadingStatus } = useUpdateOrderStatus();

  if (!order) return null;

  /* =============================
     🔥 BASE DATA (SHOPIFY)
  ============================== */

  const originalQty = order.product?.quantity || 1;
  const realPrice = Number(order.product?.price || 0);
  const originalTotal = Number(order.total_price || 0);

  const [qty, setQty] = useState(originalQty);

  const increase = () => setQty((q: number) => q + 1);
  const decrease = () => setQty((q: number) => (q > 1 ? q - 1 : 1));

  /* =============================
     🔥 TOTAL DINÁMICO (CORRECTO)
  ============================== */

  let total = 0;

  if (qty >= originalQty) {
    total = originalTotal + (qty - originalQty) * realPrice;
  } else if (qty === 2) {
    total = originalTotal;
  } else {
    total = realPrice;
  }

  /* =============================
     CLIENT DATA
  ============================== */

  const [dni, setDni] = useState(order.customer?.dni || "");
  const [address, setAddress] = useState(order.customer?.address || "");

  /* =============================
     🔥 STATUS CONFIG
  ============================== */

  const STATUS_CONFIG = {
    llamada: [
      { label: "Contactado", color: "blue" },
      { label: "No contesta", color: "red" },
      { label: "Agendado", color: "yellow" },
      { label: "Corta llamada", color: "orange" },
    ],
    confirmacion: [
      { label: "Pendiente", color: "yellow" },
      { label: "Confirmado", color: "green" },
      { label: "No desea", color: "red" },
      { label: "Cancelado", color: "darkred" },
      { label: "Duplicado", color: "gray" },
    ],
    adelanto: [
      { label: "Parcial", color: "green" },
      { label: "Pagado total", color: "darkgreen" },
      { label: "No aplica", color: "gray" },
    ],
  };

  /* =============================
     STATE
  ============================== */

  const [statuses, setStatuses] = useState({
    llamada: "",
    confirmacion: "",
    adelanto: "",
  });

  const [activeSelector, setActiveSelector] = useState<string | null>(null);

  const handleSelect = (key: string, value: string) => {
    setStatuses((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getColorClass = (value: string, key: string) => {
    const found = STATUS_CONFIG[key as keyof typeof STATUS_CONFIG].find(
      (s) => s.label === value,
    );
    return found?.color || "gray";
  };

  /* =============================
     ACTION
  ============================== */

  const update = async () => {
    const newData = {
      customer: {
        dni,
        address,
      },
      order: {
        quantity: qty,
        total,
      },
      tracking: {
        llamada: statuses.llamada,
        confirmacion: statuses.confirmacion,
        adelanto: statuses.adelanto,
      },
    };

    const ok = await handleUpdateStatus(
      order,
      "update_contact",
      newData,
    );

    if (ok) {
      window.dispatchEvent(new Event("orders-updated"));
      onClose();
    }
  };

  /* =============================
     RENDER
  ============================== */

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h2>Pedido #{order.order_number}</h2>
            <p className="modal-subtitle">Gestión de contacto con el cliente</p>
          </div>

          <button className="order-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-divider" />

        {/* BODY */}
        <div className="modal-content">
          {/* CLIENTE */}
          <div className="order-modal-section">
            <h3>Información del cliente</h3>

            <div className="customer-card">
              <div className="customer-row">
                <span>Nombre</span>
                <p>{order.customer?.name}</p>
              </div>

              <div className="customer-row">
                <span>Teléfono</span>
                <p>{order.customer?.phone}</p>
              </div>

              <div className="customer-row">
                <span>Región</span>
                <p>{order.customer?.region_type}</p>
              </div>

              <div className="customer-row">
                <span>Ubicación</span>
                <p>
                  {order.customer?.district} - {order.customer?.department}
                </p>
              </div>

              <div className="customer-row">
                <span>DNI</span>
                <input
                  className="input-field"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  placeholder="Ingrese DNI"
                />
              </div>

              <div className="customer-row full">
                <span>Dirección</span>
                <input
                  className="input-field"
                  value={address || ""}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ingrese dirección"
                />
              </div>
            </div>
          </div>

          <div className="modal-divider" />

          {/* PEDIDO */}
          <div className="order-modal-section">
            <h3>Información del pedido</h3>

            <div className="order-grid">
              <div>
                <span>Fecha</span>
                <p>{formatShopifyDate(order.created_at)}</p>
              </div>

              <div>
                <span>Total original</span>
                <p>
                  {order.currency} {originalTotal}
                </p>
              </div>

              <div>
                <span>Estado del pago</span>
                <p>{paymentLabel(order.financial_status)}</p>
              </div>

              <div>
                <span>Estado del pedido</span>
                <p>{fulfillmentLabel(order.fulfillment_status)}</p>
              </div>
            </div>
          </div>

          <div className="modal-divider" />

          {/* PRODUCTO */}
          <div className="order-modal-section">
            <h3>Producto</h3>

            <div className="product-card">
              <div className="product-left">
                <p className="product-name">{order.product?.name}</p>

                <span className="product-sku">
                  Cantidad inicial: {originalQty}
                </span>

                  <span className="product-sku">
                  Vendedor: {order.product.vendor}
                </span>

                <span className="product-price">
                  Precio real: {order.currency} {realPrice.toFixed(2)}
                </span>

                {order.total_discount > 0 && qty > 2 && (
                  <span className="promo-label">
                    🔥 Descuento aplicado: -{order.currency}{" "}
                    {order.total_discount}
                  </span>
                )}
              </div>

              <div className="product-stepper">
                <button onClick={decrease}>−</button>
                <span className="qty">{qty}</span>
                <button onClick={increase}>+</button>
              </div>
            </div>

            <div className="product-total">
              <span>Total a cobrar</span>
              <p>
                {order.currency} {total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="modal-divider" />

          {/* ESTADOS */}
          <div className="order-modal-section">
            <h3>Estados del pedido</h3>

            <div className="status-grid">
              {[
                { label: "Llamada", key: "llamada" as const },
                { label: "Confirmación", key: "confirmacion" as const },
                { label: "Adelanto", key: "adelanto" as const },
              ].map((item) => (
                <button
                  key={item.key}
                  className="dropdown-card"
                  onClick={() => setActiveSelector(item.key)}
                  type="button"
                >
                  <span className="dropdown-label">{item.label}</span>

                  <div className="status-value">
                    <span
                      className={`chip ${getColorClass(
                        statuses[item.key],
                        item.key,
                      )}`}
                    >
                      {statuses[item.key] || "Seleccionar"}
                    </span>

                    <span className="status-arrow">›</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="modal-footer contact-actions">
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={loadingStatus}
          >
            Cancelar
          </button>

          <button
            className="btn-success"
            onClick={update}
            disabled={loadingStatus}
          >
            ✔ Actualizar
          </button>
        </div>
      </div>

      {/* MODAL SELECTOR */}
      {activeSelector && (
        <StatusSelectorModal
          title={`Seleccionar ${activeSelector}`}
          options={STATUS_CONFIG[activeSelector as keyof typeof STATUS_CONFIG]}
          onClose={() => setActiveSelector(null)}
          onSelect={(value) => {
            handleSelect(activeSelector, value);
            setActiveSelector(null);
          }}
        />
      )}
    </div>
  );
}
