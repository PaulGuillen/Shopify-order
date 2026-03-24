import "./../../styles/components/orders/ordersTable.css";

interface Props {
  orders: any[];
  loading: boolean;
}

export default function OrdersTable({ orders, loading }: Props) {

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
        <div key={order.id} className="table-row">

          <span>#{order.order_number}</span>

          <div className="customer">
            <p>{order.customer?.name}</p>
            <span>{order.customer?.phone}</span>
          </div>

          <span>
            {order.customer?.city} - {order.customer?.department}
          </span>

          <span className={`badge ${order.status}`}>
            {order.status}
          </span>

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