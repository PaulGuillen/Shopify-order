import { useEffect, useMemo, useState } from "react";
import Layout from "../layout/Layout";
import "../styles/pages/ordersPage.css";

/* =========================
INTERFACE BACKEND
========================= */

interface Order {
  order_id: number;
  order_number: number;

  created_day: string;

  financial_status: string;
  fulfillment_status: string | null;

  total_price: number;
  currency: string;

  customer: {
    name: string | null;
    phone: string | null;
    city: string | null;
  };

  product: {
    name: string;
    quantity: number;
  } | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState("todos");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  /* =========================
   MOCK BACKEND
  ========================= */

  useEffect(() => {
    const mockOrders: Order[] = [
      {
        order_id: 1,
        order_number: 1024,
        created_day: "2024-03-06",

        financial_status: "paid",
        fulfillment_status: "fulfilled",

        total_price: 120,
        currency: "USD",

        customer: {
          name: "Juan Perez",
          phone: "999111222",
          city: "Lima",
        },

        product: {
          name: "Zapatillas Nike",
          quantity: 1,
        },
      },

      {
        order_id: 2,
        order_number: 1025,
        created_day: "2024-03-07",

        financial_status: "pending",
        fulfillment_status: null,

        total_price: 80,
        currency: "USD",

        customer: {
          name: "Maria Lopez",
          phone: "988222333",
          city: "San Isidro",
        },

        product: {
          name: "Polera Adidas",
          quantity: 2,
        },
      },
    ];

    setOrders(mockOrders);
  }, []);

  /* =========================
  FILTRO TABS
  ========================= */

  const tabFiltered = useMemo(() => {
    switch (activeTab) {
      case "confirmar":
        return orders.filter((o) => o.fulfillment_status === null);

      case "entregado":
        return orders.filter((o) => o.fulfillment_status === "fulfilled");

      case "pagado":
        return orders.filter((o) => o.financial_status === "paid");

      case "pendiente":
        return orders.filter((o) => o.financial_status === "pending");

      default:
        return orders;
    }
  }, [orders, activeTab]);

  /* =========================
  BUSCADOR
  ========================= */

  const filteredOrders = useMemo(() => {
    if (!search) return tabFiltered;

    return tabFiltered.filter((o) =>
      o.customer?.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [tabFiltered, search]);

  /* =========================
  PAGINACION
  ========================= */

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  /* =========================
  RENDER
  ========================= */

  return (
    <Layout>
      <div className="orders-page">
        {/* HEADER */}

        <div className="orders-header">
          <h1>Pedidos</h1>

          <div className="orders-actions">
            <button className="btn-secondary">Exportar</button>

            <button className="btn-primary">Crear pedido</button>
          </div>
        </div>

        {/* TABS */}

        <div className="orders-tabs">
          <button
            className={activeTab === "todos" ? "active" : ""}
            onClick={() => setActiveTab("todos")}
          >
            Todos
          </button>

          <button
            className={activeTab === "confirmar" ? "active" : ""}
            onClick={() => setActiveTab("confirmar")}
          >
            Por confirmar
          </button>

          <button
            className={activeTab === "entregado" ? "active" : ""}
            onClick={() => setActiveTab("entregado")}
          >
            Entregado
          </button>

          <button
            className={activeTab === "pagado" ? "active" : ""}
            onClick={() => setActiveTab("pagado")}
          >
            Pagado
          </button>

          <button
            className={activeTab === "pendiente" ? "active" : ""}
            onClick={() => setActiveTab("pendiente")}
          >
            Pendiente
          </button>
        </div>

        {/* CARD TABLA */}

        <div className="orders-card">
          {/* BUSCADOR */}

          <div className="orders-filter">
            <input
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* TABLA */}

          <table className="orders-table">
            <thead>
              <tr>
                <th></th>
                <th>Pedido</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Ciudad</th>
                <th>Producto</th>
                <th>Total</th>
                <th>Pago</th>
                <th>Envío</th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.order_id}>
                  <td>
                    <input type="checkbox" />
                  </td>

                  <td className="order-id">#{order.order_number}</td>

                  <td>{order.created_day}</td>

                  <td>{order.customer?.name}</td>

                  <td>{order.customer?.phone}</td>

                  <td>{order.customer?.city}</td>

                  <td>{order.product?.name}</td>

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
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINACION */}

          <div className="orders-pagination">
            <p>
              Mostrando {(currentPage - 1) * rowsPerPage + 1} a{" "}
              {Math.min(currentPage * rowsPerPage, filteredOrders.length)} de{" "}
              {filteredOrders.length} pedidos
            </p>

            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ‹
              </button>

              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* CARDS INFERIORES */}

        <div className="orders-cards">
          <div className="info-card highlight">
            <div className="card-icon">🚀</div>

            <h3>Escala tus ventas</h3>

            <p>Automatiza tu flujo de pedidos y mejora el control de envíos.</p>
          </div>

          <div className="info-card">
            <div className="card-icon">📦</div>

            <h3>Gestión de pedidos</h3>

            <p>Controla pedidos pendientes, confirmados y entregados.</p>
          </div>

          <div className="info-card">
            <div className="card-icon">💳</div>

            <h3>Control de pagos</h3>

            <p>Visualiza pagos confirmados o pendientes en tiempo real.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

/* =========================
HELPERS
========================= */

function paymentLabel(status: string) {
  switch (status) {
    case "paid":
      return "Pagado";

    case "pending":
      return "Pendiente";

    default:
      return status;
  }
}

function fulfillmentLabel(status: string | null) {
  switch (status) {
    case "fulfilled":
      return "Entregado";

    case null:
      return "Por confirmar";

    default:
      return status;
  }
}

function paymentClass(status: string) {
  switch (status) {
    case "paid":
      return "status-paid";

    case "pending":
      return "status-pending";

    default:
      return "";
  }
}

function fulfillmentClass(status: string | null) {
  switch (status) {
    case "fulfilled":
      return "status-delivered";

    case null:
      return "status-confirm";

    default:
      return "";
  }
}
