import "./../../styles/components/orders/ordersRow.css";

export default function OrdersRow({ order }: any) {
  return (
    <div className="table-row">
      <span>#{order.order_number}</span>

      <div className="customer">
        <p>{order.customer?.name}</p>
        <span>{order.customer?.phone}</span>
      </div>

      <span>
        {order.customer?.city} - {order.customer?.department}
      </span>

      <span
        className={`badge ${
          order.status === "unassigned"
            ? "unassigned"
            : order.financial_status === "paid"
              ? "paid"
              : order.cancelled
                ? "cancelled"
                : "pending"
        }`}
      >
        {order.status === "unassigned"
          ? "Sin Asignar"
          : order.financial_status === "paid"
            ? "Pagado"
            : order.cancelled
              ? "Cancelado"
              : "Pendiente"}
      </span>

      <div className="payment">
        <p>S/ {order.pricing?.final_total}</p>
        <span>{order.payment_gateway}</span>
      </div>

      <span>{order.advisorEmail || "Sin asignar"}</span>

      <span>{order.created_day}</span>
    </div>
  );
}
