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

  const {
    orders = [],
    ordersBase = [],
    loadOrders,
    loading,
  } = useOrdersByFlow(shop);

  // 🔥 PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  /* 🔥 DATA PAGINADA */
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        if (activeCourier === "Todos") return true;
        return o.courier === activeCourier;
      })
      .filter((o) => {
        if (activeRegion === "Todos") return true;
        return o.customer?.region_type === activeRegion;
      });
  }, [orders, activeCourier, activeRegion]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage, rowsPerPage]);

  /* 🔥 TOTAL PÁGINAS */
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  /* 🔥 COUNTS */
  const counts = useMemo(
    () => ({
      todos: ordersBase.length,
      sinAsignar: ordersBase.filter((o) => o.status === "unassigned").length,
      porContactar: ordersBase.filter((o) => o.status === "to_contact").length,
      contactado: ordersBase.filter((o) => o.status === "contacted").length,
      confirmado: ordersBase.filter((o) => o.status === "confirmed").length,
      enviado: ordersBase.filter((o) => o.status === "shipped").length,
      entregado: ordersBase.filter((o) => o.status === "delivered").length,
      cancelado: ordersBase.filter((o) => o.status === "cancelled").length,
      noEntregado: ordersBase.filter((o) => o.status === "not_delivered")
        .length,
    }),
    [ordersBase],
  );

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  return (
    <Layout>
      <div className="orders-page">
        <OrdersHeader />

        <OrdersFilters
          loadOrders={loadOrders}
          counts={counts}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeCourier={activeCourier}
          setActiveCourier={setActiveCourier}
          activeRegion={activeRegion}
          setActiveRegion={setActiveRegion}
          orders={orders}
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
