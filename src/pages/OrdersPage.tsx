import { useMemo, useState } from "react";
import Layout from "../layout/Layout";
import "../styles/pages/ordersPage.css";
import { useOrders } from "../hooks/useOrders";
import OrdersHeader from "../components/orders/OrdersHeader";
import OrdersTabs from "../components/orders/OrdersTab";
import OrdersSearch from "../components/orders/OrdersSearch";
import OrdersTable from "../components/orders/OrdersTable";
import OrdersPagination from "../components/orders/OrdersPagination";
import OrdersDateFilter from "../components/orders/OrdersDateFilter";
import OrdersQuickDates from "../components/orders/OrdersQuickDates";

export default function OrdersPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const shop = user.shop || "";

  const { orders, loading, error } = useOrders(shop);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* =========================
  NUEVO FILTRO DE FECHA
  ========================= */

  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  /* =========================
  FILTRO TABS
  ========================= */

  const tabFiltered = useMemo(() => {
    let filtered = orders;

    switch (activeTab) {
      case "confirmar":
        filtered = orders.filter((o) => o.fulfillment_status === null);
        break;

      case "entregado":
        filtered = orders.filter((o) => o.fulfillment_status === "fulfilled");
        break;

      case "pagado":
        filtered = orders.filter((o) => o.financial_status === "paid");
        break;

      case "pendiente":
        filtered = orders.filter((o) => o.financial_status === "pending");
        break;
    }

    return [...filtered].sort((a, b) => b.order_number - a.order_number);
  }, [orders, activeTab]);

  /* =========================
  BUSCADOR + FECHA
  ========================= */

  const filteredOrders = useMemo(() => {
    let filtered = tabFiltered;

    if (search) {
      const term = search.toLowerCase().replace("#", "");

      filtered = filtered.filter(
        (o) =>
          o.customer?.name?.toLowerCase().includes(term) ||
          o.customer?.phone?.toLowerCase().includes(term) ||
          o.order_number?.toString().includes(term),
      );
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter((o) => {
        const orderDate = new Date(`${o.created_day}T00:00:00`);

        return (
          orderDate.getTime() >= dateRange.start!.getTime() &&
          orderDate.getTime() <= dateRange.end!.getTime()
        );
      });
    }

    return filtered;
  }, [tabFiltered, search, dateRange]);

  /* =========================
  PAGINACION
  ========================= */

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  /* =========================
  VALIDACIONES
  ========================= */

  if (!shop) {
    return (
      <Layout>
        <div className="orders-page">
          <p>No se encontró la tienda.</p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="orders-page">
          <p>Cargando pedidos...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="orders-page">
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  /* =========================
  UI
  ========================= */

  return (
    <Layout>
      <div className="orders-page">
        <OrdersHeader title="Pedidos" />

        <OrdersTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="orders-card">
          <div className="orders-toolbar">
            <div className="orders-toolbar-left">
              <OrdersSearch search={search} setSearch={setSearch} />
            </div>

            <div className="orders-toolbar-right">
              <OrdersQuickDates setDateRange={setDateRange} />

              <OrdersDateFilter
                setDateRange={(start, end) => setDateRange({ start, end })}
              />
            </div>
          </div>

          <OrdersTable orders={paginatedOrders} />

          <OrdersPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            totalPages={totalPages}
            totalItems={filteredOrders.length}
          />
        </div>
      </div>
    </Layout>
  );
}
