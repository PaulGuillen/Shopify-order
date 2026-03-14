import "./../../styles/components/orders/ordersHeader.css";

type Props = {
  title: string;
};

export default function OrdersHeader({ title }: Props) {
  return (
    <div className="orders-header">
      <h1>{title}</h1>

      <div className="orders-actions">
        <button className="btn-secondary">Exportar</button>
        <button className="btn-primary">Crear pedido</button>
      </div>
    </div>
  );
}
