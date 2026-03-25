import { useState, useMemo } from "react";
import Layout from "../layout/Layout";
import OrdersHeader from "../components/orders/OrdersHeader";
import OrdersFilters from "../components/orders/OrdersFilters";
import OrdersTable from "../components/orders/OrdersTable";
import { useOrdersByFlow } from "../hooks/useOrders";
import OrdersPagination from "../components/orders/OrdersPagination";
import OrderSidePanel from "../components/orders/OrderSidePanel";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("Todos");
  const [activeCourier, setActiveCourier] = useState("Todos");
  const [activeRegion, setActiveRegion] = useState("Todos");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const shop = user.shop;

  const { orders = [], loadOrders, loading } = useOrdersByFlow(shop);

  // 🔥 PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  /* 🔥 DATA PAGINADA */
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return orders.slice(start, end);
  }, [orders, currentPage, rowsPerPage]);

  /* 🔥 TOTAL PÁGINAS */
  const totalPages = Math.ceil(orders.length / rowsPerPage);

  /* 🔥 COUNTS */
  const counts = useMemo(
    () => ({
      todos: orders.length,
      sinAsignar: orders.filter((o) => o.status === "unassigned").length,
      confirmado: orders.filter((o) => o.status === "confirmed").length,
      enviado: orders.filter((o) => o.status === "shipped").length,
      entregado: orders.filter((o) => o.status === "delivered").length,
      cancelado: orders.filter((o) => o.status === "cancelled").length,
    }),
    [orders],
  );

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  return (
    <Layout>
      <div className="orders-page">
        <OrdersHeader />

        <OrdersFilters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeCourier={activeCourier}
          setActiveCourier={setActiveCourier}
          activeRegion={activeRegion}
          setActiveRegion={setActiveRegion}
          orders={orders}
          counts={counts}
          loadOrders={loadOrders}
        />

        <OrdersTable
          orders={paginatedOrders}
          loading={loading}
          onSelectOrder={(order) => setSelectedOrder(order)}
        />

        <OrdersPagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setRowsPerPage}
        />

        {selectedOrder && (
          <OrderSidePanel
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </Layout>
  );
}
