import "./../../styles/components/orders/ordersHeader.css";

export default function OrdersHeader() {
  return (
    <div className="orders-header">
      <h2>Gestión de Pedidos</h2>

      <div className="orders-actions">
        <button className="btn-secondary">Exportar</button>
        <button className="btn-secondary">+ Pedido Rápido</button>
        <button className="btn-primary">+ Crear Orden</button>
      </div>
    </div>
  );
}
