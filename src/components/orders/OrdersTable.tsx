import "./../../styles/components/orders/ordersTable.css";

import {
  formatShopifyDate,
  paymentLabel,
  fulfillmentLabel,
  paymentClass,
  fulfillmentClass,
} from "../../utils/ordersUtil";

type Props = {
  readonly orders: readonly any[];
};

export default function OrdersTable({ orders }: Props) {
  return (
    <div className="orders-table-wrapper">
      <table className="orders-table">
        <thead>
          <tr>
            <th></th>
            <th>Pedido</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Teléfono</th>
            <th>Región</th>
            <th>Total</th>
            <th>Estado del pago</th>
            <th>Estado de preparación</th>
            <th>Artículos</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>
                <input type="checkbox" />
              </td>

              <td className="order-id">#{order.order_number}</td>

              <td>{formatShopifyDate(order.created_at)}</td>

              <td>{order.customer?.name}</td>

              <td>{order.customer?.phone}</td>

              <td>{order.customer?.region_type}</td>

              <td className="order-total">
                {order.currency} {order.total_price}
              </td>

              <td>
                <span
                  className={`status ${paymentClass(order.financial_status)}`}
                >
                  ● {paymentLabel(order.financial_status)}
                </span>
              </td>

              <td>
                <span
                  className={`status ${fulfillmentClass(order.fulfillment_status)}`}
                >
                  ● {fulfillmentLabel(order.fulfillment_status)}
                </span>
              </td>

              <td>
                {order.product?.quantity}{" "}
                {order.product?.quantity === 1 ? "artículo" : "artículos"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
