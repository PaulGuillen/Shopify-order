import { useState, useMemo } from "react";
import Layout from "../layout/Layout";
import OrdersHeader from "../components/orders/OrdersHeader";
import OrdersFilters from "../components/orders/OrdersFilters";
import OrdersTable from "../components/orders/OrdersTable";
import { useOrdersByFlow } from "../hooks/useOrders";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("Todos");
  const [activeCourier, setActiveCourier] = useState("Todos");
  const [activeRegion, setActiveRegion] = useState("Todos");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const shop = user.shop;

  const { orders = [], loadOrders, loading } = useOrdersByFlow(shop);

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

        <OrdersTable orders={orders} loading={loading} />
      </div>
    </Layout>
  );
}
