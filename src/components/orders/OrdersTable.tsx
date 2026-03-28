import { statusConfig } from "../../utils/statusUtil";
import "./../../styles/components/orders/ordersTable.css";

interface Props {
  readonly orders: any[];
  readonly loading: boolean;
  readonly onSelectOrder?: (order: any) => void;
}

export default function OrdersTable({ orders, loading, onSelectOrder }: Props) {
  if (loading) return <p>Cargando...</p>;

  if (!orders.length) return <p>No hay pedidos</p>;

  return (
    <div className="orders-table">
      {/* HEADER (solo desktop) */}
      <div className="table-header">
        <span># Pedido</span>
        <span>Cliente</span>
        <span>Ubicación</span>
        <span>Estado</span>
        <span>Pago</span>
        <span>Vendedor</span>
        <span>Fecha</span>
      </div>

      {orders.map((order) => {
        const safeStatus = order?.status || order?.data?.status || "unassigned";

        const status = statusConfig[safeStatus] || statusConfig["unassigned"];

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
              <p>{order.customer?.name}</p>
              <span>{order.customer?.phone}</span>
            </div>

            {/* UBICACIÓN */}
            <span data-label="Ubicación">
              {order.customer?.city} - {order.customer?.department}
            </span>

            {/* ESTADO */}
            <span data-label="Estado">
              <span
                className="badge"
                style={{
                  backgroundColor: `${status.color}15`,
                  color: status.color,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: status.color,
                    display: "inline-block",
                    marginRight: 6,
                  }}
                />
                {status.label}
              </span>
            </span>

            {/* PAGO */}
            <div data-label="Pago">
              <p>S/ {order.total_price}</p>
              <span>{order.payment_gateway}</span>
            </div>

            {/* VENDEDOR */}
            <span data-label="Vendedor">{order.advisor || "Sin asignar"}</span>

            {/* FECHA */}
            <span data-label="Fecha">{order.created_day}</span>
          </div>
        );
      })}
    </div>
  );
}
