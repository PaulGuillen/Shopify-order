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
      <div className="table-header">
        <span># Pedido</span>
        <span>Cliente</span>
        <span>Ubicación</span>
        <span>Estado</span>
        <span>Pago</span>
        <span>Vendedor</span>
        <span>Fecha</span>
      </div>

      {orders.map((order) => (
        <div
          key={order.id}
          className="table-row"
          onClick={() => onSelectOrder?.(order)}
        >
          <span>#{order.order_number}</span>

          <div className="customer">
            <p>{order.customer?.name}</p>
            <span>{order.customer?.phone}</span>
          </div>

          <span>
            {order.customer?.city} - {order.customer?.department}
          </span>

          {(() => {
            const safeStatus =
              order?.status || order?.data?.status || "unassigned";

            const status =
              statusConfig[safeStatus] || statusConfig["unassigned"];

            return (
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
            );
          })()}

          <div>
            <p>S/ {order.total_price}</p>
            <span>{order.payment_gateway}</span>
          </div>

          <span>{order.advisorEmail || "Sin asignar"}</span>

          <span>{order.created_day}</span>
        </div>
      ))}
    </div>
  );
}
