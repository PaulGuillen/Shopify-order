import "./../../styles/components/orders/orderModal.css";
import {
  formatShopifyDate,
  paymentLabel,
  fulfillmentLabel,
} from "../../utils/ordersUtil";

type Props = {
  order: any;
  onClose: () => void;
  onAssign?: (order: any) => void;
};

export default function OrderDetailModal({
  order,
  onClose,
  onAssign,
}: Props) {
  if (!order) return null;

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}

        <div className="modal-header">
          <div>
            <h2>Pedido #{order.order_number}</h2>
            <p className="modal-subtitle">
              Revisa la información completa del pedido
            </p>
          </div>

          <button className="order-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-divider" />

        {/* CONTENT */}

        <div className="modal-content">

          {/* INFORMACIÓN PEDIDO */}

          <div className="order-modal-section">
            <h3>Información del pedido</h3>

            <div className="order-grid">
              <div>
                <span>Fecha</span>
                <p>{formatShopifyDate(order.created_at)}</p>
              </div>

              <div>
                <span>Total</span>
                <p>{order.currency} {order.total_price}</p>
              </div>

              <div>
                <span>Método de pago</span>
                <p>{order.payment_gateway}</p>
              </div>

              <div>
                <span>Estado del pago</span>
                <p>{paymentLabel(order.financial_status)}</p>
              </div>

              <div>
                <span>Estado del pedido</span>
                <p>{fulfillmentLabel(order.fulfillment_status)}</p>
              </div>

              <div>
                <span>Código de confirmación</span>
                <p>{order.confirmation}</p>
              </div>
            </div>
          </div>

          <div className="modal-divider" />

          {/* PRODUCTO */}

          <div className="order-modal-section">
            <h3>Producto</h3>

            <div className="order-grid">
              <div>
                <span>Producto</span>
                <p>{order.product?.name}</p>
              </div>

              <div>
                <span>Cantidad</span>
                <p>{order.product?.quantity}</p>
              </div>

              <div>
                <span>Precio</span>
                <p>{order.product?.price}</p>
              </div>

              <div>
                <span>Proveedor</span>
                <p>{order.product?.vendor}</p>
              </div>
            </div>
          </div>

          <div className="modal-divider" />

          {/* CLIENTE */}

          <div className="order-modal-section">
            <h3>Cliente</h3>

            <div className="order-grid">
              <div>
                <span>Nombre</span>
                <p>{order.customer?.name}</p>
              </div>

              <div>
                <span>Teléfono</span>
                <p>{order.customer?.phone}</p>
              </div>

              <div>
                <span>Departamento</span>
                <p>{order.customer?.department}</p>
              </div>

              <div>
                <span>Distrito</span>
                <p>{order.customer?.district}</p>
              </div>

              <div>
                <span>Ciudad</span>
                <p>{order.customer?.city}</p>
              </div>

              <div>
                <span>Tipo de región</span>
                <p>{order.customer?.region_type}</p>
              </div>

              <div>
                <span>Dirección</span>
                <p>{order.customer?.address}</p>
              </div>
            </div>
          </div>

          <div className="modal-divider" />

          {/* TRACKING */}

          <div className="order-modal-section">
            <h3>Tracking Marketing</h3>

            <div className="order-grid">
              <div>
                <span>Source</span>
                <p>{order.utm?.source}</p>
              </div>

              <div>
                <span>Campaign</span>
                <p>{order.utm?.campaign}</p>
              </div>

              <div>
                <span>Medium</span>
                <p>{order.utm?.medium}</p>
              </div>

              <div>
                <span>Content</span>
                <p>{order.utm?.content}</p>
              </div>

              <div>
                <span>Term</span>
                <p>{order.utm?.term}</p>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER */}

        <div className="modal-footer">

          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>

          <button
            className="btn-assign"
            onClick={() => onAssign && onAssign(order)}
          >
            Asignármelo
          </button>

        </div>

      </div>
    </div>
  );
}