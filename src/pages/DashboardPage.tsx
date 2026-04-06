import { useState } from "react";
import "../styles/pages/dashboardPage.css";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useDashboard } from "../hooks/useDashboard";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [period, setPeriod] = useState("month");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { summary, analytics, loading, reloadAnalytics } = useDashboard(
    user.shop,
  );

  /* =========================
     HANDLERS
  ========================= */

  const handlePeriodChange = (type: string) => {
    setPeriod(type);

    if (type === "day") {
      reloadAnalytics("day", 7);
    }

    if (type === "week") {
      reloadAnalytics("week", 30);
    }

    if (type === "month") {
      reloadAnalytics("month", 90);
    }
  };

  /* =========================
     FORMAT DATA
  ========================= */

  const chartData =
    analytics?.salesSeries?.map((i: any) => ({
      date: i.label,
      current: i.total,
      prev: 0, // luego puedes agregar comparación real
    })) || [];

  /* =========================
     LOADING
  ========================= */

  if (loading && !summary) {
    return <p style={{ padding: 20 }}>Cargando dashboard...</p>;
  }

  const courierColors = [
    { bg: "#f0f9ff", border: "#bae6fd", text: "#0369a1" },
    { bg: "#fdf2f8", border: "#fbcfe8", text: "#be185d" },
    { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534" },
    { bg: "#fff7ed", border: "#fed7aa", text: "#c2410c" },
    { bg: "#eef2ff", border: "#c7d2fe", text: "#4338ca" },
  ];

  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const formatPedidos = (count: number) => {
    return count === 1 ? "1 pedido" : `${count} pedidos`;
  };

  const goToOrdersWithFilters = (filters: any) => {
    // 🔥 guardamos filtros globales
    localStorage.setItem("orders_filters", JSON.stringify(filters));

    // 🔥 navegamos
    navigate("/orders");

    // 🔥 notificamos a OrdersPage
    setTimeout(() => {
      window.dispatchEvent(new Event("orders-filters-update"));
    }, 100);
  };

  return (
    <div className="analytics-container">
      {/* HEADER */}

      <div className="analytics-header">
        <div>
          <h1>Buenos días 🚀</h1>
          <p>Resumen del rendimiento de tu tienda</p>
        </div>
      </div>

      {/* METRICS */}

      <div className="analytics-metrics">
        <div className="metric-card sales">
          <div className="metric-title">Ventas Totales</div>
          <h2>S/ {summary?.totalSales?.toFixed(2) || 0}</h2>
        </div>

        <div
          className="metric-card revenue"
          onClick={() =>
           goToOrdersWithFilters({
              adelanto: "adelanto_activo",
            })
          }
        >
          <div className="metric-title">Adelantos (Ganancia)</div>
          <h2>S/ {summary?.totalRevenue?.toFixed(2) || 0}</h2>
        </div>

        <div
          className="metric-card pending"
          onClick={() =>
            goToOrdersWithFilters({
              adelanto: "por_cobrar",
            })
          }
          style={{ cursor: "pointer" }}
        >
          <div className="metric-title">Pendiente de pago</div>
          <h2>S/ {summary?.totalPending?.toFixed(2) || 0}</h2>
        </div>

        <div className="metric-card orders">
          <div className="metric-title">Total pedidos</div>
          <h2>{summary?.totalOrders || 0}</h2>
        </div>
      </div>

      {/* ==============================
            💳 PAYMENTS
          ============================== */}

      <div className="section-title">Ventas por método de pago</div>

      <div className="analytics-payments">
        {analytics?.paymentSummary?.map((p: any) => (
          <div
            key={p.method}
            className={`payment-card ${p.method}`}
            onClick={() =>
              goToOrdersWithFilters({
                payment: p.method,
                adelanto: "Todos",
              })
            }
            style={{ cursor: "pointer" }}
          >
            <span className="payment-label">
              Venta por {capitalize(p.method)}
            </span>

            <strong>S/ {p.total?.toFixed(2)}</strong>

            <small>{formatPedidos(p.count)}</small>
          </div>
        ))}
      </div>

      {/* CHART */}

      <div className="analytics-chart">
        <div className="chart-header">
          <div>
            <h3>Ventas en el tiempo</h3>
            <p>Basado en pedidos activos</p>
          </div>

          <div className="chart-tabs">
            <button
              className={period === "day" ? "active" : ""}
              onClick={() => handlePeriodChange("day")}
            >
              Día
            </button>

            <button
              className={period === "week" ? "active" : ""}
              onClick={() => handlePeriodChange("week")}
            >
              Semana
            </button>

            <button
              className={period === "month" ? "active" : ""}
              onClick={() => handlePeriodChange("month")}
            >
              Mes
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <CartesianGrid stroke="#eef2f7" />
            <XAxis dataKey="date" />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="prev"
              stroke="#cbd5e1"
              fill="#e2e8f0"
              strokeWidth={2}
            />

            <Area
              type="monotone"
              dataKey="current"
              stroke="#4f46e5"
              fill="#6366f1"
              fillOpacity={0.35}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* PRODUCTS */}

      <div className="products-card">
        <div className="products-header">
          <h3>Productos más vendidos</h3>
          <span>Ver todos</span>
        </div>

        <div className="products-grid">
          {analytics?.topProducts?.length > 0 ? (
            analytics.topProducts.map((p: any, i: number) => (
              <div key={i} className="product-card">
                <img
                  src={
                    p.image ||
                    "https://cdn-icons-png.flaticon.com/512/891/891462.png"
                  }
                  alt={p.name}
                />

                <div className="product-data">
                  <span>{p.name}</span>
                  <small>{p.quantity} unidades vendidas</small>
                </div>

                <div className="product-price">S/ {p.revenue.toFixed(2)}</div>
              </div>
            ))
          ) : (
            <p style={{ padding: 10 }}>No hay productos</p>
          )}
        </div>
      </div>
    </div>
  );
}
