import { formatDateISO } from "../../utils/formatDate";
import { formatMoney } from "../../utils/generalUtil";
import "./../../styles/components/orders/ordersTable.css";

interface Props {
  readonly orders: any[];
  readonly loading: boolean;
  readonly onSelectOrder?: (order: any) => void;

  /* 🔥 NUEVO */
  readonly statusConfig: any;
}

export default function OrdersTable({
  orders,
  loading,
  onSelectOrder,
  statusConfig,
}: Props) {
  if (loading) return <p>Cargando...</p>;

  if (!orders.length) return <p>No hay pedidos</p>;

  return (
    <div className="orders-table">
      {/* HEADER */}
      <div className="table-header">
        <span># Pedido</span>
        <span>Cliente</span>
        <span>Ubicación</span>
        <span>Estado</span>
        <span>Pago</span>
        <span>Vendedor</span>
        <span>Observación</span> {/* 🔥 NUEVO */}
        <span>Fecha</span>
      </div>

      {orders.map((order) => {
        const safeStatus = order?.status || order?.data?.status || "unassigned";

        const status =
          statusConfig?.[safeStatus] || statusConfig?.["unassigned"];

        return (
          <div
            key={order.id}
            className="table-row"
            onClick={() => onSelectOrder?.(order)}
          >
            {/* PEDIDO */}
            <span data-label="# Pedido">#{order.order_number}</span>

            {/* CLIENTE */}
            <div className="customer" data-label="Cliente">
              <p className="customer-name">
                {order.customer?.name || "Sin nombre"}
              </p>

              <span className="customer-phone">
                {order.customer?.phone || "-"}
              </span>
            </div>

            {/* UBICACIÓN */}
            <span data-label="Ubicación">
              {order.customer?.department || "-"} -{" "}
              {order.customer?.district || "-"}
            </span>

            {/* 🔥 ESTADO DINÁMICO */}
            <span data-label="Estado">
              <span
                className="badge"
                style={{
                  backgroundColor: `${status?.color}15`,
                  color: status?.color,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: status?.color,
                    display: "inline-block",
                    marginRight: 6,
                  }}
                />
                {status?.label}
              </span>
            </span>

            {/* 💰 PAGO */}
            <div data-label="Pago" className="payment-box">
              <span className="payment-total">
                Total: S/ {formatMoney(order.total_price)}
              </span>

              <div className="payment-divider" />

              {order.adelanto > 0 && (
                <span className="payment-adelanto">
                  💰 Adelanto: S/ {formatMoney(order.adelanto)}
                </span>
              )}

              {order.total_final != null && (
                <span className="payment-saldo">
                  🧾 Cobrar: S/ {formatMoney(order.total_final)}
                </span>
              )}

              {(() => {
                const method = (
                  order.metodo ||
                  order.payment_gateway ||
                  ""
                ).toLowerCase();

                let methodClass = "method-default";

                if (method.includes("yape")) methodClass = "method-yape";
                else if (method.includes("plin")) methodClass = "method-plin";
                else if (method.includes("transfer"))
                  methodClass = "method-transferencia";

                return (
                  <span className={`payment-method ${methodClass}`}>
                    {method}
                  </span>
                );
              })()}
            </div>

            {/* VENDEDOR */}
            <span data-label="Vendedor">{order.advisor || "Sin asignar"}</span>

            {/* 🔥 OBSERVACION */}
            <span data-label="Observación" className="obs-box">
              {order.observacion || "Sin observación"}
            </span>

            {/* FECHA */}
            <span data-label="Fecha" className="date-box">
              <span className="date-created">
                Primer registro: {order.created_day}
              </span>

              {order.dataUpdated?.meta?.updatedAtFormatted && (
                <span className="date-updated">
                  Modificación:{" "}
                  {formatDateISO(order.dataUpdated.meta.updatedAtFormatted)}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
